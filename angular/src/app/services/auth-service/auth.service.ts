import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl = '/app/top';

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  /**
   * FirebaseAuthを利用したログイン処理
   * ログイン成功後、任意のページへジャンプする
   * @param email ログインID
   * @param pass パスワード
   */
  public async login(email: string, pass: string): Promise<boolean> {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, pass);
      this.afAuth.idToken.subscribe(idToken => localStorage.setItem('idToken', idToken));
      this.router.navigate([this.redirectUrl]);
      return true;
    } catch (err) {
      return false;
    }
  }

  public isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => user !== null),
    );
  }

  public async logout(): Promise<any> {
    localStorage.removeItem('idToken');
    localStorage.removeItem('loggedIn');
    return this.afAuth.auth.signOut();
  }

  public async getToken(): Promise<string | boolean> {
    const token = await this.afAuth.auth.currentUser.getIdToken();
    localStorage.setItem('idToken', token);
    return token;
  }

}
