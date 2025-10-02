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
  templateUrl: './create-password.component.html',
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
