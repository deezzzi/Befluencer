import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { WizardStateService } from './wizard-state.service';
import { Subject, merge } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { NgFor, NgIf, NgClass, SlicePipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';

/**
 * MediaKitSetupComponent
 *
 * Purpose
 * - Guides creators through a multi-step wizard to assemble a media kit.
 * - Provides an interactive Preview step that summarizes entered data with empty-state placeholders.
 *
 * Key implementation notes
 * - Uses standalone Angular component with OnPush change detection for predictable rendering.
 * - Persists wizard state locally via WizardStateService (debounced autosave + explicit "Save for later").
 * - Restores prior progress on init; defensively clamps step indices and filters invalid content items.
 * - Sanitizes platform SVG icons once on init to allow safe [innerHTML] usage.
 * - Enforces lightweight validation on steps that collect required fields before advancing.
 *
 * Accessibility
 * - Stepper announces current step via aria-current.
 * - Cards and controls expose roles and labels for keyboard and screen-reader support.
 *
 * Rationale
 * - lastUpdatedStr is session-only (not persisted) to avoid churn in storage on every keystroke; the timeline remains visible to users.
 * - Snapshot payload stores raw values (ids, booleans, text) to keep local storage small and robust to view/layout changes.
 */

@Component({
  selector: 'bf-media-kit-setup',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, NgClass, SlicePipe, DecimalPipe, NgTemplateOutlet],
  templateUrl: './media-kit-setup.component.html',
  styleUrls: ['./media-kit-setup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaKitSetupComponent implements OnInit, OnDestroy {
  @Output() titleChange = new EventEmitter<string>();
  // Wizard steps shown in the left stepper; the last item is the Preview (read-only) page
  steps = [
    { label: 'Basic Information', desc: 'Tell us about yourself.' },
  { label: 'Socials & Stat', desc: 'Connect to your social<br>media accounts.' },
    { label: 'Previous Collaborations', desc: 'Add your previous<br> experiences with brands.' },
    { label: 'Rates & Services', desc: 'Describe your services and <br>how you will like to be paid.' },
    { label: 'Contact Info', desc: 'How can brands reach you?' },
    { label: 'Preview', desc: 'You are all done. Review<br> and select your preferred <br>theme.' }
  ];
  activeStep = 0;
  submitted = false;
  // Step 1: Basic information form
  form = new FormBuilder().group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    alias: [''],
    location: ['', Validators.required],
    audienceBase: [''],
    languages: [''],
    bio: ['']
  });
  countries = ['Ghana','USA','UK','Cameroon','Kenya'];
  languagesList = ['English','French','Spanish','German','Russian'];
  openAudience = false;
  openLanguages = false;
  // Social platforms list; iconSafe is computed on init with DomSanitizer to render SVG safely
  // connecting?: transient flag while establishing connection
  platforms: Array<{ id:string; name:string; labelLower:string; connected:boolean; connecting?: boolean; icon:string; iconSafe?: SafeHtml }> = [
  { id:'tiktok', name:'Tiktok', labelLower:'tiktok', connected:false, icon:`<svg width="40" height="45" viewBox="0 0 40 45" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_184_3697)">
<path d="M29.6447 16.2037C32.5631 18.2744 36.1384 19.4928 39.9998 19.4928V12.1175C39.269 12.1178 38.5401 12.0421 37.8252 11.8916V17.697C33.9641 17.697 30.3892 16.4788 27.4702 14.4082V29.4593C27.4702 36.9887 21.3208 43.0919 13.7358 43.0919C10.9056 43.0919 8.275 42.2427 6.08984 40.7861C8.58391 43.3174 12.062 44.8876 15.9098 44.8876C23.4955 44.8876 29.645 38.7843 29.645 31.2546V16.2037H29.6447ZM32.3275 8.76283C30.8359 7.14547 29.8566 5.0553 29.6447 2.74447V1.7959H27.5839C28.1027 4.73285 29.8722 7.24199 32.3275 8.76283ZM10.8873 35.0084C10.054 33.924 9.60351 32.5972 9.60562 31.233C9.60562 27.7895 12.4183 24.9973 15.8884 24.9973C16.535 24.9969 17.1778 25.0955 17.7942 25.2895V17.7492C17.0739 17.6513 16.347 17.6095 15.6205 17.6249V23.4938C15.0038 23.2998 14.3607 23.2013 13.7137 23.2018C10.2437 23.2018 7.43125 25.9936 7.43125 29.4377C7.43125 31.873 8.83703 33.9813 10.8873 35.0084Z" fill="#FF004F"/>
<path d="M27.4685 14.408C30.3877 16.4786 33.9623 17.6969 37.8235 17.6969V11.8914C35.6682 11.4357 33.7602 10.3178 32.3257 8.76283C29.8702 7.24183 28.101 4.73269 27.5823 1.7959H22.1693V31.2543C22.157 34.6886 19.3491 37.4693 15.8865 37.4693C13.8462 37.4693 12.0334 36.5039 10.8854 35.0082C8.83539 33.9813 7.42945 31.8728 7.42945 29.4378C7.42945 25.9941 10.242 23.2019 13.712 23.2019C14.3768 23.2019 15.0176 23.3047 15.6187 23.494V17.625C8.1668 17.7779 2.17383 23.8215 2.17383 31.2544C2.17383 34.9649 3.66617 38.3286 6.08836 40.7864C8.27352 42.2427 10.904 43.0922 13.7343 43.0922C21.3195 43.0922 27.4687 36.9885 27.4687 29.4593L27.4685 14.408Z" fill="black"/>
<path d="M37.8242 11.8909V10.3214C35.8806 10.3242 33.9755 9.784 32.3264 8.76243C33.7861 10.3486 35.7082 11.4425 37.8242 11.8912M27.5828 1.79534C27.5334 1.51473 27.4955 1.23224 27.4691 0.948569V0H19.995V29.4587C19.9831 32.8927 17.1753 35.6734 13.7125 35.6734C12.7308 35.6748 11.7626 35.4469 10.8859 35.0081C12.0339 36.5035 13.8467 37.4687 15.887 37.4687C19.3495 37.4687 22.1577 34.6883 22.1698 31.2541V1.7955L27.5828 1.79534ZM15.6197 17.6245V15.9534C14.9951 15.8688 14.3655 15.8263 13.7352 15.8265C6.14922 15.8265 0 21.9301 0 29.4587C0 34.1789 2.41672 38.3388 6.08922 40.7857C3.66703 38.3281 2.17469 34.9642 2.17469 31.2539C2.17469 23.8211 8.1675 17.7773 15.6197 17.6245Z" fill="#00F2EA"/>
</g>
<defs>
<clipPath id="clip0_184_3697">
<rect width="40" height="45" fill="white"/>
</clipPath>
</defs>
</svg>
`},
    { id:'youtube', name:'Youtube', labelLower:'youtube', connected:false, icon:`<svg width='24' height='24' viewBox='0 0 24 24' fill='none'><rect width='24' height='24' rx='4' fill='#FF0000'/><path d='M10 15.5v-7l6 3.5-6 3.5Z' fill='#fff'/></svg>`},
    { id:'instagram', name:'Instagram', labelLower:'instagram', connected:false, icon:`<svg width='24' height='24' viewBox='0 0 24 24' fill='none'><rect width='24' height='24' rx='6' fill='url(#g)'/><path d='M12 16.5A4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 0 1 0 9Z' stroke='#fff' stroke-width='1.6'/><circle cx='17.5' cy='6.5' r='1.2' fill='#fff'/><defs><linearGradient id='g' x1='0' y1='0' x2='24' y2='24' gradientUnits='userSpaceOnUse'><stop stop-color='#f09433'/><stop offset='.25' stop-color='#e6683c'/><stop offset='.5' stop-color='#dc2743'/><stop offset='.75' stop-color='#cc2366'/><stop offset='1' stop-color='#bc1888'/></linearGradient></defs></svg>`},
    { id:'x', name:'X (Twitter)', labelLower:'X', connected:false, icon:`<svg width='24' height='24' viewBox='0 0 24 24' fill='none'><rect width='24' height='24' rx='4' fill='#fff' stroke='#111'/><path d='M6 6h3l4 5 4-5h3l-5.5 7L20 18h-3l-4-5-4 5H6l5.5-7L6 6Z' fill='#000'/></svg>`},
    { id:'facebook', name:'Facebook', labelLower:'facebook', connected:false, icon:`<svg width='24' height='24' viewBox='0 0 24 24' fill='none'><rect width='24' height='24' rx='4' fill='#1877F2'/><path d='M13.3 21v-7H16l.4-3h-3.1V8.5c0-.9.3-1.5 1.6-1.5H16V4.3c-.3 0-1-.1-1.8-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.7v7h3.6Z' fill='#fff'/></svg>`},
    { id:'snapchat', name:'Snapchat', labelLower:'snapchat', connected:false, icon:`<svg width='24' height='24' viewBox='0 0 24 24' fill='none'><rect width='24' height='24' rx='4' fill='#FFFC00'/><path d='M12 4c2.4 0 4.2 1.9 4.2 4.4 0 1 .2 1.7.6 2 .5.5 1.4.6 2 .9.3.2.4.5.2.8-.3.6-1.3.6-1.6 1 0 .2.1.4.3.5.3.2.7.3 1.1.4.5.2.8.5.8.8 0 .5-.6.7-1 .8-.5.2-1 .3-1.2.6-.3.3-.3.7-.5 1.1-.6 1.1-1.9 2-3.9 2s-3.3-.9-3.9-2c-.2-.4-.2-.8-.5-1.1-.2-.3-.7-.4-1.2-.6-.4-.1-1-.3-1-.8 0-.3.3-.6.8-.8.4-.1.8-.2 1.1-.4.2-.1.3-.3.3-.5-.3-.4-1.3-.4-1.6-1-.2-.3-.1-.6.2-.8.7-.3 1.5-.4 2-.9.4-.3.6-1 .6-2C7.8 5.9 9.6 4 12 4Z' fill='#000'/></svg>`},
    { id:'pinterest', name:'Pinterest', labelLower:'pinterest', connected:false, icon:`<svg width='24' height='24' viewBox='0 0 24 24' fill='none'><rect width='24' height='24' rx='4' fill='#fff' stroke='#bd081c'/><path d='M12.2 5c-3.6 0-5.4 2.6-5.4 4.8 0 1.3.5 2.5 1.7 2.9.2.1.3 0 .4-.2.1-.1.3-.5.4-.7.1-.2 0-.3-.1-.5-.3-.4-.5-.9-.5-1.5 0-1.9 1.4-3.6 3.7-3.6 2 0 3.1 1.2 3.1 2.8 0 2.2-1 4.1-2.4 4.1-.8 0-1.4-.6-1.2-1.4.2-.9.6-1.9.6-2.5 0-.6-.3-1-.9-1-.7 0-1.3.7-1.3 1.6 0 .6.2 1 .2 1s-1 4.1-1.2 4.9c-.4 1.7-.1 3.8 0 4 .1.1.2.1.3 0 .2-.2 2.2-2.8 2.6-4.3.2-.9.5-1.7.5-1.7.3.6 1.1 1.1 2 1.1 2.6 0 4.3-2.4 4.3-5.6C17.4 7 15.4 5 12.2 5Z' fill='#bd081c'/></svg>`},
    { id:'twitch', name:'Twitch', labelLower:'twitch', connected:false, icon:`<svg width='24' height='24' viewBox='0 0 24 24' fill='none'><rect width='24' height='24' rx='4' fill='#fff' stroke='#000'/><path d='M6 5h12v8.5L15 17H11l-2 2H8v-2H5V7l1-2Zm2 7V8h2v4H8Zm5 0V8h2v4h-2Z' fill='#000'/></svg>`}
  ];
  // Static placeholder metrics for preview; in real implementation these would come from API
  platformMetrics: Record<string,string> = {
    tiktok:'12.5k',
    youtube:'8.2k',
    instagram:'12.5k',
    x:'6.4k',
    facebook:'4.1k',
    snapchat:'9.7k'
  };
  // Top content items; treated as valid only when a real thumbnail/url exists (see load logic)
  topContents: { id:number; thumb?: string; url?: string }[] = [];
  // Placeholder previous collaborations list (would be aggregated from multiple form submissions later)
  previewCollaborations: { title: string; reach: string }[] = [];
  // Step 3: Collaborations form
  collabForm = new FormBuilder().group({
    brand: ['', Validators.required],
    campaignName: ['', Validators.required],
    campaignDescription: ['', Validators.required],
    campaignReach: [''],
    campaignEngagement: ['']
  });
  brandList = ['Nike','Adidas','Coca-Cola','Apple','Samsung','Netflix'];
  openBrands = false;
  brandLogoPreview: string | null = null;
  @ViewChild('brandFile') private brandFileInput?: ElementRef<HTMLInputElement>;
  // Service catalog used to toggle offered services (Step 4)
  servicesList = [
    { id:'sponsored', title:'Sponsored Posts', desc:'Promote a brand or product directly on your social media page as a paid post, tailored to your audience.' },
    { id:'reviews', title:'Product Reviews', desc:'Share your honest opinion about a product after using it — through a dedicated post, video, or story.' },
    { id:'coverage', title:'Event Coverage', desc:'Attend and cover a brand event or experience, sharing real-time or post-event content with your audience.' },
    { id:'ugc', title:'UGC Creation', desc:'Create high-quality content (photos or videos) that the brand can use on their own channels — without you posting it.' },
    { id:'giveaways', title:'Giveaways', desc:'Host a contest or giveaway on your platform to help a brand increase engagement, reach, and follower growth.' },
    { id:'ambassador', title:'Brand Ambassador', desc:'Form a long-term partnership with a brand, representing them through regular content, exclusive deals, or affiliate codes.' }
  ];
  selectedServices: string[] = [];
  // Charging rate options for Step 4
  chargingRates = [
    { id:'per_post', label:'Per post' },
    { id:'per_package', label:'Per package' },
    { id:'negotiable', label:'Negotiable' }
  ]; 
  // Step 4: Rates form
  ratesForm = new FormBuilder().group({
    chargingRate:['per_post'],
    currency:['GHC'],
    amount:['']
  });
  currencyList = ['GHC','USD','EUR','GBP','NGN'];
  openCurrency = false;
  /* Contact Info */
  // Step 5: Contact info form
  contactForm = new FormBuilder().group({
    email: ['', Validators.required],
    bookingAvailability: ['', Validators.required],
    phone: ['', Validators.required],
    socialsAccount: [''],
    whatsapp: [''],
    preferredMethod: [''],
    website: [''],
    notes: ['']
  });
  bookingAvailabilityOptions = ['Weekdays', 'Weekends', 'Evenings', 'Anytime']; 
  socialsAccountOptions = ['Instagram', 'YouTube', 'TikTok', 'Facebook', 'X'];
  preferredContactMethods = ['Email', 'Phone', 'WhatsApp'];
  openBookingAvailability = false;
  openSocialsAccount = false;
  openPreferredContact = false;
  private destroy$ = new Subject<void>();
  // Progress / last updated
  progressTotal = 7;
  lastUpdatedStr: string | null = null;
  // Manual Stat Upload modal state
  editOpen = false;
  modalPlatform: { id:string; name:string } | null = null;
  manualTouched = false;
  manualStatsForm = new FormBuilder().group({
    followers: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?([kKmM])?$/)]],
    engagementRate: ['', [Validators.pattern(/^[0-9]+(\.[0-9]+)?%?$/)]],
    avgViews: ['', [Validators.pattern(/^[0-9]+(\.[0-9]+)?([kKmM])?$/)]]
  });

  /**
   * Lifecycle: initialize component state.
   * - Sanitizes inline SVG platform icons for safe rendering.
   * - Loads any saved draft snapshot (with defensive bounds and filtering for top contents).
   * - Wires a debounced autosave stream across all forms.
   */
  ngOnInit(){
    this.emitTitle();
    // Sanitize platform icons so SVG renders properly
    this.platforms.forEach(p => { p.iconSafe = this.sanitizer.bypassSecurityTrustHtml(p.icon); });
    // Load existing draft if any
    const draft = this.state.load();
    if(draft){
      this.activeStep = Math.min(Math.max(0, draft.activeStep), this.steps.length - 1);
      this.form.patchValue(draft.form || {});
      this.collabForm.patchValue(draft.collabForm || {});
      this.ratesForm.patchValue(draft.ratesForm || {});
      this.contactForm.patchValue(draft.contactForm || {});
      this.selectedServices = Array.isArray(draft.selectedServices) ? draft.selectedServices.slice() : [];
      this.brandLogoPreview = draft.brandLogoPreview || null;
      if(Array.isArray(draft.platforms)){
        // apply connected flags by id
        draft.platforms.forEach(snap => {
          const cur = this.platforms.find(p => p.id === snap.id);
          if(cur){ cur.connected = !!snap.connected; }
        });
      }
      if(Array.isArray(draft.topContents) && draft.topContents.length){
        // Only keep entries that have a real thumbnail or url; ignore placeholder-only entries
        const valid = draft.topContents.filter((c: any) => c && (c.thumb || c.url));
        if(valid.length){
          this.topContents = valid.map((c: any, idx: number) => ({ id: c.id ?? idx + 1, thumb: c.thumb, url: c.url }));
        }
      }
      this.emitTitle();
    }

    // Autosave on changes (debounced): snapshot + persist to local storage
    merge(
      this.form.valueChanges,
      this.collabForm.valueChanges,
      this.ratesForm.valueChanges,
      this.contactForm.valueChanges
    ).pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(() => this.saveDraftInternal(false));
  }
  /**
   * Emits page title to parent and document.title, switching between Setup and Preview.
   */
  private emitTitle(){
    const title = this.activeStep === this.steps.length-1 ? 'Media Kit Preview' : 'Media Kit Setup';
    this.titleChange.emit(title);
    // Optional: also set document title
    if(typeof document !== 'undefined') document.title = title;
  }
  /**
   * Advance to the next step if the current step passes validation.
   * Resets error flags, closes dropdowns, updates title and persists draft.
   */
  next(){
    // Validate current step before proceeding
    if(!this.validateCurrentStep()){
      this.submitted = true;
      return;
    }
    if(this.activeStep < this.steps.length-1){
      this.activeStep++;
      this.submitted = false; // reset error flag when moving to a new step
      this.closeAllDropdowns();
      this.emitTitle();
      this.saveDraftInternal(false);
    }
  }
  /**
   * Navigate back one step; resets error flags and persists draft.
   */
  prev(){
    if(this.activeStep>0){
      this.activeStep--;
      this.submitted = false; // reset error flag when moving steps
      this.closeAllDropdowns();
      this.emitTitle();
      this.saveDraftInternal(false);
    }
  }
  /**
   * Public entry to save an explicit draft, e.g., via "Save For Later" button.
   */
  saveDraft(){ this.saveDraftInternal(true); }
  /**
   * Captures a normalized snapshot of the wizard and persists it via the state service.
   * @param explicit when true, surfaces a lightweight confirmation (alert) to the user.
   */
  private saveDraftInternal(explicit: boolean){
    // update last updated (not persisted – session level)
    const now = new Date();
    this.lastUpdatedStr = this.formatTimestamp(now);
    const snapshot = this.state.snapshot({
      activeStep: this.activeStep,
      form: this.form,
      collabForm: this.collabForm,
      ratesForm: this.ratesForm,
      contactForm: this.contactForm,
      selectedServices: this.selectedServices,
      platforms: this.platforms.map(p => ({ id: p.id, connected: p.connected })),
      brandLogoPreview: this.brandLogoPreview,
      topContents: this.topContents
    });
    this.state.save(snapshot);
    if(explicit){
      // Optionally provide lightweight confirmation; could be a toast in the future
      // eslint-disable-next-line no-alert
      if(typeof window !== 'undefined') window.alert('Draft saved locally. You can resume later.');
    }
  }
  /**
   * Allow jumping backwards to a completed step via the stepper.
   */
  jump(i: number){ if(i < this.activeStep){ this.activeStep = i; this.emitTitle(); this.saveDraftInternal(false); } }
  constructor(private router: Router, private sanitizer: DomSanitizer, private state: WizardStateService){}
  /**
   * Finalize wizard: marks submitted state and navigates to the saved media kit route.
   * (API submission would be added here in a future implementation.)
   */
  finish(){
    this.submitted = true;
    this.emitTitle();
    // Navigate to saved page
    this.router.navigate(['/media-kit/saved']);
  }
  /**
   * Dispose autosave subscriptions.
   */
  ngOnDestroy(){ this.destroy$.next(); this.destroy$.complete(); }
  /**
   * Gate movement between steps by validating forms with required fields.
   */
  private validateCurrentStep(): boolean {
    switch(this.activeStep){
      case 0: // Basic Information
        return this.form.valid;
      case 2: // Collaborations
        return this.collabForm.valid;
      case 4: // Contact Info
        return this.contactForm.valid;
      default:
        return true; // Steps without required fields
    }
  }
  /**
   * Closes all dropdown menus; called on step changes to avoid stranded popovers.
   */
  private closeAllDropdowns(){
    this.openAudience = false;
    this.openLanguages = false;
    this.openBrands = false;
    this.openCurrency = false;
    this.openBookingAvailability = false;
    this.openSocialsAccount = false;
    this.openPreferredContact = false;
  }
  /**
   * Quick access to the Preview step without completing all prior steps.
   */
  openPreview(e: Event){
    e.preventDefault();
    this.activeStep = this.steps.length - 1;
    this.submitted = false;
    this.closeAllDropdowns();
    this.emitTitle();
    this.saveDraftInternal(false);
  }
  // --- Dropdown & selection helpers (UX only; persistence handled by autosave) ---
  toggleAudience(){ this.openAudience = !this.openAudience; this.openLanguages = false; }
  toggleLanguages(){ this.openLanguages = !this.openLanguages; this.openAudience = false; }
  selectAudience(val: string){ this.form.patchValue({ audienceBase: val }); this.openAudience = false; }
  selectLanguage(val: string){ this.form.patchValue({ languages: val }); this.openLanguages = false; }
  /**
   * Handle connect button with a temporary "Connecting" state.
   * - If already connecting, ignore clicks
   * - If connected, clicking toggles to disconnected immediately
   * - If disconnected, set connecting for ~1.6s then mark as connected
   */
  onConnectClick(p: any){
    if (p.connecting) return;
    if (p.connected){ p.connected = false; return; }
    p.connecting = true;
    setTimeout(() => { p.connecting = false; p.connected = true; }, 1600);
  }
  // Back-compat: if any template still calls toggleConnect
  toggleConnect(p: any){ this.onConnectClick(p); }
  /**
   * Open the Manual Stat Upload modal for the chosen platform.
   */
  editPlatform(p: any){
    this.modalPlatform = { id: p.id, name: p.name };
    this.manualStatsForm.reset();
    this.manualTouched = false;
    this.editOpen = true;
  }
  /** Close modal without saving */
  closeManualModal(){ this.editOpen = false; this.modalPlatform = null; }
  /** Handle ESC key inside modal */
  onModalKeydown(ev: KeyboardEvent){ if(ev.key === 'Escape'){ ev.stopPropagation(); this.closeManualModal(); } }
  /** Save entered stats (followers -> preview metric). */
  saveManualStats(){
    this.manualTouched = true;
    if(this.manualStatsForm.invalid || !this.modalPlatform){ return; }
    const followersRaw = String(this.manualStatsForm.value.followers || '').trim();
    // Preserve k/M suffix if provided; otherwise format to compact display
    const formatted = this.formatCompactNumber(followersRaw);
    this.platformMetrics[this.modalPlatform.id] = formatted;
    this.closeManualModal();
  }
  /** Format plain numbers like 12500 -> 12.5k; keep existing k/m suffixes */
  private formatCompactNumber(input: string): string {
    if(/([kKmM])$/.test(input)){
      // normalize suffix to lowercase (k/m)
      const num = input.replace(/([kKmM])$/, (_, s) => s.toLowerCase());
      return num;
    }
    const n = parseFloat(input);
    if(isNaN(n)) return input;
    const abs = Math.abs(n);
    if(abs >= 1_000_000) return (n/1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1).replace(/\.0$/, '') + 'm';
    if(abs >= 1_000) return (n/1_000).toFixed(n % 1_000 === 0 ? 0 : 1).replace(/\.0$/, '') + 'k';
    return String(n);
  }
  toggleBrands(){ this.openBrands = !this.openBrands; }
  selectBrand(b: string){ this.collabForm.patchValue({ brand: b }); this.openBrands = false; }
  /**
   * Opens the hidden file input to select a brand logo image.
   */
  triggerBrandFile(){
    const el = this.brandFileInput?.nativeElement;
    if(el){
      el.click();
    }
  }
  /**
   * Reads and previews an image file for brand logo with basic type/size validation.
   */
  onBrandLogoSelected(e: Event){
    const input = e.target as HTMLInputElement;
    if(input.files && input.files[0]){
      const file = input.files[0];
      // Basic validation: allow images only and limit to ~5MB
      if(!file.type.startsWith('image/')){ return; }
      const maxBytes = 5 * 1024 * 1024;
      if(file.size > maxBytes){ return; }
      const reader = new FileReader();
      reader.onload = (ev)=>{ this.brandLogoPreview = ev.target?.result as string; };
      reader.readAsDataURL(file);
      // Allow selecting the same file again later by resetting the input value
      input.value = '';
    }
  }
  isServiceSelected(id: string){ return this.selectedServices.includes(id); }
  toggleService(id: string){
    const idx = this.selectedServices.indexOf(id);
    if(idx>-1) this.selectedServices.splice(idx,1); else this.selectedServices.push(id);
  }
  selectChargingRate(id: string){ this.ratesForm.patchValue({ chargingRate:id }); }
  toggleCurrency(){ this.openCurrency = !this.openCurrency; }
  selectCurrency(c: string){ this.ratesForm.patchValue({ currency:c }); this.openCurrency = false; }
  /* Contact Info dropdown logic */
  toggleBookingAvailability(){ this.openBookingAvailability = !this.openBookingAvailability; this.openSocialsAccount = false; this.openPreferredContact = false; }
  selectBookingAvailability(opt: string){ this.contactForm.patchValue({ bookingAvailability: opt }); this.openBookingAvailability = false; }
  toggleSocialsAccount(){ this.openSocialsAccount = !this.openSocialsAccount; this.openBookingAvailability = false; this.openPreferredContact = false; }
  selectSocialsAccount(val: string){ this.contactForm.patchValue({ socialsAccount: val }); this.openSocialsAccount = false; }
  togglePreferredContact(){ this.openPreferredContact = !this.openPreferredContact; this.openBookingAvailability = false; this.openSocialsAccount = false; }
  selectPreferredContact(val: string){ this.contactForm.patchValue({ preferredMethod: val }); this.openPreferredContact = false; }
  /** Convert internal charging rate code to a human-friendly label for preview. */
  readableRate(code: string | null){
    if(!code) return '';
    switch(code){
      case 'per_post': return 'per post';
      case 'per_package': return 'per package';
      case 'per_hour': return 'per hour';
      case 'per_day': return 'per day';
      case 'per_week': return 'per week';
      case 'per_month': return 'per month';
      default: return code.replace(/_/g,' ');
    }
  }
  /** Numeric getter for amount input with NaN safety. */
  get amountValue(): number {
    const raw = this.ratesForm.value.amount as any;
    const num = parseFloat(raw);
    return isNaN(num) ? 0 : num;
  }
  /**
   * Formats the preferred contact for preview; expands WhatsApp to include number if provided.
   */
  preferredContactDisplay(){
    const method = this.contactForm.value.preferredMethod;
    if(!method) return '';
    if(method.toLowerCase()==='whatsapp' && this.contactForm.value.whatsapp){
      return `Whatsapp (${this.contactForm.value.whatsapp})`;
    }
    return method;
  }
  /** Ensure preview links are navigable by prefixing missing protocols. */
  formatWebsite(url: string){
    if(!url) return '';
    if(!/^https?:\/\//i.test(url)) return 'https://' + url;
    return url;
  }
  /**
   * Adds a blank top content item shell; only entries with thumb/url are considered non-empty in preview.
   */
  addContent(){
    const nextId = this.topContents.length + 1;
    this.topContents.push({ id: nextId });
  }
  // ---------- Empty-state helpers & progress ----------
  /** Truthy text check used by multiple empty-state helpers. */
  private hasText(v: any){ return !!(v && String(v).trim().length); }
  isEmptyBasicInfo(){
    const v = this.form.value;
    return !(
      this.hasText(v.firstName) || this.hasText(v.lastName) || this.hasText(v.location) || this.hasText(v.bio) || this.hasText(v.languages) || this.hasText(v.audienceBase) || this.hasText(v.alias)
    );
  }
  isEmptySocials(){ return !this.platforms.some(p => p.connected); }
  isEmptyCollaborations(){
    const v = this.collabForm.value;
    const anyForm = this.hasText(v.brand) || this.hasText(v.campaignName) || this.hasText(v.campaignDescription) || this.hasText(v.campaignReach) || this.hasText(v.campaignEngagement);
    return !(anyForm || this.brandLogoPreview || (this.previewCollaborations && this.previewCollaborations.length>0));
  }
  isEmptyServicesRates(){
    const rate = this.ratesForm.value.chargingRate;
    const amountOk = this.amountValue > 0;
    const anyService = this.selectedServices.length > 0;
    const anyRate = rate === 'negotiable' || amountOk;
    return !(anyService || anyRate);
  }
  isEmptyContact(){
    const v = this.contactForm.value;
    return !(this.hasText(v.email) || this.hasText(v.phone) || this.hasText(v.bookingAvailability) || this.hasText(v.website) || this.hasText(v.preferredMethod) || this.hasText(v.whatsapp) || this.hasText(v.notes));
  }
  isEmptyTopContent(){
    // Consider non-empty only if at least one item has a real thumbnail or url
    return !(Array.isArray(this.topContents) && this.topContents.some(c => !!(c && (c.thumb || c.url))));
  }
  /** Count of sections considered "complete" for the preview status card. */
  get progressDone(){
    let done = 0;
    if(!this.isEmptyBasicInfo()) done++;
    if(!this.isEmptySocials()) done++;
    if(!this.isEmptyCollaborations()) done++;
    if(!this.isEmptyServicesRates()) done++;
    if(!this.isEmptyContact()) done++;
    if(!this.isEmptyTopContent()) done++;
    // Seventh item: use rates amount OR selected services as another completion signal if not already counted; fallback to preview reached
    const extra = (this.selectedServices.length>0 || this.amountValue>0 || this.brandLogoPreview);
    if(extra) done++;
    return done;
  }
  get allComplete(){ return this.progressDone >= this.progressTotal; }
  /** Returns the first step index that still needs user input to be considered complete. */
  private firstIncompleteStep(): number {
    // Map to step indices: 0 Basic, 1 Socials, 2 Collab, 3 Rates, 4 Contact
    if(this.isEmptyBasicInfo()) return 0;
    if(this.isEmptySocials()) return 1;
    if(this.isEmptyCollaborations()) return 2;
    if(this.isEmptyServicesRates()) return 3;
    if(this.isEmptyContact()) return 4;
    return 0;
  }
  continueToFirstIncomplete(){ this.activeStep = this.firstIncompleteStep(); this.emitTitle(); }
  /** Formats a short timestamp like "10:42 AM | Jan,05" with i18n safety fallback. */
  private formatTimestamp(d: Date){
    try{
      const opts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
      const time = new Intl.DateTimeFormat(undefined, opts).format(d);
      const month = d.toLocaleString(undefined, { month: 'short' });
      const day = d.getDate().toString().padStart(2,'0');
      return `${time} | ${month},${day}`;
    }catch{
      return d.toLocaleString();
    }
  }
}
