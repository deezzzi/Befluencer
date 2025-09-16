import { Component, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'bf-tasks-page',
  standalone: true,
  template: `<h2 class="text-xl font-semibold mb-2">Tasks</h2><p class="text-sm text-slate-600">Placeholder page.</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent {}
