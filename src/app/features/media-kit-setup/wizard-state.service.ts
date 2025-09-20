import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalStorageService } from '../../shared/services/local-storage.service';

/**
 * WizardStateService
 * ------------------
 * Persist and restore Media Kit Setup wizard state to LocalStorage.
 *
 * Responsibilities:
 * - Create read/write snapshot of all wizard forms and selections.
 * - Version the stored payload for forward-compatible migrations.
 * - Provide a single storage key to keep LocalStorage tidy and avoid collisions.
 *
 * Notes for maintainers:
 * - If you add/change form controls, bump the version and add a migration path.
 * - Keep snapshots lean (store raw values only, not heavy objects/blobs).
 */

/**
 * Versioned payload for persisted wizard state.
 * Update the `version` number when making breaking changes to the shape.
 */
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

  /**
   * Load the persisted wizard state from LocalStorage.
   * Returns null if nothing is stored or if the stored version is not supported.
   */
  load(): MediaKitStateV1 | null {
    const state = this.storage.getJSON<MediaKitStateV1>(STORAGE_KEY);
    return state && state.version === 1 ? state : null;
  }

  /**
   * Persist the provided payload into LocalStorage.
   * Consider throttling/debouncing calls to avoid excessive writes.
   */
  save(payload: MediaKitStateV1) {
    this.storage.setJSON(STORAGE_KEY, payload);
  }

  /** Remove any persisted wizard state. */
  clear() {
    this.storage.remove(STORAGE_KEY);
  }

  /**
   * Create a lightweight, serializable snapshot of the current wizard.
   * - Uses getRawValue() to include disabled controls (if any).
   * - Copies arrays to avoid accidental mutation after persistence.
   *
   * Extend this method when adding new steps/fields, and bump the interface version if breaking.
   */
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
