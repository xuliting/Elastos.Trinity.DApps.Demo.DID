import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DIDDemoService } from 'src/app/services/diddemo.service';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

type SignResult = {
  signingdid: string,
  publickey: string,
  signature: string
}

type SignIntentResponse = {
  result: SignResult
}

@Component({
  selector: 'page-sign',
  templateUrl: 'sign.html',
  styleUrls: ['sign.scss'],
})
export class SignPage {
  public dataToSign = "Hello elastOS";
  public dataSigned: boolean = false;
  public signResult: SignResult = null;

  constructor(public navCtrl: NavController, public didDemoService: DIDDemoService, private zone: NgZone) {
  }

  ionViewWillEnter() {
    this.dataSigned = false;

    titleBarManager.setTitle("DIDDemo @ Sign");
    this.setTitleBarBackKeyShown(true);
  }

  ionViewWillLeave() {
    this.setTitleBarBackKeyShown(false);
  }

  signSampleData() {
    appManager.sendIntent("sign", {
      data: this.dataToSign
    }, null, (responseData: SignIntentResponse)=>{
      console.log("Got intent response:", responseData);

      this.zone.run(()=>{
        if (responseData && responseData.result) {
          this.signResult = responseData.result;
          this.dataSigned = true;
        }
      });

    }, (err)=>{
      console.error(err);
    });
  }

  setTitleBarBackKeyShown(show: boolean) {
    if (show) {
        titleBarManager.setIcon(TitleBarPlugin.TitleBarIconSlot.INNER_LEFT, {
            key: "back",
            iconPath: TitleBarPlugin.BuiltInIcon.BACK
        });
    }
    else {
        titleBarManager.setIcon(TitleBarPlugin.TitleBarIconSlot.INNER_LEFT, null);
    }
  }
}
