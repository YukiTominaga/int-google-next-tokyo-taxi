import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';

import { TaxiService } from './services/taxi/taxi.service';
import { FirestoreTaxiService } from './services/taxi/firestore-taxi.service';

import { AppComponent } from './app.component';
import { GisQueryViewComponent } from './components/gis-query-view/gis-query-view.component';
import { TaxiMapComponent } from './components/taxi-map/taxi-map.component';
import { LoginComponent } from './components/login/login.component';

import { } from 'googlemaps';

@NgModule({
  declarations: [
    AppComponent,
    GisQueryViewComponent,
    TaxiMapComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule,
  ],
  providers: [
    { provide: TaxiService, useClass: FirestoreTaxiService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
