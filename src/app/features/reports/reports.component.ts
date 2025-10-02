import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
/** Reports placeholder page. */
  selector: 'bf-reports-page',
  standalone: true,
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-semibold tracking-tight">Reports</h2>
      <p class="text-sm text-slate-600 dark:text-gray-300">Reports module placeholder.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent {}
