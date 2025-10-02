import { Component, ChangeDetectionStrategy } from '@angular/core';
/** Campaigns placeholder page. */
@Component({
  selector: 'bf-campaigns-page',
  standalone: true,
  template: `<h2 class="text-xl font-semibold mb-2">Campaigns</h2><p class="text-sm text-slate-600">Placeholder page.</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignsComponent {}
