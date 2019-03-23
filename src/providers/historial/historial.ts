import { Injectable } from '@angular/core';
import { ScanData } from "../../Models/scan-data.model";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { EmailComposer } from '@ionic-native/email-composer';
import { Platform, ToastController } from "ionic-angular";

@Injectable()
export class HistorialService {

  private _historial:ScanData[] =[];

  constructor( private iab: InAppBrowser,
              private contacts: Contacts,
              private platform:Platform,
              private toastCtrl:ToastController,
              private emailComposer: EmailComposer ) {
    
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
      case "email":
        this.crearMail(scanData.info);
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

  private crearMail( texto:string ){
    this.emailComposer.isAvailable().then((available: boolean) =>{
      let camposParaMail : any = this.parse_correo(texto);
      console.log("campo mail: " + camposParaMail[0]);
      console.log("campo sub: " + camposParaMail[1]);
      console.log("campo body: " + camposParaMail[2]);
      let email = {
        to: camposParaMail[0],
        cc: '',
        bcc: ['', ''],
        attachments: [
          '',
          '',
          '',
          ''
        ],
        subject: camposParaMail[1],
        body: camposParaMail[2],
        isHtml: true
      };
      // Send a text message using default options
      this.emailComposer.open(email);
    }).catch((error : any) =>
        {
          console.log('User does not appear to have device e-mail account');
          console.dir(error);
        });
    }

  private parse_correo( input:string ) {
    var fields = {};
    var input1 = input.slice(7); 
    var remuevoTo = input1.split("TO:");
    var soloMail = remuevoTo[1].split(";SUB:");
    fields[0] = soloMail[0];
    var remuevoBody = soloMail[1].split(";BODY:");
    fields[1] = remuevoBody[0];
    fields[2]= remuevoBody[1];
    return fields;
  }

}
