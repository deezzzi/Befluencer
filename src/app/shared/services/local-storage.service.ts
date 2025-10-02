import { Injectable } from '@angular/core';

/**
 * LocalStorageService
 * -------------------
 * Small, safe wrapper around window.localStorage with:
 * - App-level namespacing to avoid key collisions (prefix: `befluencer:`)
 * - JSON helpers for ergonomic set/get of structured data
 * - Defensive error handling (quota, serialization) to avoid breaking UX
 *
 * Tip: If you care about failures in production, add telemetry in the catch blocks.
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private prefix = 'befluencer:';

  /**
   * Persist a JSON-serializable value under a namespaced key.
   *
   * @param key Logical key without prefix (e.g. `auth:user`)
   * @param value Any JSON-serializable value
   */
  setJSON<T>(key: string, value: T): void {
    try {
      const payload = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, payload);
    } catch {
      // Swallow errors (storage quota, serialization) to avoid breaking UX
      // e.g. Safari private mode or exceeded quota
    }
  }

  /**
   * Retrieve a JSON value by key.
   *
   * @param key Logical key without prefix
   * @returns Parsed value or null if missing/invalid/unparsable
   */
  getJSON<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  /**
   * Remove a namespaced key.
   *
   * @param key Logical key without prefix
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch {
      // noop
    }
  }
}
