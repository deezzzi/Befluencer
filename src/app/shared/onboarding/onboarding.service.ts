import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private readonly totalSteps = 5;

  private _open$ = new BehaviorSubject<boolean>(false);
  open$ = this._open$.asObservable();

  private _step$ = new BehaviorSubject<number>(1);
  step$ = this._step$.asObservable();

  open(step = 1): void {
    this._step$.next(step);
    this._open$.next(true);
  }

  close(): void {
    this._open$.next(false);
  }

  next(): void {
    const s = this._step$.value;
    if (s < this.totalSteps) this._step$.next(s + 1);
    else this.close();
  }

  back(): void {
    const s = this._step$.value;
    if (s > 1) this._step$.next(s - 1);
  }
}
