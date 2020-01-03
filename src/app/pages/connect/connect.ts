import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { DIDDemoService } from 'src/app/services/diddemo.service';

@Component({
  selector: 'page-connect',
  templateUrl: 'connect.html'
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
}
