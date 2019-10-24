import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController, NavParams, AlertController, ToastController, LoadingController, NavController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiToolsService } from 'src/app/services/api-tools.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit,OnDestroy {
  @Input() email: any;
  @Input() celular: any;
  @Input() celularverificado: any;
  
  
  emails: any;
  privatedatos:Subscription
  interval:any
  celulars: any;
  number:string = ""
  verifcMsj = true
  requestID:any
  segundos = 500
  verifEmail = false
  resend = true
  textsegundos = true
  constructor(public alertController: AlertController,public navctrl: NavController,public loadingController: LoadingController,public toastController: ToastController,private modal:ModalController,navParams: NavParams,private auth:ApiToolsService,public alert:AlertController,private auth2:AuthenticationService) { 
    this.emails = navParams.get('email')
    this.celulars = navParams.get('celular')
    this.verifcMsj = navParams.get('celularverificado')
    if(this.verifcMsj){
      this.verifEmail = true
      this.procesoVerificacion()
      this.resendCode()
    }else{
      this.verifcMsj = true
      this.verifEmail = false
      this.conteoRegresivo()
      this.sendText()
    }
 }
 
  ngOnInit() {
  
  }

  sendText(){
    let data = {
      celular: this.celulars
    }
    this.auth.sendMsj(data).subscribe((data:any)=>{

        this.requestID = data.Code
        localStorage.setItem('requesID',data.Code)
    })
  }

  dismissModal() {
    this.modal.dismiss({
      'dismissed': true
    });
  }

  runTimeChange(e){
   
    if(e.detail.data){
      this.number += e.detail.data
    }else{
      this.number = this.number.slice(0,-1)
      this.segundos = 500
      this.resend = true  
    }
    console.log(this.number)
    if(this.number.length == 6){
      console.log("a verificar")
      let data = {
        token: !this.requestID ? localStorage.getItem('requesID') : this.requestID,
        codigo: this.number
      }
      this.auth.verificarSmj(data).subscribe((data)=>{
        this.verifcMsj = false
        this.verifEmail = true
        this.procesoVerificacion()
        this.resendCode()
      },async erro=>{
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'El código ingresado no es válido',
          buttons: ['OK']
        });
        await alert.present();
        this.number = ""
      })
    }
  }

  conteoRegresivo(){
    let intervalId = setInterval(() => {
      this.textsegundos = true
      this.segundos--
      if(this.segundos == 0){
        this.textsegundos = false
        this.resend = false
       
        clearInterval(intervalId)
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.privatedatos.unsubscribe()
    clearInterval(this.interval)

  }

  async changecelular(){
   
      const alert = await this.alertController.create({
        header: 'Escribe tu celular',
        inputs: [
          {name: 'celular',type: 'number',value: this.celulars,placeholder:'Numero de celular',label: 'celular',max:10},
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
            handler: (e) => {
              let data = {
                celular: e.celular,
              }
              this.auth.editCelular(data).subscribe(async ()=>{
                // this.loadPerfil()
                this.celulars = e.celular
                const toast = await this.toastController.create({
                  message: 'Celular actualizado exitosamente, hemos enviado un codigo de verificación al celular',
                  duration: 2000
                });
                this.conteoRegresivo()
                this.sendText()
                toast.present();
              },async erro=>{
                const toast = await this.toastController.create({
                  message: erro.error.message,
                  duration: 2000
                });
                toast.present();
              })
             
            }
          }
        ]
      })
      await alert.present();
    
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
          message: 'has completado todo el proceso de verificación de manera exitosa',
          duration: 5000
        });
        toast.present();
        this.dismissModal()
       }
     })
    },3000)
  }

  chagecoubnt(){
    this.dismissModal()
    this.navctrl.navigateRoot('/home')
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
        message: 'Correo enviado exitosamente a ('+ this.emails + ') por favor verifica tu bandeja de entrada, una vez verifiques tu correo se cerrara esta ventana' ,
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
