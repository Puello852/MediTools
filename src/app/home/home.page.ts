import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController, ToastController, LoadingController, NavController } from '@ionic/angular';
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

  constructor( private recaptchaV3Service: ReCaptchaV3Service, public api:ApiToolsService,public navCtrl: NavController,private statusBar: StatusBar,private authService:AuthenticationService,public toastController: ToastController,public loadingController: LoadingController,public alertController: AlertController) {
    this.statusBar.styleLightContent()
  }

  public executeImportantAction(): void {
    this.recaptchaV3Service.execute('importantAction').subscribe((token) =>{
     
      console.log(token)

    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
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
              console.log('Confirm Cancel: blah');
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


  async login(){
      const loading = await this.loadingController.create({
        message: 'Por favor espere...',
        mode:'md'
      });
      await loading.present();
      let data ={
        email: this.form.controls.email.value,
        password:this.form.controls.password.value,
      }
      //   this.api.login(data).subscribe((data:any)=>{
      //     console.log(data)
      //  })
         this.authService.loginUser(data).then(async res=>{
           loading.dismiss()
           const toast = await this.toastController.create({
             message: 'Bienvenido.',
             duration: 2000,
             position: 'bottom',
   
           });
           toast.present();
          let data:any = this.authService.userDetails()
      
           this.authService.getInfoUser(data.uid).subscribe(data=>{
            console.log(data)
          })
          this.navCtrl.navigateRoot('/dashboard/home')
         })
  }

 

  

}
