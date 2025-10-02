// Global application providers configuration.
// - Zone coalescing reduces change detection noise.
// - Router is provided with the routes defined in app.routes.
import { ApplicationConfig, APP_INITIALIZER, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { routes } from './app.routes';

/** Custom TranslateLoader fetching locale files from /assets/i18n/{lang}.json */
class AppTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}
  getTranslation(lang: string) {
    return this.http.get(`/assets/i18n/${lang}.json`);
  }
}

/** Initialize i18n before app bootstraps so first paint is localized. */
function initTranslateFactory() {
  return () => {
    const translate = inject(TranslateService);
    const saved = localStorage.getItem('app:lang') || 'en';
    translate.addLangs(['en', 'fr', 'es', 'de', 'zh']);
    translate.setDefaultLang('en');
    translate.use(saved);
    document.documentElement.lang = saved;
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: AppTranslateLoader,
        deps: [HttpClient]
      }
    }).providers!,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initTranslateFactory
    }
  ]
};
