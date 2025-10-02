import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'bf-media-kit-saved',
  standalone: true,
  templateUrl: './media-kit-saved.component.html',
  styleUrls: [
    '../media-kit-setup/media-kit-setup.component.scss',
    './media-kit-saved.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaKitSavedComponent {}
