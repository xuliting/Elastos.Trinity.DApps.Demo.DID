import { Component, NgZone, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

declare let appManager: AppManagerPlugin.AppManager;
declare let didManager: DIDPlugin.DIDManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styleUrls: ['home.scss'],
})
export class HomePage {
  public did: string = "";
  public userName: string = "";
  public emailAddress: string = "";

  constructor(
    public navCtrl: NavController,
    private zone: NgZone,
    private navController: NavController,
    public toastController: ToastController
  ) {
  }

  ionViewWillEnter() {
    titleBarManager.setIcon(TitleBarPlugin.TitleBarIconSlot.INNER_LEFT, null);
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.HOME);

    titleBarManager.setTitle();
  }

  signIn() {
    /**
     * Request some credentials to the DID application.
     */
    appManager.sendIntent("credaccess", {
      claims: {
        name: true, // Mandatory to receive
        email: {
          required: false, // User can choose to tell us his email address or not
          reason: "To send you a newsletter"
        }
      }
    }, {}, (response: any) => {
      console.log("Credential access response received", JSON.stringify(response))

      if (response && response.result && response.result.presentation) {
        console.log("Received a presentation, so we are now signed in.");
        let data = response.result;

        this.zone.run(()=>{
          this.navController.navigateForward("signedin", {
            queryParams: {
              did: data.did,
              presentation: response.result.presentation
            }
          });
        });
      }
    })
  }

  generateApplicationProfile() {
    /**
     * Ask the DID app to register an application profile
     */
    appManager.sendIntent("registerapplicationprofile", {
      identifier: "did-demo-app-profile",
      connectactiontitle: "Reach out in DID Demo dApp",
      customcredentialtypes: [],
      sharedclaims: [
        {
          diddemoid: "abcdef"
        }
      ],
      diddemoid:"abcdef",
      otherCustomFieldDIDDemoAppWillReceiveFromConnectAppProfileIntent:"my-custom-field"
    }, {}, (response) => {
      this.zone.run(() => {
        this.navCtrl.navigateForward("appprofileregistered");
      })
    })
  }

  signData() {
    this.navController.navigateForward(["/sign"]);
  }
}
