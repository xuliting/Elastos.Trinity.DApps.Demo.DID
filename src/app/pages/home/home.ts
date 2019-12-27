import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';

declare let appManager: AppManagerPlugin.AppManager;
declare let didManager: DIDPlugin.DIDManager;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public signedIn = false;
  public did: string = "";
  public userName: string = "";
  public emailAddress: string = "";
  public applicationProfileRegistered = false;

  constructor(public navCtrl: NavController, private zone: NgZone) {
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
    }, (response: any) => {
      console.log("Credential access response received", response)

      if (response && response.result && response.result.presentation) {
        console.log("Received a presentation, so we are now signed in.");
        let data = response.result;

        // Create a real presentation object from json data
        didManager.VerifiablePresentationBuilder.fromJson(JSON.stringify(response.result.presentation), (presentation)=>{
          this.zone.run(()=>{
            this.signedIn = true;
  
            // Conveniently provided by the DID app in addition to the VerifiablePresentation
            this.did = data.did;
  
            // Extract data from the presentation
            let credentials = presentation.getCredentials();
            console.log("Credentials:", credentials);

            this.userName = this.findCredentialValueById(this.did, credentials, "name", "Not provided");
            this.emailAddress = this.findCredentialValueById(this.did, credentials, "email", "Not provided");
          });
        });
      }
    })
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

  generateApplicationProfile() {
    /**
     * Ask the DID app to register an application profile
     */
    var self = this;
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
    }, (response) => {
      console.log("application profile registered")
      console.log(response)
      self.applicationProfileRegistered = true;
    })
  }
}
