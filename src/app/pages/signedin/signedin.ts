import { Component, NgZone, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute, RouterEvent, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { DIDDemoService } from 'src/app/services/diddemo.service';

declare let appManager: AppManagerPlugin.AppManager;
declare let didManager: DIDPlugin.DIDManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'page-signedin',
  templateUrl: 'signedin.html',
  styleUrls: ['signedin.scss'],
})
export class SignedInPage {
  public signedIn: boolean = false;
  public did: string = "";
  public userName: string = "";
  public emailAddress: string = "";

  constructor(
    public navCtrl: NavController,
    private zone: NgZone,
    private didDemoService: DIDDemoService,
    private router: Router,
    private route: ActivatedRoute,
    private navController: NavController,
    public toastController: ToastController
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url.startsWith("/signedin")) {
        var did = this.route.snapshot.queryParamMap.get("did");
        var presentationJson = this.route.snapshot.queryParamMap.get("presentation");
        this.updatePresentationInfo(did, presentationJson);
      }
    });
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.HOME);
    titleBarManager.setIcon(TitleBarPlugin.TitleBarIconSlot.INNER_LEFT, {
      key: "back",
      iconPath: TitleBarPlugin.BuiltInIcon.BACK
    });

    titleBarManager.setTitle();
  }

  private updatePresentationInfo(did, presentationJson) {
    // Create a real presentation object from json data
    didManager.VerifiablePresentationBuilder.fromJson(JSON.stringify(presentationJson), (presentation)=>{
      this.zone.run(()=>{
        this.did = did;

        // Extract data from the presentation
        let credentials = presentation.getCredentials();
        console.log("Credentials:", credentials);

        this.userName = this.findCredentialValueById(this.did, credentials, "name", "Not provided");
        this.emailAddress = this.findCredentialValueById(this.did, credentials, "email", "Not provided");
      });
    });
  }

  /**
   * From a given short format credential id (fragment), retrieve the related credential
   * in a list of credentials.
   */
  findCredentialValueById(did: string, credentials: DIDPlugin.VerifiableCredential[], fragment: string, defaultValue: string) {
    let matchingCredential = credentials.find((c)=>{
      return c.getFragment() == fragment;
    });

    if (!matchingCredential)
      return defaultValue;
    else
      return matchingCredential.getSubject()[fragment];
  }

  issueCredential() {
    /**
     * Ask the DID app to generate a VerifiableCredential with some data, and use current DID
     * as the signing issuer for this credential, so that others can permanently verifiy who
     * issued the credential. 
     * This credential can then be delivered to a third party who can import it (credimport) to 
     * his DID profile.
     * 
     * For this demo, the subject DID is ourself, so we will be able to import the credential we issued
     * to our own DID profile (which is a useless use case, as usually DIDs are issued for others).
     */
    appManager.sendIntent("credissue", {
      identifier: "customcredentialkey", // unique identifier for this credential
      types: ["MyCredentialType"], // Additional credential types (strings) such as BasicProfileCredential.
      subjectdid: this.did, // DID targeted by the created credential. Only that did will be able to import the credential.
      properties: {
          customData: "Here is a test data that will appear in someone else's DID document after he imports it.",
          moreComplexData: {
            info: "A sub-info"
          }
      },
      expirationdate: new Date(2024, 10, 10) // Credential will expire on 2024-10-10
    }, {}, (response) => {
      if (response.result.credential) {
        this.zone.run(() => {
          this.navCtrl.navigateForward("credissued", {
            queryParams: {
              credential: response.result.credential
            }
          });
        })
      }
      else {
        this.didDemoService.toast("Failed to issue a credential - empty credential returned");
      }
    }, (err)=>{
      this.didDemoService.toast("Failed to issue a credential: "+JSON.stringify(err));
    })
  }
}
