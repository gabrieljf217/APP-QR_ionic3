import { Component } from '@angular/core';
// plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
// componentes
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private barcodeScanner: BarcodeScanner,
              private toastCtrl: ToastController) {

  }

  escanear(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Datos del scan', barcodeData);
    }).catch(err => {
      console.log('Error: ', err);
      this.mostrarError('Error: '+err);
    });
  }

  mostrarError( mensaje:string ) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }
}



