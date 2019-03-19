import { Component } from '@angular/core';
import { HistorialService } from "../../providers/historial/historial";
import { ScanData } from "../../Models/scan-data.model";

@Component({
  selector: 'page-guardados',
  templateUrl: 'guardados.html',
})
export class GuardadosPage {

  historial: ScanData[] = [];

  constructor( private _historialService:HistorialService ) {
  }

  ionViewDidLoad() {
    this.historial = this._historialService.cargarHistorial();
  }

  abrir_scan( index:number ){
    this._historialService.abrirScann( index );
  }

}
