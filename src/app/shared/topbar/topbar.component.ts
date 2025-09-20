import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * TopbarComponent
 *
 * Minimal app bar for authenticated views.
 * - Displays current page title derived from the deepest activated route's data.title.
 * - Exposes a theme toggle and back navigation helper (kept hidden per design for now).
 * - Mirrors sidebar collapsed state only to show a consistent toggle affordance alongside user avatar.
 */
@Component({
  selector: 'bf-topbar',
  standalone: true,
  imports: [],
  template: `
    <header class="h-14 flex items-center justify-between px-6 bg-white border-b border-slate-200 select-none">
      <!-- Left: back + title (no logo per design) -->
      <div class="flex items-center gap-4 min-w-0">
        <!-- <button (click)="goBack()" class="h-8 w-8 inline-flex items-center justify-center rounded-full border border-slate-300 hover:bg-slate-100 transition" aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
        </button> -->
  <h1 class="text-[15px] font-semibold tracking-tight truncate">{{ currentTitle() }}</h1>
      </div>

      <!-- Right: bell + user info -->
      <div class="flex items-center gap-8">
        <button id="bf-bell-anchor" class="relative inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-slate-100 transition" aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-800" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/></svg>
          <span class="absolute -top-1 -right-1 h-4 min-w-[16px] rounded-full bg-orange-500 text-[10px] font-medium text-white flex items-center justify-center px-1">3</span>
        </button>
        <div id="bf-profile-anchor" class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-full border border-slate-400 flex items-center justify-center text-slate-700 text-sm">JD</div>
          <div class="flex flex-col leading-tight">
            <span class="text-[13px] font-medium text-slate-900">John Doe</span>
            <span class="text-[11px] text-slate-500">Creator</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private _title = signal('Dashboard');
  currentTitle = computed(() => this._title());

  userInitials = 'U';

  private _dark = signal(false);
  dark = computed(() => this._dark());

  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const title = this.findDeepest(this.route)?.snapshot.data?.['title'] || 'Dashboard';
      this._title.set(title);
    });
  }

  private findDeepest(ar: ActivatedRoute): ActivatedRoute | null {
    let cur: ActivatedRoute | null = ar;
    while (cur?.firstChild) cur = cur.firstChild;
    return cur;
  }

  toggleTheme() {
    this._dark.update(v => !v);
    const root = document.documentElement;
    if (this._dark()) root.classList.add('dark'); else root.classList.remove('dark');
  }

  goBack() {
    // Simple history back fallback to dashboard
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigateByUrl('/dashboard');
    }
  }
}
