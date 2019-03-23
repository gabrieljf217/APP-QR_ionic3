import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

//plugins
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts } from '@ionic-native/contacts';
import { EmailComposer } from '@ionic-native/email-composer';

//servicios
import { HistorialService } from '../providers/historial/historial';

import { MyApp } from './app.component';
import { HomePage,
        GuardadosPage,
        TabsPage,
        MapaPage } from "../pages/index.paginas";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GuardadosPage,
    TabsPage,
    MapaPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GuardadosPage,
    TabsPage,
    MapaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HistorialService,
    InAppBrowser,
    Contacts,
    EmailComposer
  ]
})
export class AppModule {}
