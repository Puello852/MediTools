import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController, ToastController, LoadingController, NavController, Platform } from '@ionic/angular';
import { ApiToolsService } from '../services/api-tools.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  email:boolean = false
  nameicon:string = 'md-eye'
  typeinput:string = 'password'
  form = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/) ]),
    password: new FormControl('', Validators.required),
    number: new FormControl(''),
  })

  constructor(private plat:Platform,public api:ApiToolsService,public navCtrl: NavController,private statusBar: StatusBar,private authService:AuthenticationService,public toastController: ToastController,public loadingController: LoadingController,public alertController: AlertController) {
    this.statusBar.styleLightContent()
  }

  ngOnInit(): void {
    this.statusBar.styleLightContent()
  }

  onClick(){
    if(this.nameicon == 'md-eye'){
      this.nameicon = 'md-eye-off'
      this.typeinput = 'text'
    }else if(this.nameicon = 'md-eye-off'){
      this.nameicon = 'md-eye'
      this.typeinput = 'password'
    }
  }


  async forgotpassword(){
    if(this.form.controls.email.valid){
      const alert = await this.alertController.create({
        header: '¿Estas seguro?',
        message: 'Deseas enviar una serie de instrucciones para restablecer la contraseña',
        buttons: [
          {
            text: 'Cancelar',
            handler: (blah) => {
           
            }
          }, {
            text: 'Aceptar',
            handler: () => {
              this.authService.forgotPassword(this.form.controls.email.value)
            }
          }
        ]
      });
      await alert.present();
      this.email = false
    }else{
      this.email = true
      setTimeout(() => {
        this.email = false
      }, 2000)
      
    }
  }


  async login() {
    let data = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
    }
     this.authService.loginUser(data)
     const loading = await this.loadingController.create({
           message: 'Por favor espere...',
           mode: 'md'
         });
         await loading.present();
      this.api.login(data).subscribe(async (data: any) => {
        this.navCtrl.navigateRoot('/dashboard/home')
        loading.dismiss()
        let datauid: any = this.authService.userDetails()
        this.api.recibido(data.token)
        this.api.guardarToken(data.token, data.Refreshtoken, datauid.uid)
        const toast = await this.toastController.create({
          message: 'Bienvenido.',
          duration: 2000,
          position: 'bottom',
        });
        toast.present();
  
      }, async erro => {
        this.api.guardarToken(null, null, null)
        loading.dismiss()

        if (erro.error.code == -1) {
          const alert = await this.alertController.create({
            header: 'Hola',
            message: 'Para poder iniciar sesión debes primero validar tu correo electrónico, por favor verifica tu bandeja de entrada o spam',
            buttons: ['OK']
          })
          await alert.present()
        } else {
          const toast = await this.toastController.create({
            message: erro.error.message,
            duration: 2000,
            position: 'bottom',
          });
          toast.present()
        }
      })

  }

 
}
