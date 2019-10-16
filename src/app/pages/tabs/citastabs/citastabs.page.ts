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
  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };
  

  minDate = new Date().toISOString();
 
  eventSource = [
    {
      title: "Cita Médica #1",
      startTime:  new Date(),
      endTime: new Date(),
      allDay: false,
      desc: "hoy a las 13:51 cita con el odontologo"
    },
    {
      title: "Cita Médica #2",
      startTime:  new Date(),
      endTime: new Date(),
      allDay: false,
      desc: "hoy a las 18:16 cita con el pediatra"
    },
    {
      title: "Cita Médica #3",
      startTime:  new Date(),
      endTime: new Date(),
      allDay: false,
      desc: "hoy a las 20:45 cita con el oftamologo"
    },
  ];
  viewTitle;
 
  calendar = {
    locale: 'es-MX',
    mode: 'month',
    currentDate: new Date(),
  };
 
  faChevronLeft = faChevronLeft
  faChevronRight = faChevronRight
  faNotesMedical = faNotesMedical
  @ViewChild(CalendarComponent,{static:false}) myCal: CalendarComponent;
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


  async openModal(){
    const modal = await this.modalController.create({
      component: AgregarCitasTabsPage,
      cssClass: 'modals'
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data){
  
      this.eventSource.push(data.eventCopy);
      this.myCal.loadEvents();
      this.resetEvent();
    }
  
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
    this.resetEvent();
  }

  async openalert(e){  
    const alert = await this.alertCtrl.create({
      header: e.title,
      message: e.desc+' <br> <br> El dia ' + moment(e.startTime).locale('es').format('DD MMMM YYYY HH:mm'),
      buttons: ['OK']
    });
    await alert.present();
  }

  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
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
   // Create the right event format and reload source
   addEvent() {
    let eventCopy = {
      title: this.event.title,
      startTime:  new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      desc: this.event.desc
    }
 
    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;
 
      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }
 
    this.eventSource.push(eventCopy);
    this.myCal.loadEvents();
    this.resetEvent();
  }

  onTimeSelected(e){
   
  }
    onViewTitleChanged(e){
  
      this.mes  = e
    }

  onEventSelected(e){
  
  }
  next() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  back() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  unread(e){
    this.router.navigate(['/detalle-estado-cita/'+e])
  }

  async filter(e){
    // if(e){
    //   const toast = await this.toastController.create({
    //     message: 'Filtros Aplicados.',
    //     duration: 2000
    //   });
    //   toast.present();
    // }
  if(this.filtro){
    console.log("entro aqui :v")
    this.filtro = false
  }else{
    this.filtro = true
  }
  
  }
  changeMode(mode) {
    this.calendar.mode = mode;
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
