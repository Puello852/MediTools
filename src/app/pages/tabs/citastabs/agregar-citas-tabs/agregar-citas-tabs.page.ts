import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-agregar-citas-tabs',
  templateUrl: './agregar-citas-tabs.page.html',
  styleUrls: ['./agregar-citas-tabs.page.scss'],
})
export class AgregarCitasTabsPage implements OnInit {

  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };

  minDate = new Date().toISOString();
  form = new FormGroup({
    title: new FormControl('',Validators.required),
    desc: new FormControl('',Validators.required),
    finicial: new FormControl('',Validators.required),
    ffinal: new FormControl('',Validators.required),
  })
  constructor(private modal:ModalController,private toas:ToastController,public alertController: AlertController) { }

  ngOnInit() {
  }

  closeModal(){
    this.modal.dismiss()
  }

  async addEvent() {
    let eventCopy = {
      title: this.event.title,
      startTime:  new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      desc: this.event.desc
    }
 
    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;
 
      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }
 
    // this.eventSource.push(eventCopy);

    const toast = await this.toas.create({
      message: 'Cita creada exitosamente',
      duration: 2000
    });
    toast.present();
    this.modal.dismiss({
      eventCopy
    })
  }
}
