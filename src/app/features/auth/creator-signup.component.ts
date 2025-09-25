import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage.service';

/**
 * CreatorSignupComponent
 * ----------------------
 * Signup screen for creators following the split screen layout.
 *
 * UX/Logic notes:
 * - Uses Reactive Forms for validation (required + email + min length).
 * - Persists email via LocalStorage to survive refresh and to aid OTP flow.
 * - On submit, navigates to OTP with email passed in router state.
 */
@Component({
  selector: 'bf-creator-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  template: `
    <div class="signup-shell">
      <div class="left purple">
        <div class="brand">
          <div class="logo">
            <img class="mark full" src="/logo.PNG" alt="Befluencer logo" />
          </div>
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
          <h1 class="title">Create an account</h1>
          <div class="login">Already have an account? <a routerLink="/login">Log in</a></div>

          <form [formGroup]="form" novalidate (ngSubmit)="onSubmit()">
            <label class="field">
              <span>First name *</span>
              <input type="text" formControlName="firstName" />
              <small class="err" *ngIf="form.controls.firstName.invalid && form.controls.firstName.touched">Required</small>
            </label>
            <label class="field">
              <span>Last name *</span>
              <input type="text" formControlName="lastName" />
              <small class="err" *ngIf="form.controls.lastName.invalid && form.controls.lastName.touched">Required</small>
            </label>
            <label class="field">
              <span>Email address *</span>
              <input type="email" formControlName="email" />
              <small class="err" *ngIf="form.controls.email.invalid && form.controls.email.touched">Enter a valid email</small>
            </label>
            <label class="field">
              <span>Create password *</span>
              <div class="password">
                <input [type]="showPassword ? 'text' : 'password'" formControlName="password" />
                <button type="button" class="toggle" (click)="showPassword = !showPassword">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>{{ showPassword ? 'Hide' : 'Show' }}</span>
                </button>
              </div>
              <small class="hint">Use 8 or more characters with a mix of letters, numbers & symbols</small>
              <small class="err" *ngIf="form.controls.password.invalid && form.controls.password.touched">Minimum 8 characters</small>
            </label>

            <p class="terms">By creating an account, you agree to our <a href="#" (click)="$event.preventDefault()">Terms of use</a> and <a href="#" (click)="$event.preventDefault()">Privacy Policy</a></p>

            <div class="captcha">
              <div class="check"><input type="checkbox" aria-label="I'm not a robot" /><span>I'm not a robot</span></div>
              <div class="badge">reCAPTCHA</div>
            </div>

            <button class="cta" type="submit" [disabled]="form.invalid">Create Account</button>

            <div class="divider"><span>OR</span></div>
            <div class="socials">
              <button type="button" class="social google" aria-label="Sign up with Google">G</button>
              <button type="button" class="social facebook" aria-label="Sign up with Facebook">f</button>
              <button type="button" class="social apple" aria-label="Sign up with Apple"></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./creator-signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatorSignupComponent {
  form = new FormBuilder().group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  showPassword = false;
  constructor(private router: Router, private storage: LocalStorageService) {}

  /** Handle submit: persist email and proceed to OTP. */
  onSubmit() {
    if (this.form.valid) {
      const { firstName, lastName, email } = this.form.value as { firstName: string; lastName: string; email: string };
      // Persist essentials for downstream flows (OTP + greeting)
      this.storage.setJSON('auth:email', email);
      const displayName = `${(firstName || '').trim()} ${(lastName || '').trim()}`.trim();
      if (displayName) {
        this.storage.setJSON('profile:displayName', displayName);
        this.storage.setJSON('auth:user', { firstName, lastName, email, displayName });
      }
      this.router.navigate(['/auth/otp'], { state: { email } });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
