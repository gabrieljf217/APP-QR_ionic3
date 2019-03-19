import { Component } from '@angular/core';
// plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
// componentes
import { ToastController, Platform } from 'ionic-angular';
//servicios
import { HistorialService } from "../../providers/historial/historial";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private barcodeScanner: BarcodeScanner,
              private toastCtrl: ToastController,
              private platform:Platform,
              private _historialService:HistorialService) {

  }

  escanear(){

    if( !this.platform.is('cordova')){
      this._historialService.agregarHistorial("http:google.com");
      return;
    }

    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Result: ' + barcodeData.text);
      console.log('Format: ' + barcodeData.format);
      console.log('Cancelled: ' + barcodeData.cancelled);

      if(barcodeData.cancelled == false && barcodeData.text != null ){
        this._historialService.agregarHistorial(barcodeData.text);
      }
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



