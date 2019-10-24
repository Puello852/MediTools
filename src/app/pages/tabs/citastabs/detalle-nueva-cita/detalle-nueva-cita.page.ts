import { Component, OnInit } from '@angular/core';
import { faStar,faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { Location } from "@angular/common";
import { Router, Route, ActivatedRoute } from '@angular/router';
import { ApiToolsService } from 'src/app/services/api-tools.service';
import { AlertController, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { PickerController } from '@ionic/angular'
import { PickerOptions } from '@ionic/core';
import moment from 'moment';
import { PedirCitaPage } from './pedir-cita/pedir-cita.page';
@Component({
  selector: 'app-detalle-nueva-cita',
  templateUrl: './detalle-nueva-cita.page.html',
  styleUrls: ['./detalle-nueva-cita.page.scss'],
})
export class DetalleNuevaCitaPage implements OnInit {
  cog = faStar
  arrow = faArrowAltCircleRight
  medico: any = [];
  idDoctor: any;
  dato: any;
  fechaCita: any;
  calendar = {
    locale: 'es-MX',
    mode: 'month',
    currentDate: new Date(),
  };
  horaCita: any;
  mes: any;
  constructor(public modalController: ModalController,private picker: PickerController, public loadingController: LoadingController,public toastController: ToastController,public alertController: AlertController,private location: Location,private route: ActivatedRoute,private api:ApiToolsService) {
    this.route.params.subscribe((e:any)=>{
      this.idDoctor = e.id
      this.obtenerMedico(e.id)
    })
   }

  ngOnInit() {
  }

  onViewTitleChanged(e){
    this.mes = e
  }
  onEventSelected(e){
    console.log(e)
  }
  onTimeSelected(e){
    console.log(e)
  }
  obtenerMedico(e){
    let data = {
      idDoctor: e
    }
    this.api.obetenerMedicoId(data).subscribe((data:any)=>{
        this.medico = data[0]
    })
  }

  async pedirCita(){

    const modal = await this.modalController.create({
        component: PedirCitaPage,
        // cssClass: 'modals',
        componentProps: {
          'idDoctor': this.idDoctor,
          'tipoAtencion': this.medico.tipoatencion
        }
      })
      return await modal.present();
  
  }

  async pedirCita2(){


    

    const alert = await this.alertController.create({
      header: '¿Estas seguro?',
      message: 'Deseas enviar esta solicitud al médico',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
           
          }
        }, {
          text: 'Enviar',
          handler: async () => {

            if(this.medico.tipoatencion == 1){
              //es por horario manda fecha y hora
              
            }else{
              //manda solo la fecha 
            }
             const loading = await this.loadingController.create({
               message: 'Por favor espere...',
             });
             await loading.present();
             let data = {
               servicio: this.medico.especialidad,
               idDoctor: this.medico.id,
               estado: 'Pendiente',
              fecha: this.fechaCita,
              hora: this.horaCita
             }
             this.api.pedircita(data).subscribe(async ()=>{
               loading.dismiss()
               const toast = await this.toastController.create({
                 message: 'Cita enviada exitosamente',
                 duration: 2000
               });
               toast.present();
               this.back()
             },async erro=>{
               const alert = await this.alertController.create({
                 header: 'Hola',
                 message: erro.error.message,
                 buttons: ['OK']
               });
          
               await alert.present();
               loading.dismiss()
             })
          }
        }
      ]
    });

    await alert.present();
    
   
  }

  back(){
    this.location.back();
  }

  

}
