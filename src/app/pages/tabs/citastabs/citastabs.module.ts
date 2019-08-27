import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CitastabsPage } from './citastabs.page';
import { NgCalendarModule  } from 'ionic2-calendar';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgregarCitasTabsPage } from './agregar-citas-tabs/agregar-citas-tabs.page';

registerLocaleData(es);
const routes: Routes = [
  {
    path: '',
    component: CitastabsPage
  }
];

@NgModule({
  imports: [
    NgCalendarModule,
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers:[{ provide: LOCALE_ID, useValue: 'es-MX' }],
  declarations: [CitastabsPage,AgregarCitasTabsPage],entryComponents:[AgregarCitasTabsPage]
})
export class CitastabsPageModule {}
