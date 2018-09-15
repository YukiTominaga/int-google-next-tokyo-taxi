import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxiMapComponent } from './components/taxi-map/taxi-map.component';
import { GisQueryViewComponent } from './components/gis-query-view/gis-query-view.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './services/auth-service/auth-guard.service';

const routes: Routes = [
  { path: 'query-list', component: GisQueryViewComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'map', component: TaxiMapComponent, canActivate: [AuthGuardService] },
  { path: '', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
