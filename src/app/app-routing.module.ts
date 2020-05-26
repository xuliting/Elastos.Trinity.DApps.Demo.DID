import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomePage } from './pages/home/home';
import { ConnectPage } from './pages/connect/connect';
import { SignPage } from './pages/sign/sign';
import { SignedInPage } from './pages/signedin/signedin';
import { AppProfileRegisteredPage } from './pages/appprofileregistered/appprofileregistered';
import { CredIssuedPage } from './pages/credissued/credissued';
import { CredImportedPage } from './pages/credimported/credimported';

const routes: Routes = [
//   { path: '', redirectTo: 'home', pathMatch: 'full' }, // No default route.
  { path: 'home', component: HomePage },
  { path: 'sign', component: SignPage },
  { path: 'connect', component: ConnectPage },
  { path: 'signedin', component: SignedInPage },
  { path: 'appprofileregistered', component: AppProfileRegisteredPage },
  { path: 'credissued', component: CredIssuedPage },
  { path: 'credimported', component: CredImportedPage },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, enableTracing: false })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
