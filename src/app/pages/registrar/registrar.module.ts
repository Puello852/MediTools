import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistrarPage } from './registrar.page';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { RecaptchaModule } from 'ng-recaptcha';

const routes: Routes = [
  {
    path: '',
    component: RegistrarPage
  }
];

@NgModule({
  imports: [
    RecaptchaModule,
    AngularFireAuthModule,
    CommonModule,
    RecaptchaModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers:[
    // { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6Ldk7b4UAAAAAEo9h5a6p_7m9Mg1E7pA_G1PUrPp' },
    // RecaptchaComponent,
    AuthenticationService
  ],
  declarations: [RegistrarPage]
})
export class RegistrarPageModule {}
