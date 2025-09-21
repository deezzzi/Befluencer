import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bf-account-onboarding-step6',
  standalone: true,
  template: `
    <div>
      <h3 class="text-xl font-bold text-gray-900">Review & finish</h3>
      <p class="mt-2 text-sm text-gray-700">Review your details. When you click Finish, we’ll save and complete your onboarding.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOnboardingStep6Component {}
