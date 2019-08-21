import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfileTabsPage } from './profile-tabs.page';
import { EditProfilePage } from '../edit-profile/edit-profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileTabsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfileTabsPage],entryComponents:[]
})
export class ProfileTabsPageModule {}
