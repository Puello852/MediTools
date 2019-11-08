import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiToolsService } from 'src/app/services/api-tools.service';
import { LoadingController, AlertController, NavController, IonDatetime } from '@ionic/angular';
import moment from 'moment';
@Component({
  selector: 'app-detalle-estado-cita',
  templateUrl: './detalle-estado-cita.page.html',
  styleUrls: ['./detalle-estado-cita.page.scss'],
})
export class DetalleEstadoCitaPage implements OnInit {
  citaId: any;
  info:any = [];
  horaInicial: string;
  horaFinal: string;
  fechahoy = moment().format('YYYY-MM-DD')
  @ViewChild('datetime',{static:false}) datetime: IonDatetime;
  constructor(public ruta:NavController,public alertController: AlertController,public loadingController: LoadingController,private route: ActivatedRoute,private api:ApiToolsService) { 
    this.info.foto = "./assets/img/medical.png"
    this.route.params.subscribe((e:any)=>{
      this.citaId = e.id
    })
  }

  //Verifico si establecio una fecha y llamo al metodo 
  async changedate(e){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
    let data = {
      idcita: this.info.id,
      fecha: moment(e.detail.value).format('YYYY-MM-DD'),
      hora: moment(e.detail.value).format('HH:mm')
    }
    this.api.ReagendarCita(data).subscribe(async (data:any)=>{
      this.api.emitir(1)
      this.ruta.back()
      const alert = await this.alertController.create({
        message: 'Cita Reagendada exitosamente.',
        buttons: ['OK']
      });
              
      await alert.present();
    },async erro=>{
      const alert = await this.alertController.create({
        message: erro.error.message,
        buttons: ['OK']
      });
      loading.dismiss()
      await alert.present();
    })
  }
  ngOnInit() {
    this.detalle()
  }
  //Medoto para cancelar la cita
  async cancel(){
    const alert = await this.alertController.create({
      header: 'Cancelar cita',
      message: 'Al aceptar su cita quedara cancelada',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Si, cancelar',
          handler: async () => {
            let data = {
              idcita: this.info.id,
            }
            const loading = await this.loadingController.create({
              message: 'Por favor espere...',
            });
            await loading.present();
            this.api.cancelarCita(data).subscribe(async (data:any)=>{
              loading.dismiss()
              this.api.emitir(1)
              this.ruta.back()
              const alert = await this.alertController.create({
                message: 'Cita cancelada exitosamente.',
                buttons: ['OK']
              });
          
              await alert.present();
            },async erro=>{
              const alert = await this.alertController.create({
                message: erro.error.message,
                buttons: ['OK']
              });
              loading.dismiss()
              await alert.present();
            })
          }
        }
      ]
    });

    await alert.present();
  }
  //Metodo para obtener todos los detalles de la cita
  async detalle(){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
    this.api.detallecita(this.citaId).subscribe((data:any)=>{
      loading.dismiss()
      this.info = data
      let hora:string = data.horacita
      if(data.tipoatencion == 1){
        this.horaInicial = hora.slice(0,5)
        this.horaFinal = hora.slice(6)
      }
    },erro=>{
      loading.dismiss()
    })
  }
  //Metodo para reagendar cita
  async reagendar(){
    const alert = await this.alertController.create({
      message: 'Por favor escoje la fecha y la hora para la cual deseas reagendar tu cita',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.datetime.open()
          }
        }
      ]
    });

    await alert.present();
  //   const alert = await this.alertController.create({
  //     header: 'Reagendar cita',
  //     message: 'Al ac',
  //     buttons: [
  //       {
  //         text: 'No',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: (blah) => {
  //         }
  //       }, {
  //         text: 'Si, cancelar',
  //         handler: async () => {
  //           let data = {
  //             idcita: this.info.id,
  //             fecha: 'nueva fecha',
  //             hora: 'hora'
  //           }
  //           const loading = await this.loadingController.create({
  //             message: 'Por favor espere...',
  //           });
  //           await loading.present();
  //           this.api.ReagendarCita(data).subscribe(async (data:any)=>{
  //             loading.dismiss()
  //             this.api.emitir(1)
  //             this.ruta.back()
  //             const alert = await this.alertController.create({
  //               message: 'Cita Reagendada exitosamente.',
  //               buttons: ['OK']
  //             });
          
  //             await alert.present();
  //           },async erro=>{
  //             const alert = await this.alertController.create({
  //               message: erro.error.message,
  //               buttons: ['OK']
  //             });
  //             loading.dismiss()
  //             await alert.present();
  //           })
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
   }

}
