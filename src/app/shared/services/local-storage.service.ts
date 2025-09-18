import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private prefix = 'befluencer:';

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

  getJSON<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    try { localStorage.removeItem(this.prefix + key); } catch { /* noop */ }
  }
}
