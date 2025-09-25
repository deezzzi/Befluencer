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
              <button type="button" class="social google" aria-label="Log in with Google">
                <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                  <path d="M30.5014 16.3114C30.5014 15.1603 30.4061 14.3203 30.1998 13.4492H16.7871V18.6447H24.6601C24.5014 19.9359 23.6442 21.8803 21.7394 23.1869L21.7127 23.3609L25.9536 26.5805L26.2474 26.6092C28.9458 24.167 30.5014 20.5736 30.5014 16.3114Z" fill="#4285F4"/>
                  <path d="M16.7853 29.9998C20.6424 29.9998 23.8804 28.7553 26.2456 26.6086L21.7377 23.1863C20.5313 24.0108 18.9123 24.5863 16.7853 24.5863C13.0076 24.5863 9.80128 22.1441 8.65832 18.7686L8.49078 18.7825L4.08111 22.127L4.02344 22.2841C6.37261 26.8574 11.198 29.9998 16.7853 29.9998Z" fill="#34A853"/>
                  <path d="M8.66061 18.769C8.35903 17.8979 8.1845 16.9645 8.1845 16.0001C8.1845 15.0356 8.35903 14.1023 8.64475 13.2312L8.63676 13.0456L4.17181 9.64746L4.02572 9.71556C3.05751 11.6134 2.50195 13.7445 2.50195 16.0001C2.50195 18.2556 3.05751 20.3867 4.02572 22.2845L8.66061 18.769Z" fill="#FBBC05"/>
                  <path d="M16.7854 7.4133C19.4679 7.4133 21.2774 8.54885 22.3092 9.4978L26.3409 5.64C23.8648 3.38445 20.6425 2 16.7854 2C11.198 2 6.37262 5.1422 4.02344 9.71549L8.64247 13.2311C9.80131 9.85555 13.0076 7.4133 16.7854 7.4133Z" fill="#EB4335"/>
                </svg>
              </button>
              <button type="button" class="social facebook" aria-label="Log in with Facebook">
                <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                  <circle cx="16.5" cy="16" r="14" fill="#0C82EE"/>
                  <path d="M21.7137 20.2816L22.3356 16.3301H18.4452V13.767C18.4452 12.6857 18.9877 11.6311 20.7302 11.6311H22.5V8.26699C22.5 8.26699 20.8945 8 19.3603 8C16.1548 8 14.0617 9.89294 14.0617 13.3184V16.3301H10.5V20.2816H14.0617V29.8345C14.7767 29.944 15.5082 30 16.2534 30C16.9986 30 17.7302 29.944 18.4452 29.8345V20.2816H21.7137Z" fill="white"/>
                </svg>
              </button>
              <button type="button" class="social apple" aria-label="Log in with Apple">
                <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                  <path d="M30.5 16C30.5 23.728 24.235 30 16.5 30C8.765 30 2.5 23.728 2.5 16C2.5 8.265 8.765 2 16.5 2C24.235 2 30.5 8.265 30.5 16Z" fill="#333333"/>
                  <path d="M23.0621 12.4574C22.9857 12.502 21.1671 13.4425 21.1671 15.5279C21.2528 17.9061 23.4621 18.7401 23.5 18.7401C23.4621 18.7847 23.1665 19.8763 22.2907 21.0205C21.5956 22.0062 20.8242 23 19.6528 23C18.5385 23 18.1385 22.3431 16.8528 22.3431C15.472 22.3431 15.0813 23 14.0242 23C12.8528 23 12.0242 21.953 11.2913 20.9766C10.3391 19.6986 9.52978 17.6931 9.50121 15.7675C9.48195 14.7471 9.69189 13.744 10.2248 12.8921C10.977 11.7026 12.3198 10.8952 13.7863 10.8686C14.9099 10.8333 15.9099 11.5875 16.5956 11.5875C17.2528 11.5875 18.4814 10.8686 19.8714 10.8686C20.4714 10.8692 22.0714 11.0376 23.0621 12.4574ZM16.5006 10.6649C16.3006 9.73303 16.8528 8.80119 17.3671 8.20677C18.0242 7.48792 19.0621 7 19.9571 7C20.0143 7.93185 19.6522 8.84575 19.005 9.51136C18.4242 10.2302 17.4242 10.7714 16.5006 10.6649Z" fill="white"/>
                </svg>
              </button>
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
