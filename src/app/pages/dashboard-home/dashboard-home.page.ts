import { Component, OnInit } from '@angular/core';
import { faNotesMedical,faHospitalSymbol } from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.page.html',
  styleUrls: ['./dashboard-home.page.scss'],
})
export class DashboardHomePage implements OnInit {

  faNotes = faNotesMedical
  faHospitalSymbo = faHospitalSymbol
  constructor() { }

  ngOnInit() {
  }

}
