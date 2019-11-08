import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, NavParams, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { faChevronLeft, faChevronRight, faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import moment from 'moment';
import { ApiToolsService } from 'src/app/services/api-tools.service';
import { database } from 'firebase';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pedir-cita',
  templateUrl: './pedir-cita.page.html',
  styleUrls: ['./pedir-cita.page.scss'],
})
export class PedirCitaPage implements OnInit {
  @Input() idDoctor: string;
  @Input() tipoAtencion: string;
  fechaCita: any;
  calendar = {
    locale: 'es-MX',
    mode: 'month',
    currentDate: new Date(),
  };
  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };
  eventSource = [];
  horaCita: any;
  mes: any;
  mesActual = moment().format('MM')
  faChevronLeft = faChevronLeft
  faChevronRight = faChevronRight
  faNotesMedical = faNotesMedical
  @ViewChild(CalendarComponent, { static: false }) myCal: CalendarComponent;
  DateCalendar: string;
  idDoctors: any;
  mesNumber: any;
  FechaNumber: string;
  medico: any;
  tipoAtencions: any;
  mesx: any = 1;
  year: boolean = false;
  anio: string;
  constructor(public ruta: Router,public toastController: ToastController,public alertController: AlertController,public loadingController: LoadingController, private api: ApiToolsService, navParams: NavParams, public modalController: ModalController) {
    this.anio = moment().format('YYYY')
    this.idDoctors = navParams.get('idDoctor')
    this.tipoAtencions = navParams.get('tipoAtencion')
    this.mesNumber = moment().format('MM')
    this.FechaNumber = moment().format('YYYY-MM-DD')
    this.obtenerMedico()
  }
  //Al inciar la vista verifico primero el tipo de atencion de ese doctor y obtengo los enventos del mes y del dia
  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
    //Aqui le creo un json con el id deldoctor el mes y el año
    let data = {
      idDoctor: this.idDoctors,
      mes: this.mesNumber,
      anio: this.anio
    }
    //si tipo atencion es 1 sigifnica que por cupos con hora incial y una final y solo se puede atender a la persona que escojio ese cupo a esa hora
    if(this.tipoAtencions == 1){
      //Aqui obtengo todo los eventos del mes para marcarle con un verde los dias que tiene cupos libres ese medico
       this.api.eventMes(data).subscribe((data: any) => {
        this.eventSource.forEach(element => {
          let pos = this.eventSource.map(function(a) { return moment(a.startTime).format('YYYY-MM-DD'); }).indexOf(this.mes);
          if(pos>=0){
            this.eventSource.splice(pos,1)
          }
        });
         data.forEach(element => {
           this.eventSource.push(
             {
               title: "",
               startTime: moment(element).add(1,'hour').toDate(),
               endTime: moment(element).add(2,'hour').toDate(),
               allDay: false,
               desc: ""
             }
           )
         });
         loading.dismiss()
         this.myCal.loadEvents()
       },erro=>{
        loading.dismiss()
       })
    }else{
       //si tipo atencion es 2 sigifnica que por cupos pero puede atender a X personas en un rango de tiempo estimado por el doctor
       //Aqui obtengo todo los eventos del mes para marcarle con un verde los dias que tiene cupos libres ese medico
      this.api.cuposLibres(data).subscribe((data: any) => {
        this.eventSource.forEach(element => {
          let pos = this.eventSource.map(function(a) { return moment(a.startTime).format('YYYY-MM-DD'); }).indexOf(this.mes);
          if(pos>=0){
            this.eventSource.splice(pos,1)
          }
        });
         data.forEach(element => {
           this.eventSource.push(
             {
               title: "",
               startTime: moment(element).add(1,'hour').toDate(),
               endTime: moment(element).add(2,'hour').toDate(),
               allDay: false,
               desc: ""
             }
           )
         });
         loading.dismiss()
         this.myCal.loadEvents()
       },erro=>{
        loading.dismiss()
       })
    }
  }
  
  //Funcion para avanzar al siguiente mes
  async next(e) {
    //Guardo el mes en la variable
    this.mesNumber = moment().add(this.mesx,'months').format('MM')
    
    //Valido que sea el ultimo mes del año
    if(parseInt(this.mesNumber) == 12){
      this.year = true
    }else{
      if(this.year){
        this.anio = moment().add(1,'years').format('YYYY')
      }else{
        this.year = false
        this.anio = moment().format('YYYY')
      }
    }
    this.mesx++
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
    //en base a todo obtengo toda la informacion y la armo en json
    let data = {
      idDoctor: this.idDoctors,
      mes: this.mesNumber.toString(),
      anio: this.anio.toString()
    }
    let poss = 0
    //si tipo atencion es 1 sigifnica que por cupos con hora incial y una final y solo se puede atender a la persona que escojio ese cupo a esa hora
    if(this.tipoAtencions == 1){
      this.api.eventMes(data).subscribe((data: any) => {
      
        if(data.code == -4){
          loading.dismiss()
        }else{
          //Aqui obtengo todo los eventos del mes para marcarle con un verde los dias que tiene cupos libres ese medico
          data.forEach(element => {
           let pos = this.eventSource.map(function(a) { return moment(a.startTime).format('YYYY-MM-DD')}).indexOf(moment(this.mesNumber, 'MM').add(poss,'day').format('YYYY-MM-DD'));
           if(pos<0){
             this.eventSource.push(
               {
                 title: "",
                 startTime: moment(element).add(1,'hour').toDate(),
                 endTime: moment(element).add(2,'hour').toDate(),
                 allDay: false,
                 desc: ""
               }
             )
           }
           poss++
           });
        }   
        loading.dismiss()
        this.myCal.loadEvents()
      },erro=>{
       loading.dismiss()
      })
     var swiper = document.querySelector('.swiper-container')['swiper'];
     swiper.slideNext();
    }else{
      //si tipo atencion es 2 sigifnica que por cupos pero puede atender a X personas en un rango de tiempo estimado por el doctor
      //Aqui obtengo todo los eventos del mes para marcarle con un verde los dias que tiene cupos libres ese medico
      this.api.eventMes2(data).subscribe((data: any) => {
        data.forEach(element => {
       let pos = this.eventSource.map(function(a) { return moment(a.startTime).format('YYYY-MM-DD')}).indexOf(moment(this.mesNumber, 'MM').add(poss,'day').format('YYYY-MM-DD'));
       if(pos<0){
         this.eventSource.push(
           {
             title: "",
             startTime: moment(element).add(1,'hour').toDate(),
             endTime: moment(element).add(2,'hour').toDate(),
             allDay: false,
             desc: ""
           }
         )
       }
       poss++
       })
        loading.dismiss()
        this.myCal.loadEvents()
      },erro=>{
       loading.dismiss()
      })
     var swiper = document.querySelector('.swiper-container')['swiper'];
     swiper.slideNext();
    }

  }

  //Metodo para echar pa atras en los meses
  back() {
    this.mesx--
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  //Guardo el titulo del mes en el que estmamos moviendonos
  onViewTitleChanged(e) {
    this.mes = e
  }

  //Metodo que devuelve el detalle del evento seleccionado
  onEventSelected(e) {
  }

  //Metodo que devuelve la fecha del evento seleccionado
  async onTimeSelected(e) {
    this.DateCalendar = moment(e.selectedTime).format('MM')  
  }

  //Metodo que devuelve la fecha apenas cambia
  async onCurrentDateChanged(e){
    this.mesNumber = moment(e).format("MM")
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
    });
    await loading.present();
    let data2 = {
      idDoctor: this.idDoctors,
      fechaCita: moment(e).format('YYYY-MM-DD')
    }
    if(this.tipoAtencions == 1){
      this.api.cuposlibresFecha(data2).subscribe((data:string)=>{
        if(data){
          this.eventSource.forEach(element => {
            let pos = this.eventSource.map(function(a) { return moment(a.startTime).format('YYYY-MM-DD'); }).indexOf(moment(e).format('YYYY-MM-DD'));
            if(pos>=0){
              this.eventSource.splice(pos,1)
            }
          });
          for(let i = 0; i < data.length; i++){
            let horas = data[i].split("-")
            this.eventSource.push({
              title: "Cupo libre",
              startTime: moment(horas[0]+moment(e).format('YYYY-MM-DD'), "HH:mm YYYY-MM-DD").toDate(),
              endTime: moment(horas[1]+moment(e).format('YYYY-MM-DD'), "HH:mm YYYY-MM-DD").toDate(),
              allDay: false,
              desc: "Hora inicial de la cita: " + horas[0],
              desc2: "Hora final de la cita: " + horas[1]
            })
            this.myCal.loadEvents()
          }
        }
        loading.dismiss()
      },erro=>{
        loading.dismiss()
      })
    }else{
      this.api.cuposLibreDias(data2).subscribe((data:any)=>{
        if(data){
          this.eventSource.forEach(element => {
            let pos = this.eventSource.map(function(a) { return moment(a.startTime).format('YYYY-MM-DD'); }).indexOf(moment(e).format('YYYY-MM-DD'));
            if(pos>=0){
              this.eventSource.splice(pos,1)
            }
          });
            this.eventSource.push({
              title: "Cupos disponibles: "+data.CuposDisponibles ,
              startTime: moment(e).toDate(),
              endTime: moment(e).toDate(),
              allDay: false,
              desc: "Hora inicial de la cita: "+data.HoraInicial,
              desc2: "Hora final de la cita: "+data.HoraFinal
            })
            this.myCal.loadEvents()

        }
        loading.dismiss()
      },erro=>{
        loading.dismiss()
      })
    }
    
  }
  //Obtengo el detalle del medico
  obtenerMedico(){
    let data = {
      idDoctor: this.idDoctors
    }
    this.api.obetenerMedicoId(data).subscribe((data:any)=>{
        this.medico = data[0]
    })
  }

  //Alerta de seguridad para saber si esa persona esta segura de agendar la cita
  async openalert(e) {

    const alert = await this.alertController.create({
      header: 'Agendar cita',
      message: 'Al aceptar su cita quedara agendada para la fecha y hora seleccionada',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
           
          }
        }, {
          text: 'Aceptar',
          handler: async () => {

             const loading = await this.loadingController.create({
               message: 'Por favor espere...',
             });
             await loading.present();
             if(this.tipoAtencions == 1){
               let data = {
                servicio: this.medico.especialidad,
                idDoctor: this.idDoctors,
                estado: 'Pendiente',
                fecha: moment(e.startTime).format('YYYY-MM-DD'),
                hora: moment(e.startTime).format('HH:mm')+'-'+moment(e.endTime).format('HH:mm')
               }
               this.api.pedircita(data).subscribe(async ()=>{
                 loading.dismiss()
                 const toast = await this.toastController.create({
                   message: 'Cita agendada exitosamente',
                   duration: 2000
                 });
                 toast.present();
                 this.dismiss()
                 this.ruta.navigate(['/dashboard/citas'])
                 this.api.emitirsegmento()
               },async erro=>{
                 const alert = await this.alertController.create({
                   header: 'Agendar cupo',
                   message: erro.error.message,
                   buttons: ['OK']
                 });
                 
                 await alert.present();
                 loading.dismiss()
                 
               })
             }else{
               let data = {
                idDoctor: this.idDoctors,
                fechaCita: moment(e.startTime).format('YYYY-MM-DD'),
                servicio: this.medico.especialidad,
               }
               this.api.nuevacitaCupo(data).subscribe(async ()=>{
                loading.dismiss()
                const toast = await this.toastController.create({
                  message: 'Cita agendada exitosamente',
                  duration: 2000
                });
                toast.present();
                this.dismiss()
                this.api.emitirsegmento()
                this.ruta.navigate(['/dashboard/citas'])
              },async erro=>{
                const alert = await this.alertController.create({
                  header: 'Hola',
                  message: erro.error.message,
                  buttons: ['OK']
                });
           
                await alert.present();
                loading.dismiss()
              })
             }
          }
        }
      ]
    });
    await alert.present();
  }

  //Meotodo para cerrar el modal
  dismiss() {
    this.modalController.dismiss()
  }

}
