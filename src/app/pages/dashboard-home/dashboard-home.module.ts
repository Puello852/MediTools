import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DashboardHomePage } from './dashboard-home.page';
import { EditProfilePage } from '../tabs/edit-profile/edit-profile.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardHomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [EditProfilePage]
})
export class DashboardHomePageModule {}
