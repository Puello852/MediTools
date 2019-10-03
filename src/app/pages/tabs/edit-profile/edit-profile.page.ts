import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController, NavParams, AlertController, ToastController, LoadingController, NavController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { ApiToolsService } from 'src/app/services/api-tools.service';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit,OnDestroy {
  @Input() email: any;
  form = new FormGroup({
    
  })
  emails: any;
  privatedatos:Subscription
  interval:any
  constructor(public navctrl: NavController,public loadingController: LoadingController,public toastController: ToastController,private modal:ModalController,navParams: NavParams,private auth:ApiToolsService,public alert:AlertController,private auth2:AuthenticationService) { 
    this.emails = navParams.get('email')
    this.procesoVerificacion()
 }

  ngOnInit() {
  }

  dismissModal() {
    this.modal.dismiss({
      'dismissed': true
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.privatedatos.unsubscribe()
    clearInterval(this.interval)

  }

  async changeMail(){
  
      const alert = await this.alert.create({
        header: 'Escribe tu nuevo correo',
        inputs: [
          {name: 'email',type: 'email',value: this.emails,placeholder:'example@mail.co',label: 'email',},
        ],
        buttons: [
          {
            text: 'CANCELAR',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              
            }
          }, {
            text: 'GUARDAR',
            handler: async (e) => {
  
  
              const alert = await this.alert.create({
                header: '¿Estas seguro?',
                message: 'Estas seguro que cambiar el correo, recuerda que una vez se hayan realizados los cambios iniciaras sesión con el nuevo correo ingresado',
                buttons: [
                  {
                    text: 'CANCELAR',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                     
                    }
                  }, {
                    text: 'ACEPTAR',
                    handler: async () => {
                      this.auth2.updateMail(e.email).then(()=>{
                        
                        this.navctrl.navigateRoot('/home')
                      })
                     
                    }
                  }
                ]
              });
              await alert.present();
            }
          }
        ]
      })
      await alert.present();
    
  }

  procesoVerificacion(){
   this.interval = setInterval(() => {
      
   this.privatedatos = this.auth.GetInfoUser().subscribe(async (data:any)=>{
       if(data.verificado){
        const toast = await this.toastController.create({
          message: 'Tu correo ha sido verificado de manera exitosa',
          duration: 5000
        });
        toast.present();
        this.dismissModal()
       }
     })
    },3000)
  }

  async resendCode(){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
    this.auth.resendCodeEmail().subscribe(async ()=>{
      loading.dismiss()
      const alert = await this.alert.create({
        header: 'Exito',
        message: 'Correo enviado exitosamente a ('+ this.emails + ') por favor verifica tu bandeja de entrada o tu SPAM, una vez verifiques tu correo se cerrara esta ventana' ,
        buttons: ['OK']
      });
      await alert.present();
    },async erro=>{
      loading.dismiss()
      const alert = await this.alert.create({
        header: 'Error',
        message: erro.error.message ,
        buttons: ['OK']
      });
      await alert.present();
    })
  }
}
