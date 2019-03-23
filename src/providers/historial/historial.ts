import { Injectable } from '@angular/core';
import { ScanData } from "../../Models/scan-data.model";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';

import { Platform, ToastController } from "ionic-angular";

@Injectable()
export class HistorialService {

  private _historial:ScanData[] =[];

  constructor( private iab: InAppBrowser,
              private contacts: Contacts,
              private platform:Platform,
              private toastCtrl:ToastController ) {
    
  }

  agregarHistorial(texto:string){
    let data = new ScanData(texto);
    this._historial.unshift(data);
    console.log(this._historial);
    this.abrirScann(0);
  }

  abrirScann( index:number ){
    let scanData = this._historial[index];
    console.log(scanData);
    switch ( scanData.tipo ){
      case "http":
        this.iab.create( scanData.info, "_system");
      break
      case "contacto":
        this.crearContacto(scanData.info);
      break

      default:
        console.error("Tipo no encontrado");
        
    }
  }

  cargarHistorial(){
    return this._historial;
  }

  private crearContacto( texto:string ){
    let campos:any=this.parse_vcard(texto);
    console.log(campos);
    
    let nombre = campos['fn'];
    let tel = campos.tel[0].value[0];

    if (!this.platform.is('cordova')) {
      console.log("En computador no se pude realizar esta acción");
      return;
    }

    let contact: Contact = this.contacts.create();
    contact.name = new ContactName(null,nombre);
    contact.phoneNumbers = [ new ContactField('mobile',tel) ];
    contact.save().then(
      ()=> this.crearToast("Contacto " + nombre + " creado."),
      (error)=>this.crearToast("Error: "+ error)
    );
  }

  crearToast( mensaje:string ){
    this.toastCtrl.create({
      message : mensaje,
      duration : 3000
    }).present();
  }

  private parse_vcard( input:string ) {

    var Re1 = /^(version|fn|title|org):(.+)$/i;
    var Re2 = /^([^:;]+);([^:]+):(.+)$/;
    var ReKey = /item\d{1,2}\./;
    var fields = {};

    input.split(/\r\n|\r|\n/).forEach(function (line) {
      var results, key;

      if (Re1.test(line)) {
        results = line.match(Re1);
        key = results[1].toLowerCase();
        fields[key] = results[2];
      } else if (Re2.test(line)) {
        results = line.match(Re2);
        key = results[1].replace(ReKey, '').toLowerCase();

        var meta = {};
        results[2].split(';')
          .map(function (p, i) {
          var match = p.match(/([a-z]+)=(.*)/i);
          if (match) {
              return [match[1], match[2]];
          } else {
              return ["TYPE" + (i === 0 ? "" : i), p];
          }
        })
          .forEach(function (p) {
          meta[p[0]] = p[1];
        });

        if (!fields[key]) fields[key] = [];

        fields[key].push({
            meta: meta,
            value: results[3].split(';')
        })
      }
    });
    return fields;
  };

}
