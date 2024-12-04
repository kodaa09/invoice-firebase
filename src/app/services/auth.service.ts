import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { from } from 'rxjs';
import { UserInterface } from '../interfaces/auth.interface.js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebase = inject(Auth);
  user$ = user(this.firebase);
  currentUser = signal<UserInterface | null | undefined>(undefined);

  register(email: string, password: string) {
    const promise = createUserWithEmailAndPassword(this.firebase, email, password);
    return from(promise);
  }

  login(email: string, password: string) {
    const promise = signInWithEmailAndPassword(this.firebase, email, password);
    return from(promise);
  }

  logout() {
    const promise = signOut(this.firebase);
    return from(promise);
  }
}
