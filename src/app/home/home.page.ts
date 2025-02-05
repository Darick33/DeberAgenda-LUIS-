import { Component } from '@angular/core';
import { ModalController, LoadingController, NavController } from '@ionic/angular';
import { AccesoService } from '../service/acceso.service';
import { CuentaPage } from '../cuenta/cuenta.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  txt_usuario: string = "";
  txt_clave: string = "";
  intentosFallidos: number = 0;  

  constructor(
    private loadingCtrl: LoadingController,
    private servicio: AccesoService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
  ) { }

  login() {
    // Verificar si la cuenta está bloqueada
    if (this.intentosFallidos >= 3) {
      this.servicio.showToast("Cuenta bloqueada por intentos fallidos", 3000);
      return; 
    }

    let datos = {
      accion: 'login',
      usuario: this.txt_usuario,
      clave: this.txt_clave
    }

    this.servicio.postData(datos).subscribe((res: any) => {
      console.log(res);
      if (res.estado) {
     
        this.intentosFallidos = 0;
        this.servicio.createSession('idpersona', res.persona.codigo);
        this.servicio.createSession('persona', res.persona.nombre);
        // this.showLoading();
        this.navCtrl.navigateRoot(['/menu']);
      } else {
        this.intentosFallidos++;
        this.servicio.showToast("No encontró la persona", 3000);

        if (this.intentosFallidos >= 3) {
          this.servicio.showToast("Cuenta bloqueada por intentos fallidos", 3000);
        }
      }
    })
  }

  async crear() {
    const modal = await this.modalCtrl.create({
      component: CuentaPage
    });
    return await modal.present();
  }

  recuperar() {
    this.navCtrl.navigateForward("/rclave");
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Dismissing after 3 seconds...',
      duration: 2000,
    });

    loading.present();
  }

}
