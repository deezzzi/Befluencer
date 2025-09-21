import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone, inject, signal } from '@angular/core';
import { OnboardingService } from '../onboarding.service';

/**
 * Step 3: Profile tooltip
 * - Anchored to element with id="bf-profile-anchor"
 * - Preferred position: below the profile area; flips above if needed
 * - Arrow centered horizontally for symmetry with profile block
 */
@Component({
  selector: 'bf-onboarding-step3',
  standalone: true,
  template: `
    <!-- Anchored tooltip near profile section -->
    <div
      #tooltip
      class="absolute z-[60] w-[320px] max-w-[92vw] bg-[#FF6A00] text-white rounded-2xl shadow-2xl p-4 pointer-events-auto"
      [style.left.px]="left()"
      [style.top.px]="top()"
      [class.opacity-0]="!ready()"
      [class.pointer-events-none]="!ready()"
    >
      <div class="text-base font-semibold">Profile</div>
      <p class="mt-1 text-sm leading-snug opacity-95">
        Access all your profile settings and edit your credentials here.
      </p>

      <div class="mt-3 flex items-center gap-3">
        <button type="button" (click)="svc.back()" class="text-white/90 hover:underline text-sm">Back</button>
        <button type="button" (click)="svc.next()" class="ml-auto inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-white/90 px-3 py-1.5 rounded-full text-sm font-semibold">
          Next
          <span aria-hidden>→</span>
        </button>
      </div>

      <!-- Arrow pointer -->
      <div
        class="absolute h-3.5 w-3.5 rotate-45 bg-[#FF6A00]"
        [style.left.px]="arrowLeft()"
        [style.top.px]="arrowTop()"
      ></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardingStep3Component implements AfterViewInit, OnDestroy {
  svc = inject(OnboardingService);
  private zone = inject(NgZone);
  @ViewChild('tooltip', { static: true }) tooltipRef!: ElementRef<HTMLDivElement>;

  left = signal(0);
  top = signal(0);
  arrowLeft = signal(0);
  arrowTop = signal(0);
  ready = signal(false);

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.reposition();
        window.addEventListener('resize', this.reposition, { passive: true });
        window.addEventListener('scroll', this.reposition, { passive: true });
      });
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.reposition);
    window.removeEventListener('scroll', this.reposition);
  }

  private reposition = () => {
    const anchor = document.getElementById('bf-profile-anchor');
    const tooltipEl = this.tooltipRef?.nativeElement;
    if (!anchor || !tooltipEl) return;

    const a = anchor.getBoundingClientRect();
    const tRect = tooltipEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spacing = 12;
    const margin = 8;

    // Prefer below the profile block
    let top = a.bottom + spacing;
    const anchorCenterX = a.left + a.width / 2;

    // Arrow centered by default for this step to visually point at profile block
    const arrowSize = 14;
    const arrowCenterFromLeft = tRect.width / 2;
    let left = anchorCenterX - arrowCenterFromLeft;

    const intendedLeft = left;
    if (left + tRect.width + margin > vw) left = vw - tRect.width - margin;
    if (left < margin) left = margin;

    let flipped = false;
    if (top + tRect.height + margin > vh) {
      top = a.top - tRect.height - spacing;
      flipped = true;
      if (top < margin) top = Math.max(margin, (vh - tRect.height) / 2);
    }

    // Arrow position
    let arrowLeft = (left === intendedLeft)
      ? (tRect.width / 2) - (arrowSize / 2)
      : anchorCenterX - left - arrowSize / 2;
    const inner = 6;
    arrowLeft = Math.max(inner, Math.min(tRect.width - inner - arrowSize, arrowLeft));
    const arrowTop = flipped ? tRect.height - arrowSize / 2 : -arrowSize / 2;

    this.left.set(Math.round(left));
    this.top.set(Math.round(top));
    this.arrowLeft.set(Math.round(arrowLeft));
    this.arrowTop.set(Math.round(arrowTop));
    this.ready.set(true);
  };
}
