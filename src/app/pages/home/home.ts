import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public signedIn = false;
  public userName: string = "";
  public emailAddress: string = "";
  public applicationProfileRegistered = false;

  constructor(public navCtrl: NavController) {
  }

  signIn() {
    /**
     * Request some credentials to the DID application.
     */
    var self = this;
    appManager.sendIntent("credaccess", {
      claims: [
        { name: true }, // Mandatory to receive
        {
          email: {
            required: false, // User can choose to tell us his email address or not
            reason: "To send you a newsletter"
          }
        }
      ]
    }, function(credentials) {
      console.log("credentials received")
      console.log(credentials)
      self.signedIn = true;

      self.userName = credentials.verifiableCredential[0].credentialSubject.name; // TODO - CHECK
      self.emailAddress = credentials.verifiableCredential[0].credentialSubject.email // TODO - CHECK
    })
  }

  generateApplicationProfile() {
    /**
     * Ask the DID app to register an application profile
     */
    var self = this;
    appManager.sendIntent("registerapplicationprofile", {
      claims: [
        {name: true},
        {
          email: {
            required: false,
            reason: "To send you a newsletter"
          }
        }
      ]
    }, function(response) {
      console.log("application profile registered")
      console.log(response)
      self.applicationProfileRegistered = true;
    })
  }
}
