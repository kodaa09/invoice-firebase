import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service.js';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-home',
  imports: [HlmButtonDirective, ReactiveFormsModule, HlmInputDirective],
  templateUrl: './home.component.html',
  styles: `
    :host {
      height: 100%;
      display: flex;
    }
  `,
})
export class HomeComponent {
  private _authService = inject(AuthService);
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  public isLoginForm = signal(true);
  public authErrorMessage = signal('');
  public authForm = this._fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  get emailControl() {
    return this.authForm.controls['email'];
  }

  get passwordControl() {
    return this.authForm.controls['password'];
  }

  ngOnDestroy() {
    this._destroy$.next(true);
  }

  onSubmit() {
    const rawForm = this.authForm.getRawValue();

    if (this.isLoginForm()) {
      this._authService
        .login(rawForm.email, rawForm.password)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: () => {
            this._router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.authErrorMessage.set(this._formatErrorMessage(error.code));
          },
        });
    } else {
      this._authService
        .register(rawForm.email, rawForm.password)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: () => {
            this.isLoginForm.set(true);
          },
          error: (error) => {
            this.authErrorMessage.set(this._formatErrorMessage(error.code));
          },
        });
    }
  }

  onDisplayForm() {
    this.authForm.reset();
    this.authErrorMessage.set('');
    this.isLoginForm.update((oldValue) => !oldValue);
  }

  _formatErrorMessage(message: string): string {
    return message.split('/')[1].replaceAll('-', ' ');
  }
}
