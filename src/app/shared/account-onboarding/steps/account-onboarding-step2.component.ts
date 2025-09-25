import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { AccountOnboardingService } from '../account-onboarding.service';

@Component({
  selector: 'bf-account-onboarding-step2',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <!-- Step 2: Content types (single-select). Selected chip is black. If 'Other' is selected, show an input. -->
    <div>
      <h3 class="text-xl font-bold text-gray-900">What kind of content do you love creating most?</h3>
      <p class="mt-1 text-sm text-gray-500">(select one)</p>

      <div class="mt-5 flex flex-wrap gap-3">
        <button type="button"
                *ngFor="let t of types"
                (click)="toggle(t.key)"
                class="px-4 py-2 rounded-full border text-sm transition-colors"
                [class.border-slate-300]="!isSelected(t.key)"
                [class.text-gray-700]="!isSelected(t.key)"
                [class.bg-black]="isSelected(t.key)"
                [class.text-white]="isSelected(t.key)"
                [class.border-black]="isSelected(t.key)">
          {{ t.label }}
        </button>
      </div>

      <!-- Other freeform input when 'Other' is selected -->
      <div class="mt-5" *ngIf="isSelected('other')">
        <input
          type="text"
          class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Please specify..."
          [value]="svc.getContentOther()"
          (input)="onOtherInput($any($event.target).value)"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOnboardingStep2Component {
  svc = inject(AccountOnboardingService);
  types = [
    { key: 'lifestyle', label: 'Lifestyle' },
    { key: 'beauty-fashion', label: 'Beauty & Fashion' },
    { key: 'travel', label: 'Travel' },
    { key: 'food-recipes', label: 'Food & Recipes' },
    { key: 'tech-gadgets', label: 'Tech & Gadgets' },
    { key: 'fitness-wellness', label: 'Fitness & Wellness' },
    { key: 'education', label: 'Education' },
    { key: 'entertainment', label: 'Entertainment' },
    { key: 'comedy', label: 'Comedy' },
    { key: 'other', label: 'Other' },
  ];

  toggle(key: string) { this.svc.toggleContentType(key); }
  isSelected(key: string) { return this.svc.hasContentType(key); }
  onOtherInput(v: string) { this.svc.setContentOther(v); }
}
