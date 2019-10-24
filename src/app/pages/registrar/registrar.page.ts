import { Component, OnInit, NgZone,ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RecaptchaComponent, OnExecuteData, ReCaptchaV3Service } from 'ng-recaptcha'
import moment from 'moment';
import example from '../../../assets/departamentos.json';
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

  private allExecutionsSubscription: Subscription;
  private singleExecutionSubscription: Subscription;
  captchaResponse: string;
  
  constructor(private recaptchaV3Service: ReCaptchaV3Service,private zone: NgZone,public loadingController: LoadingController,private api:ApiToolsService,private statusBar: StatusBar,private authService:AuthenticationService,public alertController: AlertController,public ruta: Router) {
    console.log(example)

    this.departamento = example
    this.municipios = municipio
   }

   public executeAction(action: string): void {
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }
    this.singleExecutionSubscription = this.recaptchaV3Service.execute(action)
      .subscribe((token) => {
        this.recentToken = token
        console.log(token)
        this.register(token)
      } );
  }


  public ngOnDestroy() {
    if (this.allExecutionsSubscription) {
      this.allExecutionsSubscription.unsubscribe();
    }
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }
  }

  public formatToken(token: string): string {
    if (!token) {
      return '(empty)';
    }

    console.log(token)

    return `${token.substr(0, 7)}...${token.substr(-7)}`;
  }

   captchaResolved(response: string): void {

    this.zone.run(() => {
        this.captchaPassed = true;
        this.captchaResponse = response;
        console.log(response)
    });

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

    numberOnly(event){

        const charCode = (event.which) ? event.which : event.keyCode;
        //  alert(charCode)
        if (charCode > 47 && charCode < 58) {
          return false;
        }
   }

   numberOnlys(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

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
    this.allExecutionsSubscription = this.recaptchaV3Service.onExecute
    .subscribe((data) => this.executionLog.push(data));
    // let status bar overlay webview
    this.statusBar.styleLightContent()
    // set status bar to white
    this.statusBar.backgroundColorByHexString('#003c8f');
  }


  setDepartamento(e){
    console.log(e.detail.value)

    let found:any = this.departamento.find((data:any)=>{
    //  console.log(data)
     return data ? data.nombre == e.detail.value : ''
    })

    console.log(found)

    this.newmuni = this.municipios.filter((data:any)=>{
      return data ? data.id == found.id : []
    })

    console.log(this.newmuni)
    
    
  }
  async register(token){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
      mode: 'md'
    });
    await loading.present();
    let data = {
      email : this.form.controls.email.value,
      password: this.form.controls.password.value,
      captcha: token
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
     this.api.registerStart(data).subscribe((data:any)=>{
       this.api.guardarToken(data.Acesstoken,data.Refreshtoken,null )
       this.api.nuevapersonaNatural(datos).subscribe((async a => {
        loading.dismiss()
         const alert = await this.alertController.create({
           header: 'Exito',
           message: 'Usuario creado exitosamente',
           buttons: ['OK']
         })
         await alert.present().then(res=>{
            this.ruta.navigate(['/home'])
          });
       }),async erro=>{
        //  this.captcha.reset()
        const alert = await this.alertController.create({
          header: 'Error',
          message: erro.error.message,
          buttons: ['OK']
        })
        await alert.present()
        loading.dismiss()
       })
     },async erro=>{
      // this.captcha.reset()
      const alert = await this.alertController.create({
        header: 'Error',
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
