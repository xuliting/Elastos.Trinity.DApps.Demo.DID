import { Injectable, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
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
            appManager.setListener((msg: any)=>{
                // TEST
                console.log(JSON.stringify(msg));

                if (msg.message == "navback") {
                    console.log("NAVBACK")
                    this.navController.pop();
                }
            })

            titleBarManager.setBackgroundColor("#181d20");
            titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
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
}
