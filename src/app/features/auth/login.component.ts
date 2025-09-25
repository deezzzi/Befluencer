import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

/**
 * LoginComponent
 * ---------------
 * Login screen mirroring signup styling.
 *
 * Notes:
 * - Reactive form validation for email/password.
 * - Forgot password link routes to the dedicated OTP-forgot flow.
 * - Replace TODO with real auth integration and error states.
 */
@Component({
  selector: 'bf-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, RouterLink],
  template: `
    <div class="login-shell">
      <div class="left purple">
        <div class="brand">
          <div class="logo">
            <span class="b">B</span>
            <span class="word">Befluencer</span>
          </div>
          <div class="tagline">Be seen. Be paid.</div>
        </div>
      </div>
      <div class="right">
        <div class="topbar">
          <a class="back-link" routerLink="/">&larr; Back</a>
          <div class="mini-logo">
            <img class="mark" src="/logo-ds.PNG" alt="Befluencer logo" />
          </div>
        </div>

        <div class="form-wrap">
          <h1 class="title">Log in</h1>
          <div class="signup">Don’t have an account? <a routerLink="/signup/creator">Create one</a></div>

          <form [formGroup]="form" novalidate (ngSubmit)="onSubmit()">
            <label class="field">
              <span>Email address *</span>
              <input type="email" formControlName="email" />
              <small class="err" *ngIf="form.controls.email.invalid && form.controls.email.touched">Enter a valid email</small>
            </label>
            <label class="field">
              <span>Password *</span>
              <div class="password">
                <input [type]="showPassword ? 'text' : 'password'" formControlName="password" />
                <button type="button" class="toggle" (click)="showPassword = !showPassword">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>{{ showPassword ? 'Hide' : 'Show' }}</span>
                </button>
              </div>
              <small class="err" *ngIf="form.controls.password.invalid && form.controls.password.touched">Required</small>
            </label>

            <div class="aux">
              <a routerLink="/auth/forgot" class="forgot">Forgot password?</a>
            </div>

            <button class="cta" type="submit" [disabled]="form.invalid">Log in</button>

            <div class="divider"><span>OR</span></div>
            <div class="socials">
              <button type="button" class="social google" aria-label="Log in with Google">G</button>
              <button type="button" class="social facebook" aria-label="Log in with Facebook">f</button>
              <button type="button" class="social apple" aria-label="Log in with Apple"></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  form = new FormBuilder().group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  showPassword = false;
  constructor(private router: Router) {}

  /** Placeholder submit: plug in real auth and route accordingly. */
  onSubmit() {
    if (this.form.valid) {
      // TODO: authenticate then route appropriately
      this.router.navigateByUrl('/dashboard');
    } else {
      this.form.markAllAsTouched();
    }
  }
}
