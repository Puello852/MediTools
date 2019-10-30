import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ApiToolsService } from 'src/app/services/api-tools.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-tabs',
  templateUrl: './home-tabs.page.html',
  styleUrls: ['./home-tabs.page.scss'],
})
export class HomeTabsPage implements  OnInit, OnDestroy {
  data: any = {};
  datos: any = {};
  foto: string = "";
  cargar: Subscription;
  loading: HTMLIonLoadingElement;

  constructor( private router: Router,private auth:ApiToolsService,public alert:AlertController,public loadingController :LoadingController,private api :ApiToolsService) {
    console.log(this.router.url)

  }

  ngOnInit() {
    this.getinfo(1)
    this.cargar = this.api.cargar.subscribe(()=>{
      this.getinfo(0)
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.cargar.unsubscribe()
  }


  async getinfo(e){
    if(e){
      this.loading = await this.loadingController.create({
        message: 'Por favor espere...',
        mode: 'md'
      });
      await this.loading.present();
    }
    this.auth.GetInfoUser().subscribe(async (data:any)=>{
 
      // alert(JSON.stringify(data))
      this.datos = data
      if(e) this.loading.dismiss()
      if (data.foto == 'None') {
       this.foto = './assets/img/person1.png'
     } else {
       this.foto = await data.foto
     }
    },erro=>{
      if(e) this.loading.dismiss()
    })
  }



}
