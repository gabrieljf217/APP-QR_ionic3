import { Injectable } from '@angular/core';
import { ScanData } from "../../Models/scan-data.model";
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Injectable()
export class HistorialService {

  private _historial:ScanData[] =[];

  constructor( private iab: InAppBrowser ) {
    
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
      default:
        console.error("Tipo no encontrado");
        
    }
  }

  cargarHistorial(){
    return this._historial;
  }

}
