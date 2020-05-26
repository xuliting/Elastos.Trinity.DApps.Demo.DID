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
  selector: 'page-credissued',
  templateUrl: 'credissued.html',
  styleUrls: ['credissued.scss'],
})
export class CredIssuedPage {
  private rawIssuedCredential: any;

  constructor(
    public navCtrl: NavController,
    private zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private navController: NavController,
    private didDemoService: DIDDemoService,
    public toastController: ToastController
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url.startsWith("/credissued")) {
        this.rawIssuedCredential = this.route.snapshot.queryParamMap.get("credential");
        console.log("CredIssuedPage got raw credential: "+JSON.stringify(this.rawIssuedCredential));
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

  importCredential() {
    let credentialAsObject = JSON.parse(this.rawIssuedCredential);

    /**
     * Ask the DID app to re-import the credential we just issued ourselves. This is possible because
     * the demo credential we have issued on the previous screen defined the subject DID as being ouself
     * (ourself issued a credential to ourself).
     */
    appManager.sendIntent("credimport", {
      credentials: [ // We can import several credentials at a time if needed
        credentialAsObject
      ]
    }, {}, (response) => {
      this.zone.run(() => {
        this.navCtrl.navigateForward("credimported");
      })
    }, (err)=>{
      this.didDemoService.toast("Failed to import the credential: "+JSON.stringify(err));
    })
  }
}
