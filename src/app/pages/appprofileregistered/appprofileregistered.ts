import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'page-appprofileregistered',
  templateUrl: 'appprofileregistered.html',
  styleUrls: ['appprofileregistered.scss'],
})
export class AppProfileRegisteredPage {
  public did: string = "";
  public userName: string = "";
  public emailAddress: string = "";
  public applicationProfileRegistered: boolean = false;

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

    titleBarManager.setTitle("Profile registered!");
  }
}
