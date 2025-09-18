import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalStorageService } from '../../shared/services/local-storage.service';

export interface MediaKitStateV1 {
  version: 1;
  activeStep: number;
  form: any;
  collabForm: any;
  ratesForm: any;
  contactForm: any;
  selectedServices: string[];
  platforms: Array<{ id: string; connected: boolean }>;
  brandLogoPreview: string | null;
  topContents: { id: number }[];
}

const STORAGE_KEY = 'media-kit-setup:v1';

@Injectable({ providedIn: 'root' })
export class WizardStateService {
  constructor(private storage: LocalStorageService) {}

  load(): MediaKitStateV1 | null {
    const state = this.storage.getJSON<MediaKitStateV1>(STORAGE_KEY);
    return state && state.version === 1 ? state : null;
  }

  save(payload: MediaKitStateV1) {
    this.storage.setJSON(STORAGE_KEY, payload);
  }

  clear() {
    this.storage.remove(STORAGE_KEY);
  }

  snapshot(params: {
    activeStep: number;
    form: FormGroup;
    collabForm: FormGroup;
    ratesForm: FormGroup;
    contactForm: FormGroup;
    selectedServices: string[];
    platforms: Array<{ id: string; connected: boolean }>;
    brandLogoPreview: string | null;
    topContents: { id: number }[];
  }): MediaKitStateV1 {
    const { activeStep, form, collabForm, ratesForm, contactForm, selectedServices, platforms, brandLogoPreview, topContents } = params;
    return {
      version: 1,
      activeStep,
      form: form.getRawValue(),
      collabForm: collabForm.getRawValue(),
      ratesForm: ratesForm.getRawValue(),
      contactForm: contactForm.getRawValue(),
      selectedServices: [...selectedServices],
      platforms: platforms.map(p => ({ id: p.id, connected: p.connected })),
      brandLogoPreview: brandLogoPreview || null,
      topContents: [...topContents]
    };
  }
}
