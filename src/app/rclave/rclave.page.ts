import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../service/acceso.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-rclave',
  templateUrl: './rclave.page.html',
  styleUrls: ['./rclave.page.scss'],
  standalone: false
})
export class RclavePage implements OnInit {
  nuevaClave: string = "";
  usuario: string = "";
  respuesta: string = "";

  mostrarUsuario: boolean = true;
  mostrarPregunta: boolean = false;
  mostrarCambioClave: boolean = false;

  constructor(private servicio: AccesoService, private navCtrl: NavController) {}

  ngOnInit() {}

  verificarUsuario() {
    const datos = {
      accion: 'preguntaSeguridad',  
      ci: this.usuario              
    };

    this.servicio.postData(datos).subscribe((res: any) => {
      if (res.estado) {
        this.mostrarUsuario = false;
        this.mostrarPregunta = true;
      } else {
        this.servicio.showToast(res.mensaje, 2000);
      }
    });
  }

  verificarRespuesta() {
    if (!this.respuesta) {
      this.servicio.showToast("Por favor, selecciona una fecha.", 2000);
      return;
    }

    const fechaFormateada = new Date(this.respuesta).toISOString().split('T')[0];
    console.log(fechaFormateada);
    const datos = {
      accion: 'verificarRespuestaSeguridad',
      ci: this.usuario,
      respuesta: fechaFormateada 
    };

    this.servicio.postData(datos).subscribe((res: any) => {
      if (res.estado) {
        this.mostrarPregunta = false;
        this.mostrarCambioClave = true;
        this.servicio.showToast(res.mensaje, 2000);
      } else {
        this.servicio.showToast(res.mensaje, 2000);
      }
    });
  }

  async cambiarClave() {
    const id = this.usuario;

    const datos = {
      accion: 'cambiarClave',  
      id: id,
      clave: this.nuevaClave
    };

    this.servicio.postData(datos).subscribe((res: any) => {
      if (res.estado) {
        this.servicio.showToast("Clave cambiada con éxito", 2000);
        this.navCtrl.navigateBack("/home");
      } else {
        this.servicio.showToast(res.mensaje, 2000);
      }
    });
  }
}
