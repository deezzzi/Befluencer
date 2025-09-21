import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone, inject, signal } from '@angular/core';
import { OnboardingService } from '../onboarding.service';

/**
 * Step 4: Side Panel (Collab Tools) tooltip
 * - Anchored to element with id="bf-collab-anchor"
 * - Preferred position: to the right of the sidebar item, vertically centered; clamps to viewport
 * - Arrow on left edge pointing at the anchor's centerY
 * - Final step: CTA is "Close" (ends the Tour)
 */
@Component({
  selector: 'bf-onboarding-step4',
  standalone: true,
  template: `
    <!-- Anchored tooltip near Collab Tools in sidebar -->
    <div
      #tooltip
      class="absolute z-[60] w-[360px] max-w-[94vw] bg-[#FF6A00] text-white rounded-2xl shadow-2xl p-4 pointer-events-auto"
      [style.left.px]="left()"
      [style.top.px]="top()"
      [class.opacity-0]="!ready()"
      [class.pointer-events-none]="!ready()"
    >
      <div class="text-base font-semibold">Side Panel</div>
      <p class="mt-1 text-sm leading-snug opacity-95">
        Access all your navigation buttons from the side panel here.
      </p>

      <div class="mt-3 flex items-center gap-3">
        <button type="button" (click)="svc.back()" class="text-white/90 hover:underline text-sm">Back</button>
        <button type="button" (click)="svc.close()" class="ml-auto inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-white/90 px-3 py-1.5 rounded-full text-sm font-semibold">
          Close
        </button>
      </div>

      <!-- Left-pointing arrow -->
      <div
        class="absolute h-3.5 w-3.5 rotate-45 bg-[#FF6A00]"
        [style.left.px]="arrowLeft()"
        [style.top.px]="arrowTop()"
      ></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardingStep4Component implements AfterViewInit, OnDestroy {
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
    const anchor = document.getElementById('bf-collab-anchor');
    const tooltipEl = this.tooltipRef?.nativeElement;
    if (!anchor || !tooltipEl) return;

    const a = anchor.getBoundingClientRect();
    const tRect = tooltipEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spacing = 12;
    const margin = 8;

    // Position to the right of the sidebar item, vertically centered with it
    let left = a.right + spacing;
    let top = a.top + (a.height / 2) - (tRect.height / 2);

    // Clamp within viewport
    if (left + tRect.width + margin > vw) left = vw - tRect.width - margin;
    if (left < margin) left = margin;
    if (top + tRect.height + margin > vh) top = vh - tRect.height - margin;
    if (top < margin) top = margin;

    // Arrow on the left edge pointing to the anchor centerY
    const arrowSize = 14;
    const anchorCenterY = a.top + a.height / 2;
    let arrowLeft = -arrowSize / 2; // half outside on the left edge
    let arrowTop = anchorCenterY - top - arrowSize / 2;
    const inner = 6;
    arrowTop = Math.max(inner, Math.min(tRect.height - inner - arrowSize, arrowTop));

    this.left.set(Math.round(left));
    this.top.set(Math.round(top));
    this.arrowLeft.set(Math.round(arrowLeft));
    this.arrowTop.set(Math.round(arrowTop));
    this.ready.set(true);
  };
}
