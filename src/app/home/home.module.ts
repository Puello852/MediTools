import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { RecaptchaModule,RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
@NgModule({
  imports: [
    RecaptchaV3Module,
    CommonModule,
    FormsModule,
    RecaptchaModule.forRoot(),
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  providers:[{provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LcuALUUAAAAAKgEJPPhzTYi0fB5QPocCDSXNeCz'}],
  declarations: [HomePage]
})
export class HomePageModule {}
