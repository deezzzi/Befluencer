import { Component, ChangeDetectionStrategy } from '@angular/core';
/** Support placeholder page. */
@Component({
  selector: 'bf-support-page',
  standalone: true,
  template: `<h2 class="text-xl font-semibold mb-2">Support</h2><p class="text-sm text-slate-600">Placeholder page.</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportComponent {}
