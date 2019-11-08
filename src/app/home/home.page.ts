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

  //este es el formulario
  form = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/) ]),
    password: new FormControl('', Validators.required),
    number: new FormControl(''),
  })

  constructor(private plat:Platform,public api:ApiToolsService,public navCtrl: NavController,private statusBar: StatusBar,private authService:AuthenticationService,public toastController: ToastController,public loadingController: LoadingController,public alertController: AlertController) {
   //Aqui es para colocarle el color blanco a la barra de estado
    this.statusBar.styleLightContent()
  }

  ngOnInit(): void {
    
  }

  onClick(){
    //Esta funcion sirve para ocultar y mostrar la contraseña
    if(this.nameicon == 'md-eye'){
      this.nameicon = 'md-eye-off'
      this.typeinput = 'text'
    }else if(this.nameicon = 'md-eye-off'){
      this.nameicon = 'md-eye'
      this.typeinput = 'password'
    }
  }


  async forgotpassword(){
    //valido que exista un correo escrito en el input
    if(this.form.controls.email.valid){
      //abro alerta
      const alert = await this.alertController.create({
        header: 'Restablecer contraseña',
        message: 'A continuación le enviaremos un correo para iniciar su proceso de restablecimiento de contraseña',
        buttons: [
          {
            text: 'Cancelar',
            handler: (blah) => {
           
            }
          }, {
            text: 'Aceptar',
            handler: () => {
              //si acepta cambiar la contraseña llamo al metodo forgotpassword y le paso el correo
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
    //creo un array con email y password
    let data = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
    }
    // primero me logueo directamente con firebase
     this.authService.loginUser(data)
     //abro el loading
     const loading = await this.loadingController.create({
        message: 'Por favor espere...',
        mode: 'md'
      });
      await loading.present();
      //ahora me logueo con la api
      this.api.login(data).subscribe(async (data: any) => {
        //si todo es exitoso le establezco como root el DashboardHome
        this.navCtrl.navigateRoot('/dashboard/home')
        //cierro el loading
        loading.dismiss()
        //aqui le guardo el uid de el usuario
        let datauid: any = this.authService.userDetails()

        // this.api.recibido(data.token)
        //Este metodo es para guardar el token y el refresh y el uid del usuario logueado
        this.api.guardarToken(data.token, data.refresh, datauid.uid)
        // y le muestro el mensaje de bienvenido
        const toast = await this.toastController.create({
          message: 'Bienvenido.',
          duration: 2000,
          position: 'bottom',
        });
        toast.present();
  
      }, async erro => {
        //VALIDO EL ERROR si es los datos son incorrecto le mando null el token el refresh y el uid
        this.api.guardarToken(null, null, null)
        //cierro en loding
        loading.dismiss()
        // valido si en code es == -1
        if (erro.error.code == -1) {
          const alert = await this.alertController.create({
            header: 'Hola',
            message: 'Para poder iniciar sesión debes primero validar tu correo electrónico, por favor verifica tu bandeja de entrada o spam',
            buttons: ['OK']
          })
          await alert.present()
        } else {
          // si el code no es igual a -1 muestro el error que me mando el api
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
