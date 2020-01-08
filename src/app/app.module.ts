import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';

import { MyApp } from './app.component';
import { ComponentsModule } from './components/components.module';

import { HomePage } from './pages/home/home';
import { ConnectPage } from './pages/connect/connect';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { SharedModule } from './modules/shared.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ConnectPage
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ComponentsModule,
    IonicModule.forRoot()
  ],
  bootstrap: [MyApp],
  entryComponents: [
    MyApp,
    HomePage,
    ConnectPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Platform,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: ErrorHandler, useClass: ErrorHandler}
  ]
})
export class AppModule {}
