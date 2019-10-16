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
        cssClass: 'modals',
        componentProps: {
          'idDoctor': this.idDoctor,
          'tipoAtencion': this.medico.tipoatencion
        }
      });
      return await modal.present();
    


  //   let opts:PickerOptions = {
  //     buttons:[
  //       {
  //         text:'Cancelar',
  //         role:'cancel',
  //         handler: () => {
  //           console.log('Confirm Cancel');
  //         }
  //       },
  //       {
  //         text:'Enviar',
  //         handler:  (e) => {
  //           let dato = {
  //             idDoctor: this.idDoctor,
  //             fechaCita:e['Escoje una fecha'].value
  //           }
  //           this.api.obtenerhorario(dato).subscribe(async (data:any)=>{
  //             let input={data:[]};
  //             for (let i = 0; i < data.length; i++) {
  //              input.data.push({name:data[i],type:'radio',label:data[i],value: data[i]})
  //             }
  //             const alert = await this.alertController.create({
  //               header: 'Elige el dia para el cual quieres la cita',
  //               inputs: input.data,
  //               buttons: [
  //                 {
  //                   text: 'Cancel',
  //                   role: 'cancel',
  //                   cssClass: 'secondary',
  //                   handler: () => {
  //                     console.log('Confirm Cancel');
  //                   }
  //                 }, {
  //                   text: 'Ok',
  //                   handler: (e) => {
  //                     console.log(e)
  //                     this.pedirCita2()
  //                     this.horaCita = e
  //                   }
  //                 }
  //               ]
  //             });
            
  //             await alert.present();
  //           },async erro=>{
  //             const alert = await this.alertController.create({
  //               header: 'Ups',
  //               message: erro.error.message,
  //               buttons: ['OK']
  //             });
         
  //             await alert.present();
  //           })
  //            this.fechaCita = e['Escoje una fecha'].value
  //            console.log(this.fechaCita)
  //         }
  //       }
  //     ],columns:[
  //       {
  //         name:'Escoje una fecha',
  //         options: [
  //           { text: moment().locale('es').format('(dddd) DD-MM-YYYY'), value: moment().format('YYYY-MM-DD')},
  //           { text: moment().locale('es').add(1,'d').format('(dddd) DD-MM-YYYY'), value: moment().add(1,'d').format('YYYY-MM-DD') },
  //           { text:  moment().locale('es').add(2,'d').format('(dddd) DD-MM-YYYY'), value: moment().add(2,'d').format('YYYY-MM-DD') },
  //           { text: moment().locale('es').add(3,'d').format('(dddd) DD-MM-YYYY'), value: moment().add(3,'d').format('YYYY-MM-DD') },
  //           { text:  moment().locale('es').add(4,'d').format('(dddd) DD-MM-YYYY'), value: moment().add(4,'d').format('YYYY-MM-DD') },
  //           { text:  moment().locale('es').add(5,'d').format('(dddd) DD-MM-YYYY'), value: moment().add(5,'d').format('YYYY-MM-DD') },
  //           { text:  moment().locale('es').add(6,'d').format('(dddd) DD-MM-YYYY'), value: moment().add(6,'d').format('YYYY-MM-DD') },
  //         ]
  //       }
  //     ]

      
  //   }
  // let picker = await this.picker.create(opts)
  // picker.present()
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
