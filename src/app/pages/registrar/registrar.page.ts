import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ApiToolsService } from 'src/app/services/api-tools.service';
@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  nameicon:string = 'eye'
  typeinput:string = 'password'
  nameicon2:string = 'eye'
  typeinput2:string = 'password'
  case1:boolean=true
  case2:boolean=false
  minDate = moment().subtract(18,'year').format('YYYY-MM-DD')
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ]
  form = new FormGroup({
    nombre: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]),
    seugnonombre: new FormControl('',Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)),
    apellido: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]),
    segundoapellido: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]),
    tipodocumento: new FormControl('', Validators.required),
    confirmardocumento: new FormControl('', Validators.required),
    documento: new FormControl('', [Validators.required,Validators.min(5)]),
    fechanacimiento: new FormControl('', Validators.required),
    estadocivil: new FormControl('', Validators.required),
    genero: new FormControl('', Validators.required),
    celular:  new FormControl('', [ Validators.required, Validators.pattern(/^3[\d]{9}$/), Validators.minLength(10), Validators.maxLength(10) ]), 
    email: new FormControl('', [ Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/) ]),
    password: new FormControl('', [Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
    confpassword: new FormControl('', Validators.required),
  },{validators:this.checkPasswords})
  nameIcons: string ="arrow-round-forward";
  
  constructor(public loadingController: LoadingController,private api:ApiToolsService,private statusBar: StatusBar,private authService:AuthenticationService,public alertController: AlertController,public ruta: Router) {
    
   }

   nextCase(){
     if(this.nameIcons == "arrow-round-back"){
       this.case1 = true
       this.case2 = false
     }else if(this.nameIcons != "arrow-round-back"){
       this.case1 = false
       this.case2 = true
     }
     if(!this.case1){
       this.nameIcons = "arrow-round-back"
     }else if(this.case1){
       this.nameIcons = "arrow-round-forward"
     }
   }

   password1(){  
    if(this.nameicon == 'eye'){
      this.nameicon = 'eye-off'
      this.typeinput = 'text'
    }else if(this.nameicon = 'eye-off'){
      this.nameicon = 'eye'
      this.typeinput = 'password'
    }
  }

  password2(){
    if(this.nameicon2 == 'eye'){
      this.nameicon2 = 'eye-off'
      this.typeinput2 = 'text'
    }else if(this.nameicon2 = 'eye-off'){
      this.nameicon2 = 'eye'
      this.typeinput2 = 'password'
    }
  }

  

   checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  let pass = group.controls.password.value;
  let confirmPass = group.controls.confpassword.value;
  let doc = group.controls.documento.value;
  let confdoc = group.controls.confirmardocumento.value;
  return pass === confirmPass && doc === confdoc ? null : { notSame: true }     
}
  ngOnInit() {
    // let status bar overlay webview
    this.statusBar.styleLightContent()
    // set status bar to white
    this.statusBar.backgroundColorByHexString('#003c8f');
  }

  async register(){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
      mode: 'md'
    });
    await loading.present();
    let data = {
      email : this.form.controls.email.value,
      password: this.form.controls.password.value,
    }
    let datos = {
      primerNombre: this.form.controls.nombre.value,
      segundoNombre: this.form.controls.seugnonombre.value,
      primerApellido: this.form.controls.apellido.value,
      segundoApellido: this.form.controls.segundoapellido.value,
      tipoDocumento: this.form.controls.tipodocumento.value,
      documento: this.form.controls.documento.value,
      fechaNacimiento: moment(this.form.controls.fechanacimiento.value).locale('es').format('DD MMMM YYYY'),
      estadoCivil: this.form.controls.estadocivil.value,
      genero:  this.form.controls.genero.value,
      celular: this.form.controls.celular.value,
      verificado: false,
      rol:{
        personaNatural: true,
        entidadDeSalud: false
      }
    }
     this.api.registerStart(data).subscribe((data:any)=>{
       loading.dismiss()
       this.api.guardarToken(data.Acesstoken,data.Refreshtoken,null )
       this.api.nuevapersonaNatural(datos).subscribe((async a => {
         const alert = await this.alertController.create({
           header: 'Exito',
           message: 'Usuario creado exitosamente',
           buttons: ['OK']
         })
         await alert.present().then(res=>{
            this.ruta.navigate(['/home'])
          });
       }))
     },async erro=>{
      const alert = await this.alertController.create({
        header: 'Exito',
        message: erro.error.message,
        buttons: ['OK']
      })
      await alert.present()
      loading.dismiss()
     })
    //  this.authService.registerUser(data,datos).then(async res=>{
    //    const alert = await this.alertController.create({
    //      header: 'Exito',
    //      message: 'Usuario creado exitosamente',
    //      buttons: ['OK']
    //    })
    //    await alert.present().then(res=>{
    //      this.ruta.navigate(['/home'])
    //    });
    // //   // this.authService.sendVerificacion()
    //  },async err=>{
    //    const alert = await this.alertController.create({
    //      header: 'Error',
    //      message: 'Ocurrio un error',
    //      buttons: ['OK']
    //    })
    //    alert.present()
    //  })
  }

}
