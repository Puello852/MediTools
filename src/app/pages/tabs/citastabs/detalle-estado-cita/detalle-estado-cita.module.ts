import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetalleEstadoCitaPage } from './detalle-estado-cita.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleEstadoCitaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetalleEstadoCitaPage]
})
export class DetalleEstadoCitaPageModule {}
