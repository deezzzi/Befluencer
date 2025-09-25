import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private translate = inject(TranslateService);
  private storageKey = 'app:lang';
  readonly supported = ['en', 'fr', 'es', 'de', 'zh'];

  get current(): string { return this.translate.currentLang || this.translate.defaultLang || 'en'; }

  use(lang: string) {
    if (!this.supported.includes(lang)) lang = 'en';
    this.translate.use(lang);
    localStorage.setItem(this.storageKey, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = this.isRtl(lang) ? 'rtl' : 'ltr';
  }

  isRtl(lang: string) { return ['ar', 'he', 'fa', 'ur'].includes(lang); }
}
