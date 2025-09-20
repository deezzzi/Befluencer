import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Application bootstrap entry point.
 *
 * - Uses Angular's bootstrapApplication to start the app with the root AppComponent.
 * - appConfig contains global providers (routing, HttpClient, interceptors, etc.).
 * - Any bootstrap failure is logged to the console; consider wiring remote logging here.
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    // Bootstrap issues typically indicate a missing provider, bad import, or template parse error.
    // Keep this log terse in production and route details to your telemetry pipeline if available.
    console.error('App bootstrap failed:', err);
  });
