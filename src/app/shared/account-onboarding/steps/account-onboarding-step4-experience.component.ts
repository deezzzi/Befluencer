import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { AccountOnboardingService } from '../account-onboarding.service';

@Component({
  selector: 'bf-account-onboarding-step4-experience',
  standalone: true,
  imports: [NgFor],
  template: `
    <div>
      <h3 class="text-xl font-bold text-gray-900">How long have you been creating content?</h3>

      <div class="mt-5 grid gap-3">
        <label *ngFor="let o of options" class="flex items-start gap-3 cursor-pointer">
          <input type="radio" name="experience" [value]="o.key" class="mt-1.5 accent-orange-500" [checked]="isSelected(o.key)" (change)="select(o.key)" />
          <span class="text-sm text-gray-800">{{ o.label }}</span>
        </label>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOnboardingStep4ExperienceComponent {
  svc = inject(AccountOnboardingService);
  options = [
    { key: 'just-starting', label: 'Just starting out' },
    { key: 'lt-1y', label: 'Less than 1 year' },
    { key: '1-2y', label: '1 - 2 years' },
    { key: 'gt-3y', label: 'More than 3 years' },
  ];

  select(key: string) { this.svc.setExperience(key); }
  isSelected(key: string) { return this.svc.getExperience() === key; }
}
