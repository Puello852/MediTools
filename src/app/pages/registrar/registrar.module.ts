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
    AngularFireAuthModule,
    CommonModule,
    RecaptchaModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers:[
    AuthenticationService
  ],
  declarations: [RegistrarPage]
})
export class RegistrarPageModule {}
