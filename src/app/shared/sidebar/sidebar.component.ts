import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem { icon: string; label: string; route: string; hasChildren?: boolean; }

/**
 * SidebarComponent
 *
 * Collapsible primary navigation for dashboard routes.
 * - Receives `collapsed` state and emits `toggle` to parent layout.
 * - Renders a static nav map; active route highlighted via RouterLinkActive.
 * - Icons are inlined SVGs selected via ngSwitch for minimal runtime cost.
 */
@Component({
  selector: 'bf-sidebar',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, RouterLink, RouterLinkActive],
  styleUrls: ['./sidebar.component.scss'],
  template: `
  <aside
    class="sidebar group h-full flex flex-col bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 transition-[width] duration-300 ease-out"
    [ngClass]="collapsed ? 'sidebar--collapsed' : 'sidebar--expanded'"
    aria-label="Primary navigation"
  >
    <!-- Header -->
    <div class="flex items-center h-16 px-4 gap-3 shrink-0">
      <div class="logo-icon flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-brand-orange via-brand-pink to-brand-violet text-white font-semibold shadow">
        <span class="text-sm">B</span>
      </div>
      <span *ngIf="!collapsed" class="font-semibold tracking-tight text-[15px]">Befluencer</span>
      <button (click)="toggle.emit()" class="ml-auto inline-flex h-7 w-7 items-center justify-center rounded border border-slate-200 hover:bg-slate-100 text-slate-500" [attr.aria-label]="collapsed ? 'Expand sidebar' : 'Collapse sidebar'">
        <svg *ngIf="!collapsed" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
        <svg *ngIf="collapsed" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>
      </button>
    </div>

    <!-- Nav list -->
    <nav class="flex-1 overflow-y-auto px-3 pt-2 space-y-1">
      <ng-container *ngFor="let item of nav">
        <a
          [attr.id]="item.label === 'Collab Tools' ? 'bf-collab-anchor' : null"
          [routerLink]="item.route"
          routerLinkActive="nav-active"
          #rla="routerLinkActive"
          class="nav-link group flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition relative"
          [class.has-children]="item.hasChildren"
          [attr.aria-current]="rla.isActive ? 'page' : null"
        >
          <span class="icon-wrapper inline-flex h-5 w-5 items-center justify-center text-slate-500 group-hover:text-slate-700">
            <ng-container [ngSwitch]="item.icon">
              <svg *ngSwitchCase="'dashboard'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
              <svg *ngSwitchCase="'campaigns'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M3 11h18M3 7h18M3 15h18M7 11v8"/></svg>
              <svg *ngSwitchCase="'media'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3V9Z"/></svg>
              <svg *ngSwitchCase="'analytics'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 19V9"/><path d="M8 19V5"/><path d="M12 19v-8"/><path d="M16 19v-4"/><path d="M20 19V8"/></svg>
              <svg *ngSwitchCase="'wallet'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M16 12h.01"/></svg>
              <svg *ngSwitchCase="'collab'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M8 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/><path d="M16 6a4 4 0 1 1 0 8"/><path d="M12 12h4"/></svg>
              <svg *ngSwitchCase="'tasks'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 11l2 2 4-4"/><rect x="3" y="5" width="18" height="14" rx="2"/></svg>
              <svg *ngSwitchCase="'community'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M7 20a4 4 0 1 1 0-8"/><path d="M17 20a4 4 0 1 0 0-8"/><path d="M7 12V4"/><path d="M17 12V4"/></svg>
              <svg *ngSwitchCase="'settings'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c0 .68.4 1.3 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.68 0 1.3.4 1.51 1H21a2 2 0 0 1 0 4h-.09c-.68 0-1.3.4-1.51 1Z"/></svg>
              <svg *ngSwitchCase="'support'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M8 11h8"/></svg>
              <svg *ngSwitchCase="'logout'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
            </ng-container>
          </span>
          <span *ngIf="!collapsed" class="flex-1 truncate">{{ item.label }}</span>
          <svg *ngIf="!collapsed && item.hasChildren" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6" /></svg>
        </a>
      </ng-container>
    </nav>

    <!-- Logout -->
    <div class="px-3 pb-4 pt-2">
      <a class="nav-link flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium text-orange-500 hover:bg-orange-50 hover:text-orange-600 transition" href="#" (click)="onLogout($event)">
        <span class="icon-wrapper inline-flex h-5 w-5 items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
        </span>
        <span *ngIf="!collapsed">Logout</span>
      </a>
    </div>
  </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();
  nav: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'campaigns', label: 'Campaigns', route: '/campaigns' },
    { icon: 'media', label: 'Media Kit', route: '/media-kit' },
    { icon: 'analytics', label: 'Analytics', route: '/analytics' },
    { icon: 'wallet', label: 'Wallet', route: '/wallet' },
    { icon: 'collab', label: 'Collab Tools', route: '/collab-tools' },
    { icon: 'tasks', label: 'Tasks', route: '/tasks' },
    { icon: 'community', label: 'Community', route: '/community' },
    { icon: 'settings', label: 'Settings', route: '/settings', hasChildren: true },
    { icon: 'support', label: 'Support', route: '/support', hasChildren: true },
  ];

  onLogout(e: Event) { e.preventDefault(); /* TODO: hook auth */ }

}
