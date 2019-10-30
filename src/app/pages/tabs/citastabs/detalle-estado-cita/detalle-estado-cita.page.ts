import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiToolsService } from 'src/app/services/api-tools.service';
import { LoadingController, AlertController, NavController } from '@ionic/angular';

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
  
  constructor(public ruta:NavController,public alertController: AlertController,public loadingController: LoadingController,private route: ActivatedRoute,private api:ApiToolsService) { 
    this.info.foto = "./assets/img/medical.png"
    this.route.params.subscribe((e:any)=>{
      this.citaId = e.id
      
      console.log(this.citaId)
    })
  }

  ngOnInit() {
    this.detalle()
  }

  async cancel(){
    const alert = await this.alertController.create({
      header: '¿Estas seguro?',
      message: 'Deseas cancelar esta cita.. esta opción no tendra marcha atras',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
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
            this.api.cancelarCita(data).subscribe((data:any)=>{
              loading.dismiss()
              this.api.emitir(1)
              this.ruta.back()
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

}
