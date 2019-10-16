import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-estado-cita',
  templateUrl: './detalle-estado-cita.page.html',
  styleUrls: ['./detalle-estado-cita.page.scss'],
})
export class DetalleEstadoCitaPage implements OnInit {
  citaId: any;

  constructor(private route: ActivatedRoute) { 
    this.route.params.subscribe((e:any)=>{
      this.citaId = e.id
      console.log(this.citaId)
    })
  }

  ngOnInit() {
  }

}
