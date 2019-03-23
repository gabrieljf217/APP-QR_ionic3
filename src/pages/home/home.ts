import { Component } from '@angular/core';
// plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
// componentes
import { ToastController, Platform } from 'ionic-angular';
//servicios
import { HistorialService } from "../../providers/historial/historial";
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private barcodeScanner: BarcodeScanner,
              private toastCtrl: ToastController,
              private platform:Platform,
              private _historialService:HistorialService,
              private contacts: Contacts) {

  }

  escanear(){

    if( !this.platform.is('cordova')){
      this._historialService.agregarHistorial( `BEGIN:VCARD
VERSION:2.1
N:Kent;Clark
FN:Clark Kent
ORG:
TEL;HOME;VOICE:12345
TEL;TYPE=cell:67890
ADR;TYPE=work:;;;
EMAIL:clark@superman.com
END:VCARD` );
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



