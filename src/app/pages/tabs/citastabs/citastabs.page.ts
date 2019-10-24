import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AlertController,ModalController, ToastController, LoadingController, NavParams, IonInfiniteScroll } from '@ionic/angular';
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
  @ViewChild(IonInfiniteScroll,{static:true}) infiniteScroll: IonInfiniteScroll;
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
  minDate= new Date()
  limit: number = 10;
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
      this.limit = 10
      this.citas = []
      console.log("cancele la cita")
      this.listCitas()
    })
  }

  async all(){
    this.limit = 10
    this.citas = []
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    this.listCitas().finally(()=>{
      this.filter(1)
      loading.dismiss()
    })
  }

  async pendingCites(){
    this.limit = 10
    this.citas = []
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
    this.limit = 10
    this.citas = []
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
      this.api.listarcitasAceptada().subscribe((data:any)=>{
        this.filter(1)
        if(data.length == 0){
          loading.dismiss()
          this.citas = []
        }else{
          loading.dismiss()
          this.citas = data
        }
      })
  }

  async cancelCites(){
    this.limit = 10
    this.citas = []
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

  if(e == 1){
    console.log("al 1")
    this.filtro = false
  }else{
    console.log("no es 1")
    this.filtro = true
  }
  
  }


  async listCitas(){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
      this.api.listarcitas(this.limit).subscribe(async (data:any)=>{
        // console.log(data)
        if(data.Code == -1){
          loading.dismiss()
          this.citas = []
        }else if(data.Code == -2){
        
          const toast = await this.toastController.create({
            message: 'No hay mas citas pendientes',
            duration: 2000
          });
          toast.present();
          loading.dismiss()
          this.limit -=10
        }else{
          loading.dismiss()
          data.forEach(element => {
            this.citas.push(element)
          });
          console.log(this.citas)
        }
      },erro=>{
        loading.dismiss()
      })
  }

  listCitasnot(){
      this.api.listarcitas(this.limit).subscribe(async (data:any)=>{
        if(data.Code == -1){
          this.citas = []
        }else if(data.Code == -2){
          const toast = await this.toastController.create({
            message: 'No hay mas citas pendientes',
            duration: 2000
          });
          toast.present();
          this.limit -=10
        }else{
          data.forEach(element => {
            this.citas.push(element)
          })
        }
      },erro=>{
      
      })
  }

  loadData(event) {
    this.limit += 10
    this.listCitasnot()
    setTimeout(() => {
      console.log('Done');
      console.log(this.limit)
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      
    }, 2500);
  }

  segmentChanged(e){
   if(e.detail.value == 'newcita'){
     this.lisTMedical()
     this.listEspecialidad()
   }else{
     this.limit = 10
     this.citas = []
      this.listCitas()
   }
    this.segemt  = e.detail.value
  }

}
