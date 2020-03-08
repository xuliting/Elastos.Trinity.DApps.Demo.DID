import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { DIDDemoService } from 'src/app/services/diddemo.service';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager; 

@Component({
  selector: 'page-connect',
  templateUrl: 'connect.html',
  styleUrls: ['connect.scss'],
})
export class ConnectPage {
  public appProfileDataItems: {
    key: string,
    value: string
  }[] = [];

  constructor(public navCtrl: NavController, public didDemoService: DIDDemoService) {
    for (let key of Object.keys(didDemoService.connectApplicationProfileData)) {
      this.appProfileDataItems.push({
        key: key,
        value: didDemoService.connectApplicationProfileData[key]
      })
    }

    console.log(this.appProfileDataItems)
  }

  ionViewDidEnter() {
    appManager.setVisible("show", ()=>{}, (err)=>{});

    titleBarManager.setTitle("DIDDemo @ Connect");
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.CLOSE);
  }
}
