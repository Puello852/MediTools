import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home-tabs',
  templateUrl: './home-tabs.page.html',
  styleUrls: ['./home-tabs.page.scss'],
})
export class HomeTabsPage implements OnInit {
  data: any = {};
  datos: any = {};
  foto: string = "";

  constructor(private auth:AuthenticationService) { }

  ngOnInit() {
    this.getinfo()
  }

  getinfo(){
    this.data = this.auth.userDetails()
 
    if (this.data.photoURL == null || !this.data.photoURL) {
      this.foto = './assets/img/person1.png'
    } else {
    console.log("trajo foto")
      this.foto = this.data.photoURL
    }
    this.auth.getInfoUser(this.data.uid).subscribe(data=>{
      console.log(data)
      console.log(this.data)
      this.datos = data
    })
  }



}
