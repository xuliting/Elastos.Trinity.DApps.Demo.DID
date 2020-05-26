import { Injectable, NgZone } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

let managerService = null;

@Injectable({
    providedIn: 'root'
})
export class DIDDemoService {
    private handledIntentId: Number;
    public connectApplicationProfileData: any;

    constructor(
        private platform: Platform,
        private navController: NavController,
        private toastCtrl: ToastController,
        public zone: NgZone) {
        managerService = this;
    }

    init() {
        console.log("Main service init");

        // Load app manager only on real device, not in desktop browser - beware: ionic 4 bug with "desktop" or "android"/"ios"
        if (this.platform.platforms().indexOf("cordova") >= 0) {
            console.log("Listening to intent events")
            appManager.setIntentListener((intent: AppManagerPlugin.ReceivedIntent)=>{
                this.onReceiveIntent(intent);
            });

            titleBarManager.setBackgroundColor("#181d20");
            titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
            titleBarManager.addOnItemClickedListener((menuIcon)=>{
              if (menuIcon.key == "back") {
                  this.navController.back();
              }
            });
        }

        this.navController.navigateRoot("/home");
    }

    onReceiveIntent(ret: AppManagerPlugin.ReceivedIntent) {
        console.log("Intent received", ret);
        this.handledIntentId = ret.intentId;

        switch (ret.action) {
            case "connectapplicationprofile":
                console.log("Received connectapplicationprofile intent request");

                this.connectApplicationProfileData = ret.params;

                // Display the connection screen
                this.navController.navigateRoot("/connect");
                break;
        }
    }

    public toast(_message: string, duration: number = 4000): void {
        this.toastCtrl.create({
            message: _message,
            duration: duration,
            position: 'top'
        }).then(toast => toast.present());
    }
}
