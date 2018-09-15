import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  /**
   * ルートによって示されたコンポネントへアクセスできるかどうか
   */
  public canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      take(1),
      tap(auth => {
        if (auth) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }),
    );
  }

}
