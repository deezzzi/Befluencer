import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  /**
   * Product Tour total number of steps.
   *
   * Current contract:
   * - Step 1: Centered modal with blurred backdrop
   * - Step 2: Tooltip anchored to Notifications (bell)
   * - Step 3: Tooltip anchored to Profile
   * - Step 4: Tooltip anchored to Collab/Side panel (final step)
   *
   * To add/remove steps:
   * 1) Adjust this value
   * 2) Render the corresponding step in the overlay host
   */
  private readonly totalSteps = 4;

  private _open$ = new BehaviorSubject<boolean>(false);
  open$ = this._open$.asObservable();

  private _step$ = new BehaviorSubject<number>(1);
  step$ = this._step$.asObservable();

  /**
   * Opens the Tour at the specified step (defaults to 1)
   */
  open(step = 1): void {
    this._step$.next(step);
    this._open$.next(true);
  }

  /**
   * Closes the Tour overlay without mutating the current step.
   * Consumers typically also set a localStorage flag to avoid
   * auto-opening again (see dashboard component).
   */
  close(): void {
    this._open$.next(false);
  }

  /**
   * Advances to the next step; if already on the final step, closes the Tour.
   */
  next(): void {
    const s = this._step$.value;
    if (s < this.totalSteps) this._step$.next(s + 1);
    else this.close();
  }

  /**
   * Moves back a step if possible; no-op on the first step.
   */
  back(): void {
    const s = this._step$.value;
    if (s > 1) this._step$.next(s - 1);
  }
}
