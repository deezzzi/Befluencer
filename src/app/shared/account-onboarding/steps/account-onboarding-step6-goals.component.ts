import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { AccountOnboardingService } from '../account-onboarding.service';

@Component({
  selector: 'bf-account-onboarding-step6-goals',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <!-- Step 6: Goals. Single-select chip; selected is black. If 'Other' is selected, show an input. -->
    <div>
      <h3 class="text-xl font-bold text-gray-900">What will you use Befluencer for?</h3>

      <div class="mt-5 flex flex-wrap gap-3">
        <button type="button"
                *ngFor="let g of goals"
                (click)="toggle(g.key)"
                class="px-4 py-2 rounded-full border text-sm transition-colors"
                [class.border-slate-300]="!isSelected(g.key)"
                [class.text-gray-700]="!isSelected(g.key)"
                [class.bg-black]="isSelected(g.key)"
                [class.text-white]="isSelected(g.key)"
                [class.border-black]="isSelected(g.key)">
          {{ g.label }}
        </button>
      </div>

      <!-- Other freeform input when 'Other' is selected -->
      <div class="mt-5" *ngIf="isSelected('other')">
        <input
          type="text"
          class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Please specify..."
          [value]="svc.getGoalOther()"
          (input)="onOtherInput($any($event.target).value)"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOnboardingStep6GoalsComponent {
  svc = inject(AccountOnboardingService);
  goals = [
    { key: 'grow-audience', label: 'Grow my audience' },
    { key: 'land-brand-deals', label: 'Land brand deals' },
    { key: 'monetize', label: 'Monetize my content' },
    { key: 'learn-improve', label: 'Learn and improve' },
    { key: 'showcase', label: 'To showcase my content' },
    { key: 'explore', label: 'To explore opportunities' },
    { key: 'connect-creators', label: 'To connect with other creators' },
    { key: 'find-campaigns', label: 'To find campaigns' },
    { key: 'other', label: 'Other' },
  ];

  toggle(key: string) { this.svc.toggleGoal(key); }
  isSelected(key: string) { return this.svc.hasGoal(key); }
  onOtherInput(v: string) { this.svc.setGoalOther(v); }
}
