import { Component, OnInit } from '@angular/core';
import { faNotesMedical,faHospitalSymbol } from '@fortawesome/free-solid-svg-icons'
import { ApiToolsService } from 'src/app/services/api-tools.service';
import { ModalController } from '@ionic/angular';
import { EditProfilePage } from '../tabs/edit-profile/edit-profile.page';
@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.page.html',
  styleUrls: ['./dashboard-home.page.scss'],
})
export class DashboardHomePage implements OnInit {

  faNotes = faNotesMedical
  faHospitalSymbo = faHospitalSymbol
  verficdo: boolean;
  data: any;
  constructor(public modalController: ModalController,private api:ApiToolsService) {
    //al momento de loguarte verifico el usuario y obtengo su informacion
    this.verification()
  }

  //Metodo para ver su estado ya que el usuario puede estar  o no verificado
  verification(){
    
    this.api.GetInfoUser().subscribe((data:any)=>{
      this.data = data
      this.verficdo = data.verificado
      if(!data.verificado){
        //si el usuario no esta verificado abro el modal que no se pueda cerrar y que verifique su celular
        this.openModal()
      }
    })
  }

  ngOnInit() {
  }

  // el modal para que verifique su usarios
  async openModal(){
    const modal = await this.modalController.create({
      component: EditProfilePage,
      keyboardClose:false,
      backdropDismiss: false,
      cssClass: 'modals1',
      //Aqui le paso al modal el correo celular y si ha verificado el celular porque la persona pudo o no haber completado el primer paso y no el segundo y asi dejarlo por el segundo paso
      componentProps: {
        'email': this.data.email,
        'celular': this.data.celular,
        'celularverificado': this.data.CelularVerificado
      }
    });
    return await modal.present();
  }

  // esta es un funcion para emitir que cargue la informacion de la persona al momento de dar click en el tabs de HOME
  onClick(){
    this.api.emitircarga()
  }

}
