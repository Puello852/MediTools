import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AlertController,ModalController, ToastController, LoadingController, NavParams } from '@ionic/angular';
import { faChevronLeft, faChevronRight,faNotesMedical } from '@fortawesome/free-solid-svg-icons'
import { AgregarCitasTabsPage } from './agregar-citas-tabs/agregar-citas-tabs.page';
import moment from 'moment';
import { ApiToolsService } from 'src/app/services/api-tools.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-citastabs',
  templateUrl: './citastabs.page.html',
  styleUrls: ['./citastabs.page.scss'],
})
export class CitastabsPage implements OnInit {
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ]
  faChevronLeft = faChevronLeft
  faChevronRight = faChevronRight
  faNotesMedical = faNotesMedical

  mes: any;
  filtro: boolean;
  segemt: any;
  medicos: Array<any> = [];
  categorias: any;
  citas: any =[];
  newLength: any = 1;
  newmedicos: Array<any> = [];
 
  constructor(private router:Router,public loadingController: LoadingController,private api:ApiToolsService,public toastController: ToastController,public modalController: ModalController,private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string) {
     
   }

  async lisTMedical(){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
    this.api.ListMedical().subscribe((data:any)=>{
      
      loading.dismiss()
      this.newmedicos = data
      this.medicos = data
    },erro=>{
      loading.dismiss()
    })
  }

  listEspecialidad(){
    this.api.ListEspecialidades().subscribe((data:any)=>{
      this.categorias = data
    })
  }

  async goMedicalEspecialidad(e){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
    this.api.ListmedicalEspecialidades(e).subscribe((data:any)=>{
      this.medicos = data
      loading.dismiss()
    },erro=>{
      loading.dismiss()
    })
  }

  godetail(e){
    this.router.navigate(['detalle-nueva-cita/'+e])
  }


  async buscador(e){
    let lengthfirst = e.detail.value.length
    if(this.newLength == e.detail.value.length){
      this.newLength++
      console.log("es igual")
    }else if(this.newLength != e.detail.value.length){
      this.newLength--
      this.api.ListMedical().subscribe((data:any)=>{
        this.newmedicos = data
      })
      console.log("no es igual")
    }

    console.log(lengthfirst)
    let busqueda = e.detail.value.toLowerCase()
    // console.log(busqueda)
    if(e.detail.value == null || e.detail.value == ''){
      this.newLength = 1
      this.lisTMedical()
    }else{

     let result = this.newmedicos.filter((data:any)=>{
        console.log(data)
       return data ? data.especialidad.includes(busqueda) || data.nombre.includes(busqueda) || data.apellido.includes(busqueda) : ""
     })

     console.log(result)
     this.medicos = result

    }
  }
  

  ngOnInit() {
    this.api.evento.subscribe((data:any)=>{
      this.listCitas()
    })
  }

  async all(){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
      this.api.listarcitas().subscribe((data:any)=>{
        this.filter(1)
        if(data.code == -1){
          loading.dismiss()
          this.citas = []
        }else{
          loading.dismiss()
          this.citas = data
        }
      })
  }

  async pendingCites(){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
      this.api.listarcistasPendients().subscribe((data:any)=>{
        this.filter(1)
        if(data.code == -1){
          loading.dismiss()
          this.citas = []
        }else{
          loading.dismiss()
          this.citas = data
        }
      })
  }

  async acceptCites(){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
      this.api.listarcitasAceptada().subscribe((data:any)=>{
        this.filter(1)
        if(data.code == -1){
          loading.dismiss()
          this.citas = []
        }else{
          loading.dismiss()
          this.citas = data
        }
      })
  }

  async cancelCites(){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
      this.api.listarcitasCanceladas().subscribe((data:any)=>{
        this.filter(1)
        if(data.code == -1){
          loading.dismiss()
          this.citas = []
        }else{
         
          loading.dismiss()
          this.citas = data
        }
      })
  }



  unread(e){
    this.router.navigate(['/detalle-estado-cita/'+e])
  }

  async filter(e){
  if(this.filtro){
    console.log("entro aqui :v")
    this.filtro = false
  }else{
    this.filtro = true
  }
  
  }


  async listCitas(){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
      this.api.listarcitas().subscribe((data:any)=>{
        if(data.code == -1){
          loading.dismiss()
          this.citas = []
        }else{
          loading.dismiss()
          this.citas = data
        }
      },erro=>{
        loading.dismiss()
      })
  }

  segmentChanged(e){
   if(e.detail.value == 'newcita'){
     this.lisTMedical()
     this.listEspecialidad()
   }else{
      this.listCitas()
   }
    this.segemt  = e.detail.value
  }

}
