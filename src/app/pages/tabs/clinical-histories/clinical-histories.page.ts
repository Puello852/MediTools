import { Component, OnInit } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: 'app-clinical-histories',
  templateUrl: './clinical-histories.page.html',
  styleUrls: ['./clinical-histories.page.scss'],
})
export class ClinicalHistoriesPage implements OnInit {

  cog = faPlusCircle

  constructor() { }

  ngOnInit() {
  }

}
