import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingStep1Component } from './steps/onboarding-step1.component';
import { OnboardingStep2Component } from './steps/onboarding-step2.component';
import { OnboardingStep3Component } from './steps/onboarding-step3.component';
import { OnboardingStep4Component } from './steps/onboarding-step4.component';

/**
 * Product Tour Overlay Host (renders standalone step components)
 *
 * Behavior
 * - Uses "Tour" terminology throughout the UI
 * - Step 1: centered modal with blurred, dimmed backdrop
 * - Steps 2–4: anchored tooltips, no backdrop blur (do not obstruct the UI)
 * - Final step (4) CTA is "Close" which calls svc.close()
 *
 * Anchors (stable IDs expected to exist in the layout)
 * - bf-bell-anchor (Notifications)
 * - bf-profile-anchor (Profile)
 * - bf-collab-anchor (Collab tools / side panel)
 */
@Component({
  selector: 'bf-onboarding-overlay',
  standalone: true,
  imports: [NgIf, AsyncPipe, OnboardingStep1Component, OnboardingStep2Component, OnboardingStep3Component, OnboardingStep4Component],
  template: `
  <div *ngIf="(svc.open$ | async)" class="fixed inset-0 z-50">
    <!-- Backdrop only for Step 1 -->
    <ng-container *ngIf="(svc.step$ | async) as step">
      <div *ngIf="step === 1" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
    </ng-container>

    <!-- Content host -->
    <ng-container *ngIf="(svc.step$ | async) as step">
      <!-- Step 2: anchored tooltip near bell -->
      <div *ngIf="step === 2" class="absolute inset-0 pointer-events-none">
        <bf-onboarding-step2></bf-onboarding-step2>
      </div>

      <!-- Step 3: anchored tooltip near profile -->
      <div *ngIf="step === 3" class="absolute inset-0 pointer-events-none">
        <bf-onboarding-step3></bf-onboarding-step3>
      </div>

      <!-- Step 4: anchored tooltip near Collab Tools in sidebar -->
      <div *ngIf="step === 4" class="absolute inset-0 pointer-events-none">
        <bf-onboarding-step4></bf-onboarding-step4>
      </div>

      <!-- Step 1 modal card -->
      <div *ngIf="step === 1" class="absolute inset-0 grid place-items-center p-4">
        <div role="dialog" aria-modal="true" class="w-full max-w-xl rounded-2xl bg-white text-gray-900 shadow-2xl ring-1 ring-black/5">
          <div class="p-6 sm:p-8">
            <bf-onboarding-step1></bf-onboarding-step1>

            <!-- Actions -->
            <div class="mt-6 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <button type="button" class="text-orange-600 font-semibold hover:underline" (click)="svc.close()">Skip For Later</button>
                <button type="button" class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm" (click)="svc.next()">Let's Go <span aria-hidden>→</span></button>
              </div>
              <div class="flex items-center gap-2">
                <!-- step indicators placeholder -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardingOverlayComponent {
  svc = inject(OnboardingService);
}
