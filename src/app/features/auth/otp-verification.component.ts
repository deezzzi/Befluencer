import { Component, ChangeDetectionStrategy, ElementRef, QueryList, ViewChildren, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage.service';

/**
 * OtpVerificationComponent
 * ------------------------
 * 4-digit OTP input UX with auto-advance, backspace navigation, arrow key support, and paste distribute.
 * Includes resend cooldown timer and masked email display.
 */
@Component({
  selector: 'bf-otp-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="otp-shell">
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
          <a class="back-link" routerLink="/signup/creator">&larr; Back</a>
          <div class="mini-logo">
            <span class="b">B</span>
            <span class="name">Befluencer</span>
          </div>
        </div>

        <div class="form-wrap">
          <h1 class="title">OTP Verification</h1>
          <p class="subtitle">
            We have sent you a one-time password to your email account<br />
            <strong>{{ maskedEmail }}</strong>
          </p>

          <form [formGroup]="form" novalidate (ngSubmit)="onVerify()">
            <label class="field">
              <span>Enter Code</span>
              <div class="otp">
                <input #otpInput *ngFor="let c of code.controls; index as i" maxlength="1" inputmode="numeric" pattern="[0-9]*"
                       [formControl]="c" (input)="onInput(i)" (keydown)="onKeyDown($event, i)" (paste)="onPaste($event)" />
              </div>
            </label>

            <div class="resend">
              Didn't&nbsp; receive the OTP?
              <button type="button" class="link" [disabled]="cooldown > 0" (click)="resend()">
                {{ cooldown > 0 ? 'Resend in ' + cooldown + 's' : 'Resend OTP' }}
              </button>
            </div>

            <button class="cta" type="submit" [disabled]="!form.valid">Verify</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./otp-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtpVerificationComponent implements OnDestroy {
  @ViewChildren('otpInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  form!: FormGroup;
  email: string | null = null;
  maskedEmail = '';
  cooldown = 0; // seconds remaining
  private timerId: any;

  get code(): FormArray<FormControl<string | null>> { return this.form.get('code') as FormArray<FormControl<string | null>>; }

  constructor(private fb: FormBuilder, private router: Router, private storage: LocalStorageService, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      code: this.fb.array<FormControl<string | null>>([
        this.fb.control<string | null>('', [Validators.required, Validators.pattern(/^[0-9]$/)]),
        this.fb.control<string | null>('', [Validators.required, Validators.pattern(/^[0-9]$/)]),
        this.fb.control<string | null>('', [Validators.required, Validators.pattern(/^[0-9]$/)]),
        this.fb.control<string | null>('', [Validators.required, Validators.pattern(/^[0-9]$/)])
      ])
    });

    // Read email from navigation state or storage
    const nav = this.router.getCurrentNavigation();
    const stateEmail = nav?.extras?.state?.['email'] as string | undefined;
    this.email = stateEmail ?? this.storage.getJSON<string>('auth:email');
    this.maskedEmail = this.maskEmail(this.email ?? '');
    // Start an initial cooldown (e.g., after sending code on signup)
    this.startCooldown(60);
  }

  private maskEmail(email: string): string {
    if (!email) return '';
    const [user, domain] = email.split('@');
    if (!user || !domain) return email;
    // Keep first 2 and last 2 chars of user, mask middle with *
    const left = user.slice(0, Math.min(2, user.length));
    const right = user.slice(Math.max(user.length - 2, 2));
    const stars = '*'.repeat(Math.max(user.length - left.length - right.length, 3));
    return `${left}${stars}${right}@${domain}`;
  }

  onInput(index: number) {
    const inputs = this.inputs?.toArray() ?? [];
    const el = inputs[index]?.nativeElement;
    const val = el?.value ?? '';
    // Keep only digits
    el!.value = val.replace(/\D/g, '').slice(0, 1);
    if (el!.value && index < inputs.length - 1) {
      inputs[index + 1].nativeElement.focus();
    }
  }

  onKeyDown(e: KeyboardEvent, index: number) {
    const inputs = this.inputs?.toArray() ?? [];
    const el = inputs[index]?.nativeElement;
    if (e.key === 'Backspace' && !el?.value && index > 0) {
      e.preventDefault();
      const prev = inputs[index - 1].nativeElement;
      prev.focus();
      prev.value = '';
      this.code.at(index - 1).setValue('');
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputs[index - 1].nativeElement.focus();
    }
    if (e.key === 'ArrowRight' && index < inputs.length - 1) {
      inputs[index + 1].nativeElement.focus();
    }
  }

  onPaste(e: ClipboardEvent) {
    const data = e.clipboardData?.getData('text') ?? '';
    const digits = data.replace(/\D/g, '').slice(0, this.code.length).split('');
    if (digits.length) {
      e.preventDefault();
      digits.forEach((d, i) => {
        if (i < this.code.length) {
          this.code.at(i).setValue(d);
          const input = this.inputs.toArray()[i].nativeElement;
          input.value = d;
        }
      });
      const nextIndex = Math.min(digits.length, this.code.length - 1);
      this.inputs.toArray()[nextIndex].nativeElement.focus();
    }
  }

  resend() {
    if (this.cooldown > 0) return;
    // TODO: call API to resend OTP for this.email
    // Reset inputs
    this.code.controls.forEach(c => c.setValue(''));
    this.inputs?.forEach(i => (i.nativeElement.value = ''));
    this.inputs?.first?.nativeElement.focus();
    // Restart cooldown
    this.startCooldown(60);
  }

  /** Start/reset the resend cooldown timer (seconds). */
  private startCooldown(seconds: number) {
    this.cooldown = seconds;
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      this.cooldown = Math.max(0, this.cooldown - 1);
      this.cdr.markForCheck();
      if (this.cooldown === 0) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
    }, 1000);
  }

  /** Ensure timer is cleaned up to avoid leaks. */
  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /** Submit handler: verify the code then proceed to Welcome. */
  onVerify() {
    if (this.form.valid) {
      const value = this.code.controls.map(c => c.value).join('');
      // placeholder: verify value, then navigate to welcome screen
      this.router.navigateByUrl('/auth/welcome');
    }
  }
}
