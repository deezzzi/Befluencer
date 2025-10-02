import { Component, ChangeDetectionStrategy } from '@angular/core';
/** Analytics placeholder page. */
@Component({
  selector: 'bf-analytics-page',
  standalone: true,
  template: `<h2 class="text-xl font-semibold mb-2">Analytics</h2><p class="text-sm text-slate-600">Placeholder page.</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsComponent {}
