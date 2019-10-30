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
    this.verification()
  }

  verification(){
    this.api.GetInfoUser().subscribe((data:any)=>{
      this.data = data
      this.verficdo = data.verificado
      if(!data.verificado){
        
        this.openModal()
      }
    })
  }

  ngOnInit() {
    
  }

  async openModal(){
    const modal = await this.modalController.create({
      component: EditProfilePage,
      keyboardClose:false,
      backdropDismiss: false,
      cssClass: 'modals1',
      componentProps: {
        'email': this.data.email,
        'celular': this.data.celular,
        'celularverificado': this.data.CelularVerificado
      }
    });
    return await modal.present();
  }

  onClick(){
    this.api.emitircarga()
  }

}
