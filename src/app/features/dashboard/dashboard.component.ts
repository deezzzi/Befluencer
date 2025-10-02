import { Component, ChangeDetectionStrategy, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { OnboardingOverlayComponent } from '../../shared/onboarding/onboarding-overlay.component';
import { OnboardingService } from '../../shared/onboarding/onboarding.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AccountOnboardingOverlayComponent } from '../../shared/account-onboarding/account-onboarding-overlay.component';
import { AccountOnboardingService } from '../../shared/account-onboarding/account-onboarding.service';

/** Minimal stat card model used for the KPI tiles. */
interface StatCard { tkey: string; value: string; diff?: number; }

@Component({
  selector: 'bf-dashboard-page',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, OnboardingOverlayComponent, AccountOnboardingOverlayComponent, TranslateModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private onboarding = inject(OnboardingService);
  private storage = inject(LocalStorageService);
  private accountOnboarding = inject(AccountOnboardingService);
  cards: StatCard[] = [
    { tkey: 'dashboard.cards.users', value: '12.4K', diff: 4.2 },
    { tkey: 'dashboard.cards.revenue', value: '$86K', diff: 1.1 },
    { tkey: 'dashboard.cards.engagement', value: '58%', diff: -2.3 },
    { tkey: 'dashboard.cards.conversion', value: '4.9%', diff: 0.6 },
  ];

  // When onboarding closes as completed, we schedule the Tour.
  private onboardingSub?: { unsubscribe(): void };

  ngAfterViewInit(): void {
    // 1) Account Onboarding (modal, 6 steps) — show immediately after login if not completed
    if (!this.accountOnboarding.isCompleted()) {
      // Small delay to allow view to settle
      setTimeout(() => this.accountOnboarding.open(1), 300);

      // When onboarding closes as completed, trigger the Tour after ~5s (once).
      // Detect first open->close transition and then check completion.
      let seenOpen = false;
      this.onboardingSub = this.accountOnboarding.open$.subscribe(open => {
        if (open) {
          seenOpen = true;
        } else if (seenOpen && this.accountOnboarding.isCompleted()) {
          const tourSeen = this.storage.getJSON<boolean>('tour:dashboard:seen');
          if (!tourSeen) {
            setTimeout(() => this.onboarding.open(1), 5000);
            this.storage.setJSON('tour:dashboard:seen', true);
          }
        }
      });
      return; // Defer Tour until the account onboarding is completed
    }

    // 2) Product Tour — open once after 5s on first dashboard visit
    const tourSeen = this.storage.getJSON<boolean>('tour:dashboard:seen');
    if (!tourSeen) {
      setTimeout(() => this.onboarding.open(1), 5000);
      this.storage.setJSON('tour:dashboard:seen', true);
    }
  }

  // Avoid memory leaks
  ngOnDestroy(): void {
    this.onboardingSub?.unsubscribe?.();
  }
}
