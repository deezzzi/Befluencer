import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

/**
 * LoginComponent
 * ---------------
 * Simple reactive login form.
 * - Validates email/password and shows basic inline errors
 * - Forgot password link routes to the OTP-forgot flow
 * - Replace placeholder submit with real auth integration + error states
 */
@Component({
  selector: 'bf-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
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
