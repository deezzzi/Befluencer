import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const g = group as FormGroup;
  const p1 = g.get('password')?.value;
  const p2 = g.get('confirm')?.value;
  if (p1 && p2 && p1 !== p2) return { mismatch: true };
  return null;
}

@Component({
  selector: 'bf-create-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgIf],
  template: `
    <div class="create-shell">
      <div class="left purple">
        <div class="brand">
          <div class="logo">
            <img class="mark full" src="/logo.PNG" alt="Befluencer logo" />
          </div>
        </div>
      </div>
      <div class="right">
        <div class="topbar">
          <a class="back-link" routerLink="/auth/forgot">&larr; Back</a>
          <div class="mini-logo">
            <img class="mark" src="/logo-ds.PNG" alt="Befluencer logo" />
          </div>
        </div>

        <div class="form-wrap">
          <h1 class="title">Create New Password</h1>
          <p class="subtitle">Create your new password to log in</p>

          <form [formGroup]="form" novalidate (ngSubmit)="onSubmit()">
            <label class="field">
              <span>New Password *</span>
              <div class="password">
                <input [type]="show1 ? 'text' : 'password'" formControlName="password" />
                <button type="button" class="toggle" (click)="show1 = !show1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>{{ show1 ? 'Hide' : 'Show' }}</span>
                </button>
              </div>
              <small class="err" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">Minimum 8 characters</small>
            </label>

            <label class="field">
              <span>Confirm password *</span>
              <div class="password">
                <input [type]="show2 ? 'text' : 'password'" formControlName="confirm" />
                <button type="button" class="toggle" (click)="show2 = !show2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>{{ show2 ? 'Hide' : 'Show' }}</span>
                </button>
              </div>
              <small class="err" *ngIf="form.hasError('mismatch') && (form.get('confirm')?.touched || form.get('password')?.touched)">Passwords do not match</small>
            </label>

            <small class="hint">Use 8 or more characters with a mix of letters, numbers & symbols</small>

            <p class="terms">By creating an account, you agree to our
              <a href="#" (click)="$event.preventDefault()">Terms of use</a> and
              <a href="#" (click)="$event.preventDefault()">Privacy Policy</a>
            </p>

            <div class="captcha">
              <div class="check"><input type="checkbox" aria-label="I'm not a robot" /><span>I'm not a robot</span></div>
              <div class="badge">reCAPTCHA</div>
            </div>

            <button class="cta" type="submit" [disabled]="form.invalid">Create</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./create-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePasswordComponent {
  /**
   * CreatePasswordComponent
   *
   * Purpose
   * - Final step of the reset password flow; captures a new password and confirmation.
   * - Mirrors the login field styling and toggles for show/hide per design.
   *
   * Notes
   * - Cross-field validator `passwordsMatch` is applied at the FormGroup level.
   * - Submit currently routes to /login; wire to API on integration.
   */
  // Form will be initialized in constructor to ensure FormBuilder is available
  form!: ReturnType<FormBuilder['group']>;

  show1 = false;
  show2 = false;

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize form after fb is injected
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirm: ['', [Validators.required, Validators.minLength(8)]]
      },
      { validators: passwordsMatch }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      // TODO: call API to set new password, then route to login
      this.router.navigateByUrl('/login');
    } else {
      this.form.markAllAsTouched();
    }
  }
}
