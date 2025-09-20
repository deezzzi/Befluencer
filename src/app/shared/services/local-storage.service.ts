import { Injectable } from '@angular/core';

/**
 * Thin wrapper around browser localStorage with namespacing and JSON helpers.
 *
 * Notes
 * - Errors (quota, serialization) are intentionally swallowed to avoid UX breaks.
 * - Consider adding telemetry to track failure rates in production.
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private prefix = 'befluencer:';

  /** Persist a JSON-serializable value under a namespaced key. */
  setJSON<T>(key: string, value: T): void {
    try {
      const payload = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, payload);
    } catch (e) {
      // Swallow errors (storage quota, serialization) to avoid breaking UX
      // Consider adding telemetry here
      // console.warn('LocalStorage setJSON failed', e);
    }
  }

  /** Retrieve a JSON value (null on any error or missing). */
  getJSON<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  /** Remove a namespaced key. */
  remove(key: string): void {
    try { localStorage.removeItem(this.prefix + key); } catch { /* noop */ }
  }
}
