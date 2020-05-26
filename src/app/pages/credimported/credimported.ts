import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'page-credimported',
  templateUrl: 'credimported.html',
  styleUrls: ['credimported.scss'],
})
export class CredImportedPage {
  constructor(
    public navCtrl: NavController,
    private zone: NgZone,
    public toastController: ToastController
  ) {
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.HOME);
    titleBarManager.setIcon(TitleBarPlugin.TitleBarIconSlot.INNER_LEFT, {
      key: "back",
      iconPath: TitleBarPlugin.BuiltInIcon.BACK
    });

    titleBarManager.setTitle("Credential imported");
  }
}
