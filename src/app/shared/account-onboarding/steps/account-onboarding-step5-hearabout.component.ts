import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { AccountOnboardingService } from '../account-onboarding.service';

@Component({
  selector: 'bf-account-onboarding-step5-hearabout',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <!-- Step 5: Hear about us. Multi-select chips.
         - If 'Referral' selected: show "Enter referral code"
         - If 'Other' selected: show "Please specify..."
         Selected chips are black -->
    <div>
      <h3 class="text-xl font-bold text-gray-900">Where did you hear about us?</h3>

      <div class="mt-5 flex flex-wrap gap-3">
        <button type="button"
                *ngFor="let r of referrers"
                (click)="toggle(r.key)"
                class="px-4 py-2 rounded-full border text-sm transition-colors"
                [class.border-slate-300]="!isSelected(r.key)"
                [class.text-gray-700]="!isSelected(r.key)"
                [class.bg-black]="isSelected(r.key)"
                [class.text-white]="isSelected(r.key)"
                [class.border-black]="isSelected(r.key)">
          {{ r.label }}
        </button>
      </div>

      <!-- Referral code input -->
      <div class="mt-5" *ngIf="isSelected('referral')">
        <input
          type="text"
          class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Enter referral code"
          [value]="svc.getReferralCode()"
          (input)="onReferralInput($any($event.target).value)"
        />
      </div>

      <!-- Other details input -->
      <div class="mt-5" *ngIf="isSelected('other')">
        <input
          type="text"
          class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Please specify..."
          [value]="svc.getReferrerOther()"
          (input)="onOtherInput($any($event.target).value)"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOnboardingStep5HearAboutComponent {
  svc = inject(AccountOnboardingService);
  referrers = [
    { key: 'friend', label: 'Friend' },
    { key: 'referral', label: 'Referral' },
    { key: 'google', label: 'Google' },
    { key: 'reddit', label: 'Reddit' },
    { key: 'website', label: 'Our website' },
    { key: 'tv-newspaper', label: 'TV/Newspaper' },
    { key: 'linkedin', label: 'Linkedin' },
    { key: 'colleague', label: 'Colleague' },
    { key: 'radio', label: 'Radio' },
    { key: 'tiktok', label: 'Tiktok' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'x', label: 'X' },
    { key: 'other', label: 'Other' },
  ];

  toggle(key: string) { this.svc.toggleReferrer(key); }
  isSelected(key: string) { return this.svc.hasReferrer(key); }
  onOtherInput(v: string) { this.svc.setReferrerOther(v); }
  onReferralInput(v: string) { this.svc.setReferralCode(v); }
}
