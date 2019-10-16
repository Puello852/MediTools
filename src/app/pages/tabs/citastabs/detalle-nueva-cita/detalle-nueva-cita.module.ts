import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DetalleNuevaCitaPage } from './detalle-nueva-cita.page';
import { NgCalendarModule } from 'ionic2-calendar';
import { PedirCitaPage } from './pedir-cita/pedir-cita.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleNuevaCitaPage
  }
];

@NgModule({
  imports: [
    NgCalendarModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetalleNuevaCitaPage,PedirCitaPage],entryComponents:[PedirCitaPage]
})
export class DetalleNuevaCitaPageModule {}
