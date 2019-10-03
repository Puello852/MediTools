import { Component, OnInit } from '@angular/core';
import { faStar,faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { Location } from "@angular/common";
import { Router, Route, ActivatedRoute } from '@angular/router';
import { ApiToolsService } from 'src/app/services/api-tools.service';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-detalle-nueva-cita',
  templateUrl: './detalle-nueva-cita.page.html',
  styleUrls: ['./detalle-nueva-cita.page.scss'],
})
export class DetalleNuevaCitaPage implements OnInit {
  cog = faStar
  arrow = faArrowAltCircleRight
  medico: any = [];
  constructor(public loadingController: LoadingController,public toastController: ToastController,public alertController: AlertController,private location: Location,private route: ActivatedRoute,private api:ApiToolsService) {
    this.route.params.subscribe((e:any)=>{
      this.obtenerMedico(e.id)
    })
   }

  ngOnInit() {
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
            const loading = await this.loadingController.create({
              message: 'Por favor espere...',
            });
            await loading.present();
            let data = {
              servicio: this.medico.especialidad,
              idDoctor: this.medico.id,
              estado: 'Pendiente', 
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
