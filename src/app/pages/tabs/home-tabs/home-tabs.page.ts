import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ApiToolsService } from 'src/app/services/api-tools.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home-tabs',
  templateUrl: './home-tabs.page.html',
  styleUrls: ['./home-tabs.page.scss'],
})
export class HomeTabsPage implements OnInit {
  data: any = {};
  datos: any = {};
  foto: string = "";

  constructor(private auth:ApiToolsService,public alert:AlertController,public loadingController :LoadingController) { }

  ngOnInit() {
    this.getinfo()
  }



  async getinfo(){
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
      mode: 'md'
    });
    await loading.present();
    this.auth.GetInfoUser().subscribe(async (data:any)=>{
 
      // alert(JSON.stringify(data))
      this.datos = data
      loading.dismiss()
      if (data.foto == 'None') {
       this.foto = './assets/img/person1.png'
     } else {
    //  alert("trajo foto")
  //  alert(JSON.stringify(data.foto))
       this.foto = await data.foto
     }
    },erro=>{
      loading.dismiss()
    })
  }



}
