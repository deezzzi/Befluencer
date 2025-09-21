import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { AccountOnboardingService } from './account-onboarding.service';
import { LocalStorageService } from '../services/local-storage.service';
import { AccountOnboardingStep1Component } from './steps/account-onboarding-step1.component';
import { AccountOnboardingStep2Component } from './steps/account-onboarding-step2.component';
import { AccountOnboardingStep3Component } from './steps/account-onboarding-step3.component';
import { AccountOnboardingStep4ExperienceComponent } from './steps/account-onboarding-step4-experience.component';
import { AccountOnboardingStep5HearAboutComponent } from './steps/account-onboarding-step5-hearabout.component';
import { AccountOnboardingStep6GoalsComponent } from './steps/account-onboarding-step6-goals.component';

/**
 * Account Onboarding Overlay Host (pure modal, 6 steps)
 * - Renders centered modal cards for all steps, with a blurred/dimmed backdrop.
 * - Uses action bar with Back, Skip For Later, and Next/Finish.
 */
@Component({
  selector: 'bf-account-onboarding-overlay',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, NgSwitch, NgSwitchCase,
    AccountOnboardingStep1Component,
    AccountOnboardingStep2Component,
    AccountOnboardingStep3Component,
    AccountOnboardingStep4ExperienceComponent,
    AccountOnboardingStep5HearAboutComponent,
    AccountOnboardingStep6GoalsComponent
  ],
  template: `
  <div *ngIf="(svc.open$ | async)" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

    <div class="absolute inset-0 grid place-items-center p-4">
      <div role="dialog" aria-modal="true" class="w-full max-w-xl rounded-2xl bg-white text-gray-900 shadow-2xl ring-1 ring-black/5">
        <div class="p-6 sm:p-7">
          <ng-container *ngIf="(svc.step$ | async) as step">
            <ng-container [ngSwitch]="step">
              <bf-account-onboarding-step1 *ngSwitchCase="1" [displayName]="displayName"></bf-account-onboarding-step1>
              <bf-account-onboarding-step2 *ngSwitchCase="2"></bf-account-onboarding-step2>
              <bf-account-onboarding-step3 *ngSwitchCase="3"></bf-account-onboarding-step3>
              <bf-account-onboarding-step4-experience *ngSwitchCase="4"></bf-account-onboarding-step4-experience>
              <bf-account-onboarding-step5-hearabout *ngSwitchCase="5"></bf-account-onboarding-step5-hearabout>
              <bf-account-onboarding-step6-goals *ngSwitchCase="6"></bf-account-onboarding-step6-goals>
            </ng-container>

            <!-- Actions & progress (hidden on step 1, as CTA is inside the content) -->
            <div class="mt-8 grid grid-cols-3 items-center" *ngIf="step !== 1">
              <div class="justify-self-start">
                <button type="button" class="text-orange-600 hover:text-orange-700 inline-flex items-center gap-1" (click)="svc.back()">
                  <span aria-hidden>←</span>
                  <span>Back</span>
                </button>
              </div>
              <div class="justify-self-center flex items-center gap-2" aria-hidden="true">
                <ng-container *ngFor="let i of indicators">
                  <div class="h-1.5 w-8 rounded-full" [class.bg-orange-500]="i === step" [class.bg-gray-300]="i !== step"></div>
                </ng-container>
              </div>
              <div class="justify-self-end">
                <button type="button" class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm" (click)="svc.next()">
                  {{ step === 6 ? 'Finish' : 'Continue' }} <span aria-hidden>→</span>
                </button>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOnboardingOverlayComponent {
  svc = inject(AccountOnboardingService);
  indicators = [1,2,3,4,5,6];
  private storage = inject(LocalStorageService);
  displayName = this.resolveDisplayName();

  private resolveDisplayName(): string {
    // Try common locations; fall back to a friendly placeholder
    const name = this.storage.getJSON<string>('profile:displayName');
    if (typeof name === 'string' && name.trim()) return name.trim();
    const auth = this.storage.getJSON<any>('auth:user');
    if (auth && typeof auth === 'object') {
      const n = auth.displayName || auth.name || auth.username;
      if (typeof n === 'string' && n.trim()) return n.trim();
    }
    return 'John Doe';
  }
}
