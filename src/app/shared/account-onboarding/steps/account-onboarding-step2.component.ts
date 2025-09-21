import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { AccountOnboardingService } from '../account-onboarding.service';

@Component({
  selector: 'bf-account-onboarding-step2',
  standalone: true,
  imports: [NgFor],
  template: `
    <div>
      <h3 class="text-xl font-bold text-gray-900">What kind of content do you love creating most?</h3>
      <p class="mt-1 text-sm text-gray-500">(select as many)</p>

      <div class="mt-5 flex flex-wrap gap-3">
        <button type="button"
                *ngFor="let t of types"
                (click)="toggle(t.key)"
                class="px-4 py-2 rounded-full border text-sm transition-colors"
                [class.border-slate-300]="!isSelected(t.key)"
                [class.text-gray-700]="!isSelected(t.key)"
                [class.bg-orange-500]="isSelected(t.key)"
                [class.text-white]="isSelected(t.key)"
                [class.border-orange-500]="isSelected(t.key)">
          {{ t.label }}
        </button>
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
}
