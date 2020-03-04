import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomePage } from './pages/home/home';
import { ConnectPage } from './pages/connect/connect';
import { SignPage } from './pages/sign/sign';

const routes: Routes = [
//   { path: '', redirectTo: 'home', pathMatch: 'full' }, // No default route.
  { path: 'home', component: HomePage },
  { path: 'sign', component: SignPage },
  { path: 'connect', component: ConnectPage },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
