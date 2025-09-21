import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bf-account-onboarding-step4',
  standalone: true,
  template: `
    <div>
      <h3 class="text-xl font-bold text-gray-900">Audience & categories</h3>
      <p class="mt-2 text-sm text-gray-700">Tell us about your audience and the kinds of content you create to improve recommendations.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOnboardingStep4Component {}
