import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface NavItem { icon: string; label: string; route: string; hasChildren?: boolean; }

/**
 * SidebarComponent
 * ----------------
 * Collapsible primary navigation for dashboard routes.
 * - Input `collapsed` drives width styles and label visibility
 * - Emits `toggle` so parent can control layout state
 * - Inlines SVG icons for consistency and low runtime overhead
 */
@Component({
  selector: 'bf-sidebar',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, RouterLink, RouterLinkActive, TranslateModule],
  styleUrls: ['./sidebar.component.scss'],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();
  nav = [
    { icon: 'dashboard', tkey: 'nav.dashboard', route: '/dashboard' },
    { icon: 'campaigns', tkey: 'nav.campaigns', route: '/campaigns' },
    { icon: 'media', tkey: 'nav.media', route: '/media-kit' },
    { icon: 'analytics', tkey: 'nav.analytics', route: '/analytics' },
    { icon: 'wallet', tkey: 'nav.wallet', route: '/wallet' },
    { icon: 'collab', tkey: 'nav.collab', route: '/collab-tools' },
    { icon: 'tasks', tkey: 'nav.tasks', route: '/tasks' },
    { icon: 'community', tkey: 'nav.community', route: '/community' },
    { icon: 'settings', tkey: 'nav.settings', route: '/settings', hasChildren: true },
    { icon: 'support', tkey: 'nav.support', route: '/support', hasChildren: true },
  ];

  onLogout(e: Event) { e.preventDefault(); /* TODO: hook auth */ }

}
