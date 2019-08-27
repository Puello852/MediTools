import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-citastabs',
  templateUrl: './citastabs.page.html',
  styleUrls: ['./citastabs.page.scss'],
})
export class CitastabsPage implements OnInit {
  date: string;
  type: 'string'
  constructor() { }

  ngOnInit() {
  }

  onChange($event) {
    console.log($event);
  }

}
