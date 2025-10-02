import { Component, ChangeDetectionStrategy } from '@angular/core';
/** Settings placeholder page. */

@Component({
  selector: 'bf-settings-page',
  standalone: true,
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-semibold tracking-tight">Settings</h2>
      <p class="text-sm text-slate-600 dark:text-gray-300">Settings module placeholder.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {}
