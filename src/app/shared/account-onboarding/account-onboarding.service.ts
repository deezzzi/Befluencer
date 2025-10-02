import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

/**
 * AccountOnboardingService
 * -------------------------------------------------------------
 * Source of truth for the post-login Account Onboarding flow.
 * This flow is distinct from the Product Tour (which is in-app
 * and uses anchored tooltips). Account Onboarding is a sequence
 * of centered modal cards with 6 steps and persistent state.
 *
 * Contract (can be customized by consumers):
 * 1) Welcome (pixel-aligned to the screenshot)
 * 2) Content types (multi-select chips)
 * 3) Platforms (multi-select chips)
 * 4) Experience length (single-select)
 * 5) Where did you hear about us? (multi-select with optional inputs)
 *    - If "Referral" selected: show referral code input
 *    - If "Other" selected: show freeform text input
 * 6) What will you use Befluencer for? (multi-select chips)
 *    - Final step "Finish" marks the flow completed
 *
 * Persistence
 * - We use LocalStorage via LocalStorageService to keep progress
 *   and inputs across reloads. See keys used below.
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
  // Key: 'account-onboarding:content-types' (string[])
  private _contentTypes$ = new BehaviorSubject<Set<string>>(new Set());
  contentTypes$ = this._contentTypes$.asObservable();
  // Optional freeform input when 'other' content type is chosen
  private _contentOther$ = new BehaviorSubject<string>('');
  contentOther$ = this._contentOther$.asObservable();
  // Platforms selection state (Step 3)
  // Key: 'account-onboarding:platforms' (string[])
  private _platforms$ = new BehaviorSubject<Set<string>>(new Set());
  platforms$ = this._platforms$.asObservable();
  // Optional freeform input when 'other' platform is chosen
  private _platformOther$ = new BehaviorSubject<string>('');
  platformOther$ = this._platformOther$.asObservable();
  // Experience selection (Step 4)
  // Key: 'account-onboarding:experience' (string)
  private _experience$ = new BehaviorSubject<string | null>(null);
  experience$ = this._experience$.asObservable();
  // Hear about us (Step 5)
  // Keys: 'account-onboarding:referrers' (string[])
  //       'account-onboarding:referrer-other' (string)
  //       'account-onboarding:referrer-referral-code' (string)
  private _referrers$ = new BehaviorSubject<Set<string>>(new Set());
  referrers$ = this._referrers$.asObservable();
  private _referrerOther$ = new BehaviorSubject<string>('');
  referrerOther$ = this._referrerOther$.asObservable();
  private _referralCode$ = new BehaviorSubject<string>('');
  referralCode$ = this._referralCode$.asObservable();
  // Goals (Step 6)
  // Key: 'account-onboarding:goals' (string[])
  private _goals$ = new BehaviorSubject<Set<string>>(new Set());
  goals$ = this._goals$.asObservable();
  // Optional freeform input when 'other' goal is chosen
  private _goalOther$ = new BehaviorSubject<string>('');
  goalOther$ = this._goalOther$.asObservable();

  constructor() {
    //  persisted progress/state on service creation.
  const saved = this.storage.getJSON<string[]>('account-onboarding:content-types');
  if (Array.isArray(saved)) this._contentTypes$.next(new Set(saved));
  const ctOther = this.storage.getJSON<string>('account-onboarding:content-other');
  if (typeof ctOther === 'string') this._contentOther$.next(ctOther);
  const savedPlatforms = this.storage.getJSON<string[]>('account-onboarding:platforms');
    if (Array.isArray(savedPlatforms)) this._platforms$.next(new Set(savedPlatforms));
  const platOther = this.storage.getJSON<string>('account-onboarding:platform-other');
  if (typeof platOther === 'string') this._platformOther$.next(platOther);
    const exp = this.storage.getJSON<string>('account-onboarding:experience');
    if (typeof exp === 'string') this._experience$.next(exp);
    const savedReferrers = this.storage.getJSON<string[]>('account-onboarding:referrers');
    if (Array.isArray(savedReferrers)) this._referrers$.next(new Set(savedReferrers));
  const otherRef = this.storage.getJSON<string>('account-onboarding:referrer-other');
  if (typeof otherRef === 'string') this._referrerOther$.next(otherRef);
  const code = this.storage.getJSON<string>('account-onboarding:referrer-referral-code');
  if (typeof code === 'string') this._referralCode$.next(code);
  const savedGoals = this.storage.getJSON<string[]>('account-onboarding:goals');
  if (Array.isArray(savedGoals)) this._goals$.next(new Set(savedGoals));
  const goalOther = this.storage.getJSON<string>('account-onboarding:goal-other');
  if (typeof goalOther === 'string') this._goalOther$.next(goalOther);
  }

  /** Set content type selection (Step 2) — single select */
  toggleContentType(key: string): void {
    const next = new Set<string>();
    next.add(key);
    this._contentTypes$.next(next);
    this.storage.setJSON('account-onboarding:content-types', Array.from(next));
  }

  isAnyContentTypeSelected(): boolean {
    return this._contentTypes$.value.size > 0;
  }

  /** Persist freeform details when 'Other' content type is selected (Step 2) */
  setContentOther(value: string): void {
    this._contentOther$.next(value);
    this.storage.setJSON('account-onboarding:content-other', value);
  }
  getContentOther(): string { return this._contentOther$.value; }

  hasContentType(key: string): boolean {
    return this._contentTypes$.value.has(key);
  }

  /** Set platform selection (Step 3) — single select */
  togglePlatform(key: string): void {
    // If the same key is clicked again, keep it selected (enforce exactly one)
    const next = new Set<string>();
    next.add(key);
    this._platforms$.next(next);
    this.storage.setJSON('account-onboarding:platforms', Array.from(next));
  }

  hasPlatform(key: string): boolean {
    return this._platforms$.value.has(key);
  }

  isAnyPlatformSelected(): boolean {
    return this._platforms$.value.size > 0;
  }

  /** Persist freeform details when 'Other' platform is selected (Step 3) */
  setPlatformOther(value: string): void {
    this._platformOther$.next(value);
    this.storage.setJSON('account-onboarding:platform-other', value);
  }
  getPlatformOther(): string { return this._platformOther$.value; }

  /** Set experience radio selection (Step 4) */
  setExperience(key: string): void {
    this._experience$.next(key);
    this.storage.setJSON('account-onboarding:experience', key);
  }

  getExperience(): string | null { return this._experience$.value; }

  // Referrers (Step 5)
  toggleReferrer(key: string): void {
    const next = new Set<string>();
    next.add(key);
    this._referrers$.next(next);
    this.storage.setJSON('account-onboarding:referrers', Array.from(next));
  }

  hasReferrer(key: string): boolean {
    return this._referrers$.value.has(key);
  }

  isAnyReferrerSelected(): boolean {
    return this._referrers$.value.size > 0;
  }

  /** Persist freeform details when 'Other' referrer is selected (Step 5) */
  setReferrerOther(value: string): void {
    this._referrerOther$.next(value);
    this.storage.setJSON('account-onboarding:referrer-other', value);
  }

  getReferrerOther(): string { return this._referrerOther$.value; }

  /** Persist referral code when 'Referral' referrer is selected (Step 5) */
  setReferralCode(value: string): void {
    this._referralCode$.next(value);
    this.storage.setJSON('account-onboarding:referrer-referral-code', value);
  }
  getReferralCode(): string { return this._referralCode$.value; }

  // Goals (Step 6) — single select
  toggleGoal(key: string): void {
    const next = new Set<string>();
    next.add(key);
    this._goals$.next(next);
    this.storage.setJSON('account-onboarding:goals', Array.from(next));
  }

  hasGoal(key: string): boolean { return this._goals$.value.has(key); }
  isAnyGoalSelected(): boolean { return this._goals$.value.size > 0; }

  /** Persist freeform details when 'Other' goal is selected (Step 6) */
  setGoalOther(value: string): void {
    this._goalOther$.next(value);
    this.storage.setJSON('account-onboarding:goal-other', value);
  }
  getGoalOther(): string { return this._goalOther$.value; }

  /** Returns true if onboarding has been completed previously. */
  isCompleted(): boolean {
    const val = this.storage.getJSON<{ done: boolean; at?: string }>(this.storageKey);
    return !!(val && val.done);
  }

  /** Mark onboarding as completed and persist completion metadata. */
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
