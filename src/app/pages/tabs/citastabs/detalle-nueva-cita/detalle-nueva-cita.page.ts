import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { ApiToolsService } from 'src/app/services/api-tools.service';
import { AlertController, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { PickerController } from '@ionic/angular'
import { PedirCitaPage } from './pedir-cita/pedir-cita.page';
@Component({
  selector: 'app-detalle-nueva-cita',
  templateUrl: './detalle-nueva-cita.page.html',
  styleUrls: ['./detalle-nueva-cita.page.scss'],
})
export class DetalleNuevaCitaPage implements OnInit {
  medico: any = [];
  idDoctor: any;
  dato: any;
  mes: any;
  fechaCita: any;
  horaCita: any;
  constructor(public modalController: ModalController,private picker: PickerController, public loadingController: LoadingController,public toastController: ToastController,public alertController: AlertController,private location: Location,private route: ActivatedRoute,private api:ApiToolsService) {
    this.route.params.subscribe((e:any)=>{
      this.idDoctor = e.id
      this.obtenerMedico(e.id)
    })
   }

  ngOnInit() {
  }
  //Obtener el medico por id
  obtenerMedico(e){
    let data = {
      idDoctor: e
    }
    this.api.obetenerMedicoId(data).subscribe((data:any)=>{
        this.medico = data[0]
    })
  }
  //Modal para abrir el calendario para pedir la cita
  async pedirCita(){
    const modal = await this.modalController.create({
        component: PedirCitaPage,
        componentProps: {
          'idDoctor': this.idDoctor,
          'tipoAtencion': this.medico.tipoatencion
        }
      })
      return await modal.present();
  
  }

  //Back button
  back(){
    this.location.back();
  }
}
