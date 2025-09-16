import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';

interface StatCard { title: string; value: string; diff?: number; }

@Component({
  selector: 'bf-dashboard-page',
  standalone: true,
  imports: [NgFor, NgClass],
  template: `
  <div class="space-y-8">
    <section>
      <h2 class="text-xl font-semibold mb-4">Key Metrics</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div *ngFor="let c of cards" class="rounded-xl p-4 bg-white dark:bg-gray-900 shadow-card border border-slate-100 dark:border-gray-700 flex flex-col gap-1">
          <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">{{ c.title }}</div>
          <div class="text-2xl font-semibold">{{ c.value }}</div>
          <div *ngIf="c.diff !== undefined" class="text-xs" [ngClass]="c.diff! >= 0 ? 'text-emerald-600' : 'text-rose-600'">
            {{ c.diff! >= 0 ? '+' : ''}}{{ c.diff }}%
          </div>
        </div>
      </div>
    </section>
    <section class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 rounded-xl border border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-card min-h-[320px]">Main chart area (placeholder)</div>
      <div class="rounded-xl border border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-card min-h-[320px]">Side panel (placeholder)</div>
    </section>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  cards: StatCard[] = [
    { title: 'Users', value: '12.4K', diff: 4.2 },
    { title: 'Revenue', value: '$86K', diff: 1.1 },
    { title: 'Engagement', value: '58%', diff: -2.3 },
    { title: 'Conversion', value: '4.9%', diff: 0.6 },
  ];
}
