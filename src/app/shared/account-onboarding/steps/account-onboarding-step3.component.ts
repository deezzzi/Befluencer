import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { AccountOnboardingService } from '../account-onboarding.service';

@Component({
  selector: 'bf-account-onboarding-step3',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <!-- Step 3: Platforms (single-select). Selected chip is black. If 'Other' is selected, show an input. -->
    <div>
      <h3 class="text-xl font-bold text-gray-900">Which social platform are you most active on?</h3>
      <p class="mt-1 text-sm text-gray-500">(select one)</p>

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

      <!-- Other freeform input when 'Other' is selected -->
      <div class="mt-5" *ngIf="isSelected('other')">
        <input
          type="text"
          class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Please specify..."
          [value]="svc.getPlatformOther()"
          (input)="onOtherInput($any($event.target).value)"
        />
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
  onOtherInput(v: string) { this.svc.setPlatformOther(v); }
}
