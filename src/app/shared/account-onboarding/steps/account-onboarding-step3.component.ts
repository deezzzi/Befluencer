import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { AccountOnboardingService } from '../account-onboarding.service';

@Component({
  selector: 'bf-account-onboarding-step3',
  standalone: true,
  imports: [NgFor],
  template: `
    <!-- Step 3: Platforms (multi-select). Selected chips are black. -->
    <div>
      <h3 class="text-xl font-bold text-gray-900">Which social platform are you most active on?</h3>
      <p class="mt-1 text-sm text-gray-500">(select as many)</p>

      <div class="mt-5 flex flex-wrap gap-3">
        <button type="button"
                *ngFor="let p of platforms"
                (click)="toggle(p.key)"
                class="px-4 py-2 rounded-full border text-sm transition-colors"
                [class.border-slate-300]="!isSelected(p.key)"
                [class.text-gray-700]="!isSelected(p.key)"
                [class.bg-black]="isSelected(p.key)"
                [class.text-white]="isSelected(p.key)"
                [class.border-black]="isSelected(p.key)">
          {{ p.label }}
        </button>
      </div>

      
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOnboardingStep3Component {
  svc = inject(AccountOnboardingService);
  platforms = [
    { key: 'tiktok', label: 'Tiktok' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'twitter', label: 'Twitter' },
    { key: 'snapchat', label: 'Snapchat' },
    { key: 'x-twitter', label: 'X ( Twitter )' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'pinterest', label: 'Pinterest' },
    { key: 'discord', label: 'Discord' },
    { key: 'other', label: 'Other' },
  ];

  toggle(key: string) { this.svc.togglePlatform(key); }
  isSelected(key: string) { return this.svc.hasPlatform(key); }
}
