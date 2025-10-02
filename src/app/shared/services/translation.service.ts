import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * TranslationService
 * ------------------
 * Thin convenience layer over ngx-translate to:
 * - Persist the active language to localStorage
 * - Update the <html> lang and dir attributes for better a11y and RTL support
 * - Expose supported language list in one place
 */
@Injectable({ providedIn: 'root' })
export class TranslationService {
  private translate = inject(TranslateService);
  private storageKey = 'app:lang';
  /** ISO codes supported by the app. Keep in sync with app.config.ts */
  readonly supported = ['en', 'fr', 'es', 'de', 'zh'];

  /** Active language or fallback to default/en. */
  get current(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'en';
  }

  /**
   * Switch active language at runtime and persist preference.
   * @param lang ISO code (e.g. 'en')
   */
  use(lang: string) {
    if (!this.supported.includes(lang)) lang = 'en';
    this.translate.use(lang);
    localStorage.setItem(this.storageKey, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = this.isRtl(lang) ? 'rtl' : 'ltr';
  }

  /** Whether the language should be rendered Right-To-Left. */
  isRtl(lang: string) { return ['ar', 'he', 'fa', 'ur'].includes(lang); }
}
