import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'bf-home-page',
  standalone: true,
  template: `
    <div class="prose dark:prose-invert max-w-none">
      <h2>Home</h2>
      <p>Welcome to the Befluencer platform. Select a section from the sidebar.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}
