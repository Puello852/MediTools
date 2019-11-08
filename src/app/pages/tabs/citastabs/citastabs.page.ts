import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { AlertController,ModalController, ToastController, LoadingController, NavParams, IonInfiniteScroll, IonItemSliding, IonList, IonSegmentButton   } from '@ionic/angular';
import { faChevronLeft, faChevronRight,faNotesMedical } from '@fortawesome/free-solid-svg-icons'
import { AgregarCitasTabsPage } from './agregar-citas-tabs/agregar-citas-tabs.page';
import moment from 'moment';
import { ApiToolsService } from 'src/app/services/api-tools.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-citastabs',
  templateUrl: './citastabs.page.html',
  styleUrls: ['./citastabs.page.scss'],
})
export class CitastabsPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll,{static:true}) infiniteScroll: IonInfiniteScroll;
  @ViewChild('lista',{static:false}) lista: IonList;
  @ViewChild('segmets',{static:false}) segments: IonSegmentButton;
  
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ]
  faChevronLeft = faChevronLeft
  faChevronRight = faChevronRight
  faNotesMedical = faNotesMedical
  eventoBack:boolean = false
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
  Eventosegment: Subscription;
  constructor(public alert:AlertController,private router:Router,public loadingController: LoadingController,private api:ApiToolsService,public toastController: ToastController,public modalController: ModalController,private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string) {
     
   }

  //Metodo para lisar los medicos
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

  ngOnDestroy(){
    this.Eventosegment.unsubscribe()
  }

  //Obtener y listar todas las especialidades
  listEspecialidad(){
    this.api.ListEspecialidades().subscribe((data:any)=>{
      this.categorias = data
    })
  }

  //obtener los medicos por especialidad
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

  //Ir al detale de la nueva cita contatenadole el id del cliente
  godetail(e){
    this.router.navigate(['detalle-nueva-cita/'+e])
  }

  //Metodo del buscador validaciones para verificar si saber si escribio o no
  async buscador(e){
    //aqui se valida que lo que haya o no escrito nada 
    if(this.newLength == e.detail.value.length){
      this.newLength++
    }else if(this.newLength != e.detail.value.length){
      this.newLength--
      this.api.ListMedical().subscribe((data:any)=>{
        this.newmedicos = data
      })
    }
    //paso todo lo que escribe a minuscula
    let busqueda = e.detail.value.toLowerCase()
    
    if(e.detail.value == null || e.detail.value == ''){
      //valido si borro todo le listo todos los medicos
      this.newLength = 1
      this.lisTMedical()
    }else{

    // funcion de javascript para filtar por especialidad,nombre,apellido
     let result = this.newmedicos.filter((data:any)=>{
       return data ? data.especialidad.includes(busqueda) || data.nombre.includes(busqueda) || data.apellido.includes(busqueda) : ""
     })
     this.medicos = result
    }
  }

  // al iniciar la app le establezco que el segmento principal sera citas con un limite de 10 citas 
  ngOnInit() {
    this.Eventosegment = this.api.cambiarSegmento.subscribe(()=>{
        this.segemt = "citas"
        this.segments.value = "citas"
        this.limit = 10
        this.eventoBack = true
    })
    this.api.evento.subscribe((data:any)=>{
      this.limit = 10
      this.citas = []
      this.listCitas()
    })

  }

  //Metodo para obtener todos los medicos 
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

  //Obtener las citas pendientes
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
      },async erro=>{
        const alert = await this.alert.create({
          message: erro.error.message,
          buttons: ['OK']
        });
        
        await alert.present();
        loading.dismiss()
      })
  }

  //Meotodo para obtener las citas aceptadas
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
      },async erro=>{
        const alert = await this.alert.create({
          message: erro.error.message,
          buttons: ['OK']
        });
        
        await alert.present();
        loading.dismiss()
      })
  }

  //Metodo para obtener las citas Canceladas
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
      },async erro=>{
        const alert = await this.alert.create({
          message: erro.error.message,
          buttons: ['OK']
        });
        
        await alert.present();
        loading.dismiss()
      })
  }

  //Metodo para redigirir la vista de detalles de la cita
  detailCita(e){
    this.lista.closeSlidingItems()
    this.router.navigate(['/detalle-estado-cita/'+e])
  }

  //utilizado para ocultar y mostrar el boton de filtro
  async filter(e){
  if(e == 1){
    this.filtro = false
  }else{
    this.filtro = true
  }
  
  }

  //Obtener todas la citas y listarla por orden de fecha a la cita mas reciente
  async listCitas(){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
      this.api.listarcitas(this.limit).subscribe(async (data:any)=>{
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
          if(data.length > 0){
            data.forEach(element => {
              if(this.eventoBack){
                this.citas = []
                this.eventoBack = false
              }
              this.citas.push(element)
            });
          }
        }
      },async erro=>{
        const alert = await this.alert.create({
          message: erro.error.message,
          buttons: ['OK']
        });
        
        await alert.present();
        loading.dismiss()
      })
  }
  // lo mismo pero sin el msj de.. espere porfavor..
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
            if(this.eventoBack){
              this.citas = []
              this.eventoBack = false
            }
            this.citas.push(element)
          })
        }
      },async erro=>{
        const alert = await this.alert.create({
          message: erro.error.message,
          buttons: ['OK']
        });
        
        await alert.present();
     
      })
  }

  //Metodo del infiniti scroll para obtener mas citas siempre y cuando tenga mas 10
  loadData(event) {
  
      if(this.eventoBack){
        this.limit = 10
        this.eventoBack = false
      }else{
        this.limit += 10
        this.listCitasnot()
      }
      setTimeout(() => {
        event.target.complete();
      }, 2500);

  }

  //Metodo para cambiar de segmento
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
