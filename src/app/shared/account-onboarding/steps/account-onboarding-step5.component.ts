import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bf-account-onboarding-step5',
  standalone: true,
  template: `
    <div>
      <h3 class="text-xl font-bold text-gray-900">Preferences & goals</h3>
      <p class="mt-2 text-sm text-gray-700">Choose your collaboration preferences, niches, and goals so we can tailor your experience.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOnboardingStep5Component {}
