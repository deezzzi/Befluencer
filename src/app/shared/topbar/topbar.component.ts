import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LocalStorageService } from '../services/local-storage.service';

/**
 * TopbarComponent
 * ---------------
 * Lightweight app bar for authenticated views.
 * - Title is pulled from the deepest ActivatedRoute data.title.
 * - Theme toggle and back button helpers are included for future use.
 * - The "collapsed" input mirrors sidebar state so the UI can stay in sync.
 */
@Component({
  selector: 'bf-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private storage = inject(LocalStorageService);

  private _title = signal('Dashboard');
  currentTitle = computed(() => this._title());

  private _dark = signal(false);
  dark = computed(() => this._dark());

  private _displayName = signal(this.resolveDisplayName());
  displayName = computed(() => this._displayName());
  initials = computed(() => this.makeInitials(this._displayName()));

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

  /** Toggle dark mode by toggling root .dark class. */
  toggleTheme() {
    this._dark.update(v => !v);
    const root = document.documentElement;
    if (this._dark()) root.classList.add('dark'); else root.classList.remove('dark');
  }

  /** Navigate back if possible; fallback to dashboard. */
  goBack() {
    // Simple history back fallback to dashboard
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigateByUrl('/dashboard');
    }
  }

  private resolveDisplayName(): string {
    const name = this.storage.getJSON<string>('profile:displayName');
    if (typeof name === 'string' && name.trim()) return name.trim();
    const auth = this.storage.getJSON<any>('auth:user');
    if (auth && typeof auth === 'object') {
      const n = auth.displayName || `${auth.firstName ?? ''} ${auth.lastName ?? ''}`;
      if (typeof n === 'string' && n.trim()) return n.trim();
    }
    return 'John Doe';
  }

  /** Derive up to two-letter initials from a display name. */
  private makeInitials(name: string): string {
    const parts = (name || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
}
