import { Component, ChangeDetectionStrategy } from '@angular/core';
/** Wallet placeholder page. */
@Component({
  selector: 'bf-wallet-page',
  standalone: true,
  template: `<h2 class="text-xl font-semibold mb-2">Wallet</h2><p class="text-sm text-slate-600">Placeholder page.</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletComponent {}
