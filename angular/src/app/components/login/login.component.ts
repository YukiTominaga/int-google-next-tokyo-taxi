import { Component, OnInit } from '@angular/core';
import { GisQueryService } from '../../services/gis-query/gis-query.service';
import { Router } from '@angular/router';

@Component({
  selector: 'taxi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private gisQueryService: GisQueryService, private _router: Router) {
  }

  ngOnInit() {
    if (localStorage.getItem('login') === 'true') {
      this._router.navigate(['/map']);
    }
  }

  public login(): void {
    this.gisQueryService.login().then(() => {
      localStorage.setItem('login', 'true');
      this._router.navigate(['/map']);
      location.reload();
    });
  }

  public logout(): void {
    this.gisQueryService.logout();
    localStorage.removeItem('login');
    this._router.navigate(['/']);
  }
}
