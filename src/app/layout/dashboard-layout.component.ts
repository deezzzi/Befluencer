import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { TopbarComponent } from '../shared/topbar/topbar.component';

/**
 * DashboardLayoutComponent
 *
 * Shell layout for authenticated areas.
 * - Hosts the persistent Sidebar and Topbar and a scrollable <router-outlet/> content area.
 * - Tracks sidebar collapsed state via Angular signals; Topbar mirrors the state for its toggle button.
 */
@Component({
  selector: 'bf-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
  <div class="flex h-dvh sm:h-screen w-full overflow-hidden bg-white dark:bg-gray-900">
      <bf-sidebar [collapsed]="collapsed()" (toggle)="toggleSidebar()" />
      <div class="flex flex-col flex-1 min-w-0">
        <bf-topbar [collapsed]="collapsed()" (toggle)="toggleSidebar()" />
        <main class="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 scrollbar-thin bg-slate-50 dark:bg-gray-800">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayoutComponent {
  private _collapsed = signal(false);
  collapsed = computed(() => this._collapsed());
  toggleSidebar() { this._collapsed.update(v => !v); }
}
