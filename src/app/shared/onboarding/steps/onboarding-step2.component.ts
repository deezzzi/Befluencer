import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone, inject, signal } from '@angular/core';
import { OnboardingService } from '../onboarding.service';

/**
 * Step 2: Notifications tooltip
 * - Anchored to element with id="bf-bell-anchor"
 * - Preferred position: below the bell; flips above if needed
 * - Arrow is offset ~5px from the tooltip's right edge (visually near corner)
 * - Tooltip box clamps within viewport; arrow re-aligns to point at anchor
 */
@Component({
  selector: 'bf-onboarding-step2',
  standalone: true,
  template: `
    <!-- Anchored tooltip container, absolutely positioned inside overlay root -->
    <div
      #tooltip
      class="absolute z-[60] w-[300px] max-w-[90vw] bg-[#FF6A00] text-white rounded-2xl shadow-2xl p-4 pointer-events-auto"
      [style.left.px]="left()"
      [style.top.px]="top()"
      [class.opacity-0]="!ready()"
      [class.pointer-events-none]="!ready()"
    >
      <div class="flex items-start gap-4">
        <div class="flex-1">
          <div class="text-base font-semibold">Notifications</div>
          <p class="mt-1 text-sm leading-snug opacity-95">
            Access all your important notifications on clicking the bell icon here.
          </p>
        </div>
      </div>

      <!-- Actions -->
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
export class OnboardingStep2Component implements AfterViewInit, OnDestroy {
  svc = inject(OnboardingService);
  private zone = inject(NgZone);
  @ViewChild('tooltip', { static: true }) tooltipRef!: ElementRef<HTMLDivElement>;

  // Positioning signals
  left = signal(0);
  top = signal(0);
  arrowLeft = signal(0);
  arrowTop = signal(0);
  ready = signal(false);

  ngAfterViewInit(): void {
    // Defer to next tick to ensure DOM settled
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
    const anchor = document.getElementById('bf-bell-anchor');
    const tooltipEl = this.tooltipRef?.nativeElement;
    if (!anchor || !tooltipEl) return;

    const a = anchor.getBoundingClientRect();
    const tRect = tooltipEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
  const spacing = 12; // gap between anchor and tooltip (to fit arrow)
  const margin = 8;   // viewport margin

    // Preferred: tooltip below; arrow fixed at left:248px, top:-7px relative to tooltip
    let top = a.bottom + spacing;
    const anchorCenterX = a.left + a.width / 2;
    const arrowSize = 14; // square side (matches h-3.5 w-3.5)
  const fixedArrowLeft = 248; // requested arrow left inside the tooltip (≈ 5px from right for 300px width)
    const arrowCenterFromLeft = fixedArrowLeft + arrowSize / 2;
    // Place tooltip so that this arrow's center lines up with the bell center
    let left = anchorCenterX - arrowCenterFromLeft;

    // Keep within viewport horizontally (remember the intended left)
    const intendedLeft = left;
    if (left + tRect.width + margin > vw) left = vw - tRect.width - margin;
    if (left < margin) left = margin;

    // If not enough room below, place above
    let flipped = false;
    if (top + tRect.height + margin > vh) {
      top = a.top - tRect.height - spacing;
      flipped = true;
      if (top < margin) top = Math.max(margin, (vh - tRect.height) / 2); // final fallback
    }

    // Compute arrow position relative to tooltip box
    let arrowLeft = (left === intendedLeft)
      ? fixedArrowLeft
      : anchorCenterX - left - arrowSize / 2; // if clamped, keep the arrow pointing at bell
    // Clamp arrow within tooltip width (small inner margin)
    const innerMargin = 6;
    arrowLeft = Math.max(innerMargin, Math.min(tRect.width - innerMargin - arrowSize, arrowLeft));
    const arrowTop = flipped ? tRect.height - arrowSize / 2 : -arrowSize / 2; // -7px when arrowSize=14

    // Apply
    this.left.set(Math.round(left));
    this.top.set(Math.round(top));
    this.arrowLeft.set(Math.round(arrowLeft));
    this.arrowTop.set(Math.round(arrowTop));
    this.ready.set(true);
  };
}
