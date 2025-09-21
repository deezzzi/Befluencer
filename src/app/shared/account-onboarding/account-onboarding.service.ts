import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

/**
 * AccountOnboardingService
 *
 * Manages the post-login onboarding modal flow. This is distinct from the in-app
 * Product Tour. This flow is purely modal (no anchored tooltips) and has six steps.
 *
 * Steps contract (default, can be customized):
 * 1) Welcome (screenshot-aligned)
 * 2) Profile basics
 * 3) Connect socials
 * 4) Audience & categories
 * 5) Preferences & goals
 * 6) Review & finish (sets completed flag)
 */
@Injectable({ providedIn: 'root' })
export class AccountOnboardingService {
  private readonly totalSteps = 6;
  private readonly storage = inject(LocalStorageService);
  private readonly storageKey = 'account-onboarding.v1';

  private _open$ = new BehaviorSubject<boolean>(false);
  open$ = this._open$.asObservable();

  private _step$ = new BehaviorSubject<number>(1);
  step$ = this._step$.asObservable();

  // Content types selection state (Step 2)
  private _contentTypes$ = new BehaviorSubject<Set<string>>(new Set());
  contentTypes$ = this._contentTypes$.asObservable();
  private _platforms$ = new BehaviorSubject<Set<string>>(new Set());
  platforms$ = this._platforms$.asObservable();
  private _experience$ = new BehaviorSubject<string | null>(null);
  experience$ = this._experience$.asObservable();
  // Hear about us (Step 5)
  private _referrers$ = new BehaviorSubject<Set<string>>(new Set());
  referrers$ = this._referrers$.asObservable();
  // Goals (Step 6)
  private _goals$ = new BehaviorSubject<Set<string>>(new Set());
  goals$ = this._goals$.asObservable();

  constructor() {
    const saved = this.storage.getJSON<string[]>('account-onboarding:content-types');
    if (Array.isArray(saved)) this._contentTypes$.next(new Set(saved));
    const savedPlatforms = this.storage.getJSON<string[]>('account-onboarding:platforms');
    if (Array.isArray(savedPlatforms)) this._platforms$.next(new Set(savedPlatforms));
    const exp = this.storage.getJSON<string>('account-onboarding:experience');
    if (typeof exp === 'string') this._experience$.next(exp);
    const savedReferrers = this.storage.getJSON<string[]>('account-onboarding:referrers');
    if (Array.isArray(savedReferrers)) this._referrers$.next(new Set(savedReferrers));
    const savedGoals = this.storage.getJSON<string[]>('account-onboarding:goals');
    if (Array.isArray(savedGoals)) this._goals$.next(new Set(savedGoals));
  }

  toggleContentType(key: string): void {
    const next = new Set(this._contentTypes$.value);
    if (next.has(key)) next.delete(key); else next.add(key);
    this._contentTypes$.next(next);
    // persist partial progress
    this.storage.setJSON('account-onboarding:content-types', Array.from(next));
  }

  isAnyContentTypeSelected(): boolean {
    return this._contentTypes$.value.size > 0;
  }

  hasContentType(key: string): boolean {
    return this._contentTypes$.value.has(key);
  }

  // Platforms selection (Step 3)
  togglePlatform(key: string): void {
    const next = new Set(this._platforms$.value);
    if (next.has(key)) next.delete(key); else next.add(key);
    this._platforms$.next(next);
    this.storage.setJSON('account-onboarding:platforms', Array.from(next));
  }

  hasPlatform(key: string): boolean {
    return this._platforms$.value.has(key);
  }

  isAnyPlatformSelected(): boolean {
    return this._platforms$.value.size > 0;
  }

  // Experience (Step 4)
  setExperience(key: string): void {
    this._experience$.next(key);
    this.storage.setJSON('account-onboarding:experience', key);
  }

  getExperience(): string | null { return this._experience$.value; }

  // Referrers (Step 5)
  toggleReferrer(key: string): void {
    const next = new Set(this._referrers$.value);
    if (next.has(key)) next.delete(key); else next.add(key);
    this._referrers$.next(next);
    this.storage.setJSON('account-onboarding:referrers', Array.from(next));
  }

  hasReferrer(key: string): boolean {
    return this._referrers$.value.has(key);
  }

  isAnyReferrerSelected(): boolean {
    return this._referrers$.value.size > 0;
  }

  // Goals
  toggleGoal(key: string): void {
    const next = new Set(this._goals$.value);
    if (next.has(key)) next.delete(key); else next.add(key);
    this._goals$.next(next);
    this.storage.setJSON('account-onboarding:goals', Array.from(next));
  }

  hasGoal(key: string): boolean { return this._goals$.value.has(key); }
  isAnyGoalSelected(): boolean { return this._goals$.value.size > 0; }

  /** Returns true if onboarding has been completed previously. */
  isCompleted(): boolean {
    const val = this.storage.getJSON<{ done: boolean; at?: string }>(this.storageKey);
    return !!(val && val.done);
  }

  /** Mark onboarding as completed. */
  markCompleted(): void {
    this.storage.setJSON(this.storageKey, { done: true, at: new Date().toISOString() });
  }

  /** Open the onboarding flow at a specific step (default 1). */
  open(step = 1): void {
    this._step$.next(step);
    this._open$.next(true);
  }

  /** Close the onboarding modal without altering completion state. */
  close(): void {
    this._open$.next(false);
  }

  /** Advance to next step, or finish on the last step. */
  next(): void {
    const s = this._step$.value;
    if (s < this.totalSteps) this._step$.next(s + 1);
    else {
      this.markCompleted();
      this.close();
    }
  }

  /** Go back one step if possible. */
  back(): void {
    const s = this._step$.value;
    if (s > 1) this._step$.next(s - 1);
  }
}
