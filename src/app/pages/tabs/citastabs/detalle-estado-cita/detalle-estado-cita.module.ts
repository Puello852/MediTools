import { LOCALE_ID,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DetalleEstadoCitaPage } from './detalle-estado-cita.page';
 // importar locales

 import localeMx from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
const routes: Routes = [
  {
    path: '',
    component: DetalleEstadoCitaPage
  }
];
 // registrar los locales con el nombre que quieras utilizar a la hora de proveer
 registerLocaleData(localeMx, 'es-MX');
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'es-MX' } ],
  declarations: [DetalleEstadoCitaPage]
})
export class DetalleEstadoCitaPageModule {}
