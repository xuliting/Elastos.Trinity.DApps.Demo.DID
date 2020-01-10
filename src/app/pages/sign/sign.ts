import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { DIDDemoService } from 'src/app/services/diddemo.service';

declare let appManager: AppManagerPlugin.AppManager; 

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
}
