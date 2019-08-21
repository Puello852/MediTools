import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  @Input() datosProfile: any;
  @Input() datos: any;

  form = new FormGroup({
    
  })
  constructor(private modal:ModalController,navParams: NavParams) { 
    console.log(navParams.get('datosProfile'))
    console.log(navParams.get('datos'))
  }

  ngOnInit() {
  }

  dismissModal() {
   
    this.modal.dismiss({
      'dismissed': true
    });
    
  }
}
