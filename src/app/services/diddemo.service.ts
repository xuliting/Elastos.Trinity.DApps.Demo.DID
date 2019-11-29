import { Injectable, NgZone } from '@angular/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';

declare let appManager: AppManagerPlugin.AppManager;
let managerService = null;

@Injectable({
    providedIn: 'root'
})
export class DIDDemoService {
    private handledIntentId: string;
    private connectApplicationProfileData: {
        // TODO
    }

    constructor(
        private platform: Platform,
        public zone: NgZone) {
        managerService = this;
    }

    init() {
        console.log("Main service init");

        // Load app manager only on real device, not in desktop browser - beware: ionic 4 bug with "desktop" or "android"/"ios"
        if (this.platform.platforms().indexOf("cordova") >= 0) {
            console.log("Listening to intent events")
            appManager.setIntentListener(
                this.onReceiveIntent
            );
        }
    }

    onReceiveIntent(ret) {
        console.log("Intent received", ret);
        managerService.handledIntentId = ret.intentId;

        switch (ret.action) {
            case "connectapplicationprofile":
                console.log("Received connectapplicationprofile intent request");

                managerService.connectApplicationProfileData = ret.params;

                // Display the connection screen
                managerService.navController.navigateRoot("/connect");
                break;
        }
    }
}
