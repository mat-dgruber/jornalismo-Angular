
import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user, User, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  user$: Observable<User | null> = user(this.auth);

  constructor() { }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async loginWithEmail(email: string, pass: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, pass);
    } catch (error) {
      console.error('Login with email failed', error);
      throw error;
    }
  }

  async logout() {
    await signOut(this.auth);
  }
}
