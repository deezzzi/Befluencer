import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { AccountOnboardingService } from '../account-onboarding.service';

/**
 * Step 1 — Welcome
 * Matches the provided mock: bold orange "Welcome", user name highlight, supportive copy, CTA.
 * The CTA button is provided by the overlay's action bar.
 */
@Component({
  selector: 'bf-account-onboarding-step1',
  standalone: true,
  template: `
    <div>
      <h2 class="text-[22px] sm:text-2xl font-extrabold tracking-tight">
        <span class="text-orange-600">Welcome</span>
        <span class="text-gray-900"> {{ displayName }} !</span>
      </h2>
      <p class="mt-2 text-sm sm:text-base font-semibold text-gray-900">Let’s Get Your Creator Profile Up And running! <span aria-hidden>😊</span></p>

      <div class="mt-4 space-y-[15px] text-[13px] sm:text-sm leading-6 text-gray-700">
        <p>Brands are out there looking for voices like yours. With just a few quick steps, you’ll be set to showcase your influence, unlock campaign opportunities, and start earning from your content.</p>
        <p>Let’s build something great together</p>
      </div>

      <div class="mt-[40px]">
        <button type="button"
                class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-full text-sm font-semibold shadow"
                (click)="svc.next()">
          Get Started <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOnboardingStep1Component {
  @Input() displayName = 'John Doe';
  svc = inject(AccountOnboardingService);
}
