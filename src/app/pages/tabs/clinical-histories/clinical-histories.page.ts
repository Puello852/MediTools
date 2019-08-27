import { Component, OnInit } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: 'app-clinical-histories',
  templateUrl: './clinical-histories.page.html',
  styleUrls: ['./clinical-histories.page.scss'],
})
export class ClinicalHistoriesPage implements OnInit {

  cog = faCog

  constructor() { }

  ngOnInit() {
  }

}
