import { Component, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'bf-community-page',
  standalone: true,
  template: `<h2 class="text-xl font-semibold mb-2">Community</h2><p class="text-sm text-slate-600">Placeholder page.</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityComponent {}
