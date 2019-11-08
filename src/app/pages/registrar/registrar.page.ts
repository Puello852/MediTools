import { Component, OnInit, NgZone,ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RecaptchaComponent, OnExecuteData } from 'ng-recaptcha'
import moment from 'moment';
import departamento from '../../../assets/departamentos.json';
import municipio from '../../../assets/municipios.json';
import { ApiToolsService } from 'src/app/services/api-tools.service';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  @ViewChild(RecaptchaComponent,{static: false}) captcha: RecaptchaComponent;
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
    departamento: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    municipio: new FormControl('', Validators.required),
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
  departamento: any;
  municipios: any;
  newmuni: any;
  captchaPassed: boolean;
  public recentToken: string = '';
  public readonly executionLog: OnExecuteData[] = [];

  captchaResponse: string;
  captchatoken: any;
  
  constructor(private zone: NgZone,public loadingController: LoadingController,private api:ApiToolsService,private statusBar: StatusBar,private authService:AuthenticationService,public alertController: AlertController,public ruta: Router) {
    // como el contrustor es lo primero que se ejecuta le asigno el departamento y el municpio a las variables
    this.departamento = departamento
    this.municipios = municipio
   }

  public ngOnDestroy() {
    // se utiliza cuando se destruye la página
  }


  // este metodo es para el capchat recibe la respuesta
  captchaResolved(response: string): void {
    this.zone.run(() => {
      //si todo es exitoso le asigno a captchaPassed true que despues me servira para activar o desactivar el boton de registrate
        this.captchaPassed = true;
        //captchaResponse le asigno el token o la respuesta que viene de google
        this.captchaResponse = response;
    });

  }
  
  //esta funcion se utiliza para pasar a la siguiente lista de registro siempre y cuando se encuentren validadas
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

  //funcion utilizada para prevenir que la persona escriba letras
  numberOnly(event){
        const charCode = (event.which) ? event.which : event.keyCode;
        //  alert(charCode)
        if (charCode > 47 && charCode < 58) {
          return false;
        }
   }

   //funcion utilizada para prevenir que la persona escriba letras
   numberOnlys(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  //funcion utilizada para Mostrar la primera contraseña
   password1(){ 
    if(this.nameicon == 'eye'){
      this.nameicon = 'eye-off'
      this.typeinput = 'text'
    }else if(this.nameicon = 'eye-off'){
      this.nameicon = 'eye'
      this.typeinput = 'password'
    }
  }

  //funcion utilizada para Mostrar la tercera contraseña
  password2(){
    if(this.nameicon2 == 'eye'){
      this.nameicon2 = 'eye-off'
      this.typeinput2 = 'text'
    }else if(this.nameicon2 = 'eye-off'){
      this.nameicon2 = 'eye'
      this.typeinput2 = 'password'
    }

  }

  //Aqui valido que ambas contraseñas sean iguales
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confpassword.value;
    let doc = group.controls.documento.value;
    let confdoc = group.controls.confirmardocumento.value;
    return pass === confirmPass && doc === confdoc ? null : { notSame: true }     
  }

  // let status bar overlay webview
  ngOnInit() {
    this.statusBar.styleLightContent()
    // set status bar to white
    this.statusBar.backgroundColorByHexString('#003c8f');
  }

  //Aqui le asigno el departamento al input
  setDepartamento(e){
    let found:any = this.departamento.find((data:any)=>{
     return data ? data.nombre == e.detail.value : ''
    })

    this.newmuni = this.municipios.filter((data:any)=>{
      return data ? data.id == found.id : []
    })    
  }

  // metodo para registrar cabe recalcar que primero registro email, password, y capchat 
  async register(){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
      mode: 'md'
    });
    await loading.present();
    let data = {
      email : this.form.controls.email.value,
      password: this.form.controls.password.value,
      captcha: this.captchaResponse
    }
    let datos = {
      primerNombre: this.form.controls.nombre.value,
      segundoNombre: this.form.controls.seugnonombre.value,
      departamento: this.form.controls.departamento.value,
      municipio: this.form.controls.municipio.value,
      primerApellido: this.form.controls.apellido.value,
      segundoApellido: this.form.controls.segundoapellido.value,
      tipoDocumento: this.form.controls.tipodocumento.value,
      documento: this.form.controls.documento.value,
      repetirDocumento: this.form.controls.confirmardocumento.value,
      fechaNacimiento: moment(this.form.controls.fechanacimiento.value).format('DD-MM-YYYY'),
      estadoCivil: this.form.controls.estadocivil.value,
      genero:  this.form.controls.genero.value, 
      direccion:  this.form.controls.direccion.value, 
      celular: this.form.controls.celular.value,
      verificado: false,
      rol:{
        personaNatural: true,
        entidadDeSalud: false
      }
    }

    //Aqui inicio el registro de usuario solo password y correo y capchat
     this.api.registerStart(data).subscribe((data:any)=>{
       // un vez se cree el usuario en el sistema le guardo el token y refehs token que me devuelve el api
       this.api.guardarToken(data.Acesstoken,data.RefreshToken,null )
      //  alert(data.Acesstoken)
      // this.api.CargarToken()
       // despues de haber sido creado el usario a esa persona se le asigna toda todo el json con la info (datos)
       this.api.nuevapersonaNatural(datos).subscribe((async a => {
        loading.dismiss()
         const alert = await this.alertController.create({
           header: 'Exito',
           message: 'Usuario creado exitosamente',
           buttons: ['OK']
         })
         await alert.present().then(res=>{
           //Si el usuario se creo exitosamente cierro el loagin y lo redirigo a la vista del login llamada HOME
            this.ruta.navigate(['/home'])
          });
       }),async erro=>{
        //Valido el error al moemnto de asignarle los datos
       this.captcha.reset()
        const alert = await this.alertController.create({
          message: erro.error.message,
          buttons: ['OK']
        })
        await alert.present()
        loading.dismiss()
       })
     },async erro=>{
       //valido el error al moemtno de crear el usario en firebase
      this.captcha.reset()
      const alert = await this.alertController.create({
        message: erro.error.message,
        buttons: ['OK']
      })
      await alert.present()
      loading.dismiss()
     })
  }

}
