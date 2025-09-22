import { Component, ChangeDetectionStrategy, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { OnboardingOverlayComponent } from '../../shared/onboarding/onboarding-overlay.component';
import { OnboardingService } from '../../shared/onboarding/onboarding.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AccountOnboardingOverlayComponent } from '../../shared/account-onboarding/account-onboarding-overlay.component';
import { AccountOnboardingService } from '../../shared/account-onboarding/account-onboarding.service';

interface StatCard { title: string; value: string; diff?: number; }

@Component({
  selector: 'bf-dashboard-page',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, OnboardingOverlayComponent, AccountOnboardingOverlayComponent],
  template: `
  <div class="space-y-4 md:space-y-6">
    <section>
      <!-- <h2 class="text-xl font-semibold mb-4">Key Metrics</h2> -->
  <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
        <div *ngFor="let c of cards" class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 shadow-card border border-slate-100 dark:border-gray-700 flex flex-col gap-1">
          <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">{{ c.title }}</div>
          <div class="text-xl md:text-2xl font-semibold">{{ c.value }}</div>
          <div *ngIf="c.diff !== undefined" class="text-xs" [ngClass]="c.diff! >= 0 ? 'text-emerald-600' : 'text-rose-600'">
            {{ c.diff! >= 0 ? '+' : ''}}{{ c.diff }}%
          </div>
        </div>
      </div>
    </section>
    <!-- Row 2: Three columns: Line chart | Channels | Audience -->
  <section class="grid gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-3">
  <div class="rounded-xl border border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 md:p-6 shadow-card min-h-[200px] md:min-h-[240px]">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">Traffic overview</h3>
          <div class="text-xs text-slate-500">This year vs Last year</div>
        </div>
        <div class="h-[160px] md:h-[200px] bg-gradient-to-b from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border border-slate-100 dark:border-gray-700 grid place-items-center">
          <span class="text-xs text-slate-400">Line chart placeholder</span>
        </div>
      </div>
  <div class="rounded-xl border border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 md:p-6 shadow-card">
        <h4 class="font-medium mb-4">Channels</h4>
        <ul class="space-y-2 text-sm">
          <li class="flex items-center gap-3"><span class="inline-block h-2 w-6 rounded bg-rose-500"></span> TikTok</li>
          <li class="flex items-center gap-3"><span class="inline-block h-2 w-6 rounded bg-orange-500"></span> YouTube</li>
          <li class="flex items-center gap-3"><span class="inline-block h-2 w-6 rounded bg-amber-500"></span> Instagram</li>
          <li class="flex items-center gap-3"><span class="inline-block h-2 w-6 rounded bg-violet-500"></span> Snapchat</li>
          <li class="flex items-center gap-3"><span class="inline-block h-2 w-6 rounded bg-emerald-500"></span> Facebook</li>
        </ul>
      </div>
  <div class="rounded-xl border border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 md:p-6 shadow-card">
        <h4 class="font-medium mb-4">Audience by country</h4>
        <div class="flex items-center gap-6">
          <div class="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[conic-gradient(var(--tw-gradient-stops))] from-rose-500 via-orange-400 via-amber-400 via-emerald-500 to-violet-500"></div>
          <ul class="text-sm space-y-2">
            <li class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-rose-500"></span> United States <span class="ml-2 text-slate-500">52%</span></li>
            <li class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-orange-500"></span> Canada <span class="ml-2 text-slate-500">22%</span></li>
            <li class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-amber-500"></span> Mexico <span class="ml-2 text-slate-500">15%</span></li>
            <li class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-violet-500"></span> Other <span class="ml-2 text-slate-500">11%</span></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Row 3: Bar chart (2 cols) + Right column activity list -->
  <section class="grid gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-3">
  <div class="lg:col-span-2 rounded-xl border border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 md:p-6 shadow-card min-h-[200px] md:min-h-[260px]">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">Weekly performance</h3>
          <div class="text-xs text-slate-500">Lorem 1 vs Lorem 2</div>
        </div>
        <div class="h-[160px] md:h-[200px] bg-gradient-to-b from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border border-slate-100 dark:border-gray-700 grid place-items-center">
          <span class="text-xs text-slate-400">Bar chart placeholder</span>
        </div>
      </div>
  <div class="rounded-xl border border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 md:p-6 shadow-card min-h-[200px] md:min-h-[260px]">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-medium">Recent activity</h4>
          <span class="text-xs text-slate-500">23 – 30 March 2020</span>
        </div>
        <ul class="text-sm divide-y divide-slate-100 dark:divide-gray-800">
          <li class="py-2.5 flex items-center justify-between">
            <div>
              <div class="font-medium">TikTok</div>
              <div class="text-xs text-slate-500">27 March 2020, at 12:30 PM</div>
            </div>
            <span class="text-emerald-600">+GH¢ 50</span>
          </li>
          <li class="py-2.5 flex items-center justify-between">
            <div>
              <div class="font-medium">Facebook</div>
              <div class="text-xs text-slate-500">27 March 2020, at 12:30 PM</div>
            </div>
            <span class="text-emerald-600">+GH¢ 100</span>
          </li>
          <li class="py-2.5 flex items-center justify-between">
            <div>
              <div class="font-medium">YouTube</div>
              <div class="text-xs text-slate-500">27 March 2020, at 12:30 PM</div>
            </div>
            <span class="text-emerald-600">+GH¢ 100</span>
          </li>
          <li class="py-2.5 flex items-center justify-between">
            <div>
              <div class="font-medium">Snapchat</div>
              <div class="text-xs text-slate-500">27 March 2020, at 12:30 PM</div>
            </div>
            <span class="text-emerald-600">+GH¢ 100</span>
          </li>
          <li class="py-2.5 flex items-center justify-between">
            <div>
              <div class="font-medium">Twitter</div>
              <div class="text-xs text-slate-500">27 March 2020, at 12:30 PM</div>
            </div>
            <span class="text-emerald-600">+GH¢ 100</span>
          </li>
        </ul>
      </div>
    </section>
    <!-- In-app Tour overlay host -->
    <bf-onboarding-overlay />
    <!-- Account Onboarding overlay host (post-login, modal 6 steps) -->
    <bf-account-onboarding-overlay />
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private onboarding = inject(OnboardingService);
  private storage = inject(LocalStorageService);
  private accountOnboarding = inject(AccountOnboardingService);
  cards: StatCard[] = [
    { title: 'Users', value: '12.4K', diff: 4.2 },
    { title: 'Revenue', value: '$86K', diff: 1.1 },
    { title: 'Engagement', value: '58%', diff: -2.3 },
    { title: 'Conversion', value: '4.9%', diff: 0.6 },
  ];

  // When onboarding closes as completed, we schedule the Tour.
  private onboardingSub?: { unsubscribe(): void };

  ngAfterViewInit(): void {
    // 1) Account Onboarding (modal, 6 steps) — show immediately after login if not completed
    if (!this.accountOnboarding.isCompleted()) {
      // Small delay to allow view to settle
      setTimeout(() => this.accountOnboarding.open(1), 300);

      // When onboarding closes as completed, trigger the Tour after ~5s (once).
      // We detect the first open->close transition and then check completion.
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

  ngOnDestroy(): void {
    this.onboardingSub?.unsubscribe?.();
  }
}
