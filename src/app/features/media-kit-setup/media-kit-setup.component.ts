import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgFor, NgIf, NgClass, SlicePipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'bf-media-kit-setup',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, NgClass, SlicePipe, DecimalPipe, NgTemplateOutlet],
  template: `
  <div class="mk-setup-wrapper" [class.preview-mode]="activeStep===steps.length-1">
    <div class="wizard-card" role="form" aria-labelledby="mk-stepper">
  <!-- Stepper with connectors (hidden on preview step) -->
  <ol *ngIf="activeStep !== steps.length-1" id="mk-stepper" class="steps" aria-label="Setup steps">
        <li *ngFor="let s of steps; let i = index"
            [class.active]="i===activeStep"
            [class.completed]="i < activeStep"
            (click)="jump(i)"
            [attr.aria-current]="i===activeStep ? 'step' : null"
            [class.clickable]="i < activeStep">
          <div class="row">
            <span class="circle" aria-hidden="true">{{ i+1 }}</span>
            <span class="label">{{ s.label }}</span>
            <span class="connector" aria-hidden="true"></span>
            <span *ngIf="i < steps.length-1" class="connector-space" aria-hidden="true"></span>
          </div>
            <div class="desc" [innerHTML]="s.desc"></div>
        </li>
      </ol>

      <!-- Heading line (replaced on preview) -->
      <ng-container *ngIf="activeStep !== steps.length-1; else previewHeader">
        <div class="section-bar">
          <h2 class="section-title">{{ steps[activeStep].label }}</h2>
          <div class="rule" aria-hidden="true"></div>
        </div>
        <div class="preview-row">
          <a class="preview-link" href="#" (click)="openPreview($event)">Preview <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 5c7.633 0 10 7 10 7s-2.367 7-10 7-10-7-10-7 2.367-7 10-7Z"/></svg></a>
        </div>
      </ng-container>
      <ng-template #previewHeader>
        <!-- <div class="preview-header">
          <h1 class="preview-title">Media Kit Preview</h1>
        </div> -->
      </ng-template>

      <!-- Step 1 form -->
      <div *ngIf="activeStep===0" class="step-content">
        <div class="profile-intro">
          <div class="avatar" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="#444" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.4-3.2 4.3-5 8-5s6.6 1.8 8 5"/></svg>
          </div>
          <div class="id-block">
            <div class="name">John Doe</div>
            <div class="role">Creator</div>
          </div>
        </div>
        <form [formGroup]="form" class="form-grid" (ngSubmit)="next()">
          <label class="field">
            <span>First Name *</span>
            <input formControlName="firstName" type="text" placeholder="John" />
            <small class="err" *ngIf="submitted && form.controls.firstName.invalid">Required</small>
          </label>
          <label class="field">
            <span>Location *</span>
            <div class="input-icon">
              <input formControlName="location" type="text" placeholder="Choose location" />
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <small class="err" *ngIf="submitted && form.controls.location.invalid">Required</small>
          </label>
          <label class="field">
            <span>Last Name *</span>
            <input formControlName="lastName" type="text" placeholder="Doe" />
            <small class="err" *ngIf="submitted && form.controls.lastName.invalid">Required</small>
          </label>
          <label class="field">
            <span>Audience Base</span>
            <div class="dropdown" [class.open]="openAudience">
              <div class="input-icon" (click)="toggleAudience()">
                <input formControlName="audienceBase" type="text" placeholder="Select area" readonly />
                <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </div>
              <ul class="dropdown-panel" *ngIf="openAudience">
                <li *ngFor="let c of countries" (mousedown)="selectAudience(c)">{{ c }}</li>
              </ul>
            </div>
          </label>
          <label class="field">
            <span>Stage Name/Alias</span>
            <input formControlName="alias" type="text" placeholder="Doe" />
          </label>
          <label class="field">
            <span>Language(s)</span>
            <div class="dropdown" [class.open]="openLanguages">
              <div class="input-icon" (click)="toggleLanguages()">
                <input formControlName="languages" type="text" placeholder="Select language" readonly />
                <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </div>
              <ul class="dropdown-panel" *ngIf="openLanguages">
                <li *ngFor="let l of languagesList" (mousedown)="selectLanguage(l)">{{ l }}</li>
              </ul>
            </div>
          </label>
          <label class="field span">
            <span>Bio</span>
            <textarea class="bio-input" formControlName="bio" rows="1" placeholder="Enter Text"></textarea>
          </label>
        </form>
      </div>

      <!-- Step 2: Socials & Stats -->
      <div *ngIf="activeStep===1" class="socials-step">
        <div class="platform-grid" role="list">
          <div class="platform-card" *ngFor="let p of platforms" role="listitem" [class.connected]="p.connected">
            <div class="top-row">
              <div class="icon" aria-hidden="true" [innerHTML]="p.icon"></div>
              <div class="meta">
                <div class="name">{{ p.name }}</div>
                <div class="hint">Connect to your {{ p.labelLower }}</div>
              </div>
            </div>
            <div class="actions-row">
              <button type="button" class="connect-btn" (click)="toggleConnect(p)" [attr.aria-pressed]="p.connected">
                <span *ngIf="!p.connected">Connect</span>
                <span *ngIf="p.connected">Connected</span>
                <svg class="link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.29 1.3"/><path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.29-1.3"/></svg>
              </button>
              <button type="button" class="edit-btn" (click)="editPlatform(p)" [attr.aria-label]="'Edit ' + p.name + ' details'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Collaborations -->
      <div *ngIf="activeStep===2" class="collab-step">
        <form [formGroup]="collabForm" class="collab-grid" (ngSubmit)="next()">
          <div class="brand-column">
            <div class="brand-upload" (click)="triggerBrandFile()" role="button" tabindex="0" (keydown.enter)="triggerBrandFile()" aria-label="Add brand logo">
              <ng-container *ngIf="!brandLogoPreview; else logoPrev">
                <div class="placeholder-icon" aria-hidden="true">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 13l3-3 3 3 4-4"/><circle cx="9" cy="9" r="1"/></svg>
                </div>
                <button type="button" class="add-logo-btn">Add Brand Logo</button>
              </ng-container>
              <ng-template #logoPrev>
                <img [src]="brandLogoPreview" alt="Brand logo preview" class="logo-preview"/>
                <button type="button" class="change-logo-btn">Change Logo</button>
              </ng-template>
              <input #brandFile type="file" accept="image/*" (change)="onBrandLogoSelected($event)" hidden />
            </div>
            <label class="field brand-select-wrapper">
              <span>Select Brands *</span>
              <small class="sub">Add your previous brand collaborations</small>
              <div class="dropdown" [class.open]="openBrands">
                <div class="input-icon" (click)="toggleBrands()">
                  <input formControlName="brand" type="text" placeholder="Select brand" readonly />
                  <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                </div>
                <ul class="dropdown-panel" *ngIf="openBrands">
                  <li *ngFor="let b of brandList" (mousedown)="selectBrand(b)">{{ b }}</li>
                </ul>
              </div>
            </label>
          </div>
          <div class="form-column">
            <label class="field">
              <span>Campaign Name *</span>
              <input formControlName="campaignName" type="text" placeholder="What did you call this campaign?" />
              <small class="err" *ngIf="submitted && collabForm.controls.campaignName.invalid">Required</small>
            </label>
            <label class="field">
              <span>Campaign Description *</span>
              <textarea formControlName="campaignDescription" rows="3" placeholder="Briefly describe this campaign"></textarea>
              <small class="err" *ngIf="submitted && collabForm.controls.campaignDescription.invalid">Required</small>
            </label>
            <label class="field">
              <span>Campaign Reach</span>
              <input formControlName="campaignReach" type="text" placeholder="What is the total audiences amounted ?" />
            </label>
            <label class="field">
              <span>Campaign Engagement</span>
              <input formControlName="campaignEngagement" type="text" placeholder="How many audience interacted with your campaign ?" />
            </label>
          </div>
        </form>
      </div>

      <!-- Step 4: Rates & Services -->
      <div *ngIf="activeStep===3" class="rates-step">
        <form class="rates-layout" [formGroup]="ratesForm" novalidate>
          <div class="services-left">
            <h3 class="section-sub">Choose Services Offered</h3>
            <div class="services-grid" role="list">
        <div *ngFor="let s of servicesList" class="service-card" role="checkbox" tabindex="0"
          [class.selected]="isServiceSelected(s.id)" [attr.aria-checked]="isServiceSelected(s.id)"
                   (click)="toggleService(s.id)" (keydown.enter)="toggleService(s.id)">
                <div class="card-head">
                  <span class="check" aria-hidden="true">
                    <svg *ngIf="isServiceSelected(s.id)" width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6.5 5.2 9 9 3"/></svg>
                  </span>
                  <span class="title">{{ s.title }}</span>
                </div>
                <p class="desc">{{ s.desc }}</p>
              </div>
            </div>
          </div>
          <div class="rates-right">
            <h3 class="section-sub">Select Charging Rate</h3>
            <ul class="rate-options" role="radiogroup" aria-label="Charging rate">
              <li *ngFor="let r of chargingRates" (click)="selectChargingRate(r.id)" (keydown.enter)="selectChargingRate(r.id)" role="radio" tabindex="0" [attr.aria-checked]="ratesForm.value.chargingRate===r.id">
                <span class="radio-box" [class.on]="ratesForm.value.chargingRate===r.id">
                  <svg *ngIf="ratesForm.value.chargingRate===r.id" width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6.5 5.2 9 9 3" />
                  </svg>
                </span>
                <span class="label">{{ r.label }}</span>
              </li>
            </ul>
            <div class="enter-amount-block">
              <h4 class="amount-head">Enter Amount</h4>
              <div class="amount-row">
        <label class="currency dropdown" [class.open]="openCurrency">
                <div class="input-icon" (click)="toggleCurrency()">
          <input type="text" formControlName="currency" readonly />
                  <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                </div>
                <ul class="dropdown-panel" *ngIf="openCurrency">
                  <li *ngFor="let c of currencyList" (mousedown)="selectCurrency(c)">{{ c }}</li>
                </ul>
              </label>
              <label class="field amount-field">
                <input type="text" formControlName="amount" placeholder="0.00" />
              </label>
              </div>
            </div>
          </div>
    </form>
      </div>

      <!-- Step 5: Contact Info -->
      <div *ngIf="activeStep===4" class="contact-step">
        <form [formGroup]="contactForm" class="form-grid" novalidate>
          <!-- Left Column -->
          <label class="field">
            <span>Email Address *</span>
            <input formControlName="email" type="email" placeholder="Enter your active email address" />
            <small class="err" *ngIf="submitted && contactForm.controls.email.invalid">Required</small>
          </label>
          <label class="field">
            <span>Booking Availability *</span>
            <div class="dropdown" [class.open]="openBookingAvailability">
              <div class="input-icon" (click)="toggleBookingAvailability()">
                <input formControlName="bookingAvailability" type="text" placeholder="When are you typically available for bookings?" readonly />
                <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </div>
              <ul class="dropdown-panel" *ngIf="openBookingAvailability">
                <li *ngFor="let opt of bookingAvailabilityOptions" (mousedown)="selectBookingAvailability(opt)">{{ opt }}</li>
              </ul>
            </div>
            <small class="err" *ngIf="submitted && contactForm.controls.bookingAvailability.invalid">Required</small>
          </label>
          <label class="field">
            <span>Phone Number *</span>
            <input formControlName="phone" type="text" placeholder="Add your phone contact number" />
            <small class="err" *ngIf="submitted && contactForm.controls.phone.invalid">Required</small>
          </label>
          <label class="field">
            <span>Socials Account</span>
            <div class="dropdown" [class.open]="openSocialsAccount">
              <div class="input-icon" (click)="toggleSocialsAccount()">
                <input formControlName="socialsAccount" type="text" placeholder="Which social platforms do you actively use for collaborations?" readonly />
                <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </div>
              <ul class="dropdown-panel" *ngIf="openSocialsAccount">
                <li *ngFor="let s of socialsAccountOptions" (mousedown)="selectSocialsAccount(s)">{{ s }}</li>
              </ul>
            </div>
          </label>
          <label class="field">
            <span>WhatsApp Contact</span>
            <input formControlName="whatsapp" type="text" placeholder="Add your WhatsApp contact number" />
          </label>
          <label class="field">
            <span>Preferred Contact Method</span>
            <div class="dropdown" [class.open]="openPreferredContact">
              <div class="input-icon" (click)="togglePreferredContact()">
                <input formControlName="preferredMethod" type="text" placeholder="Select your most active contact method" readonly />
                <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </div>
              <ul class="dropdown-panel" *ngIf="openPreferredContact">
                <li *ngFor="let m of preferredContactMethods" (mousedown)="selectPreferredContact(m)">{{ m }}</li>
              </ul>
            </div>
          </label>
          <label class="field">
            <span>Website/Booking Site</span>
            <input formControlName="website" type="text" placeholder="eg. www.jdbookings.com" />
          </label>
          <label class="field">
            <span>Additional Notes</span>
            <textarea formControlName="notes" rows="3" placeholder="Enter Text"></textarea>
          </label>
        </form>
      </div>
    
  <!-- Other steps placeholder (future not implemented) -->
  <div class="placeholder-step" *ngIf="activeStep>4 && activeStep<steps.length-1">
        <p class="placeholder-copy">Form fields for "{{ steps[activeStep].label }}" pending implementation.</p>
      </div>
  <!-- Reusable preview grid template -->
      <ng-template #previewGrid>
        <div class="preview-grid design-layout">
          <!-- Summary / Status Card -->
          <div class="preview-card summary-card area-summary">
            <div class="summary-inner">
              <div class="last-updated">
                <div class="label">Last Updated</div>
                <div class="time">12:00 PM | Apr,08</div>
              </div>
              <div class="divider-vert" aria-hidden="true"></div>
              <div class="status-section">
                <div class="status-line">
                  <span class="status-icon" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6.5 5.2 9 9 3"/></svg>
                  </span>
                  <span class="status-label">Status: <strong>Finished</strong></span>
                </div>
                <!-- <div class="progress-line">{{ steps.length }}/{{ steps.length }} Completed</div> -->
                <div class="progress-line">7/7 Completed</div>
              </div>
              <button type="button" class="edit-kit-btn" (click)="jump(0)">Edit Kit</button>
            </div>
          </div>

          <!-- Previous Collaborations -->
          <div class="preview-card collabs-card area-collabs">
            <div class="card-head"><h3>Previous Collaborations</h3><a href="#" class="view-link" (click)="$event.preventDefault()">View all ▸</a></div>
            <ul class="collab-list">
              <li class="collab-item" *ngFor="let c of previewCollaborations | slice:0:3; let i = index">
                <div class="logo-box" [ngClass]="'logo-'+i" aria-hidden="true"></div>
                <div class="c-meta">
                  <div class="reach" *ngIf="c.reach">{{ c.reach }}</div>
                  <div class="title">{{ c.title }}</div>
                </div>
              </li>
              <li class="collab-item empty" *ngIf="(previewCollaborations?.length||0)===0">No collaborations added.</li>
            </ul>
          </div>

          <!-- Services & Rates -->
          <div class="preview-card services-card area-services">
            <div class="card-head"><h3>Services & Rates</h3><button type="button" class="icon-btn" (click)="jump(3)" aria-label="Edit Services & Rates">✎</button></div>
            <div class="services-rates">
              <div class="svc-col">
                <div class="col-head">Services</div>
                <ul class="plain-list">
                  <ng-container *ngFor="let s of servicesList">
                    <li *ngIf="isServiceSelected(s.id)">{{ s.title }}</li>
                  </ng-container>
                  <li *ngIf="selectedServices.length===0" class="empty">—</li>
                </ul>
              </div>
              <div class="rate-col">
                <div class="col-head">Rates</div>
                <ul class="plain-list">
                  <li *ngIf="ratesForm.value.chargingRate==='negotiable'">Negotiable</li>
                  <!-- If a concrete amount entered show primary rate -->
                  <li *ngIf="ratesForm.value.chargingRate!=='negotiable' && amountValue">{{ ratesForm.value.currency }} {{ amountValue | number:'1.2-2' }} {{ readableRate(ratesForm.value.chargingRate || null) }}</li>
                  <!-- Provide a derived secondary rate example when user supplied amount (mirrors design having two lines) -->
                  <li *ngIf="amountValue && ratesForm.value.chargingRate==='per_post'">{{ ratesForm.value.currency }} {{ (amountValue * 15) | number:'1.2-2' }} per package</li>
                  <li *ngIf="amountValue && ratesForm.value.chargingRate==='per_package'">{{ ratesForm.value.currency }} {{ (amountValue / 15) | number:'1.2-2' }} per post</li>
                  <li *ngIf="!amountValue && ratesForm.value.chargingRate!=='negotiable'" class="empty">—</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Basic Info -->
          <div class="preview-card basic-card area-basic">
            <div class="card-head"><h3>Basic Info</h3><button type="button" class="icon-btn" (click)="jump(0)" aria-label="Edit Basic Info">✎</button></div>
            <div class="profile-line">
              <div class="avatar small" aria-hidden="true">JD</div>
              <div class="person"><div class="name">{{ form.value.firstName }} {{ form.value.lastName }}</div><div class="role">Creator</div></div>
            </div>
            <div class="bio-label" *ngIf="form.value.bio">Bio</div>
            <div class="bio" *ngIf="form.value.bio">{{ form.value.bio }}</div>
            <dl class="kv">
              <div><dt>Location</dt><dd>{{ form.value.location || '—' }}</dd></div>
              <div><dt>Content Niche (s)</dt><dd>Tech Review</dd></div>
              <div><dt>Languages (s)</dt><dd>{{ form.value.languages || 'English' }}</dd></div>
              <div><dt>Stage Name</dt><dd>{{ form.value.alias || '—' }}</dd></div>
            </dl>
          </div>

          <!-- Contact Information -->
          <div class="preview-card contact-card area-contact">
            <div class="card-head"><h3>Contact Information</h3><button type="button" class="icon-btn" (click)="jump(4)" aria-label="Edit Contact Info">✎</button></div>
            <dl class="kv tight">
              <div><dt>Email Address</dt><dd>{{ contactForm.value.email || '—' }}</dd></div>
              <div><dt>Phone Number (s)</dt><dd>{{ contactForm.value.phone || '—' }}</dd></div>
              <div><dt>Website/Booking site</dt><dd>
                <ng-container *ngIf="contactForm.value.website; else noSite">
                  <a class="site-link" href="{{ formatWebsite(contactForm.value.website) }}" target="_blank" rel="noopener">{{ contactForm.value.website }}</a>
                </ng-container>
                <ng-template #noSite>—</ng-template>
              </dd></div>
              <div><dt>Booking Availability</dt><dd>{{ contactForm.value.bookingAvailability || '—' }}</dd></div>
              <div><dt>Preferred Contact Method</dt><dd>{{ preferredContactDisplay() || '—' }}</dd></div>
              <div *ngIf="contactForm.value.whatsapp"><dt>WhatsApp Contact</dt><dd>{{ contactForm.value.whatsapp }}</dd></div>
              <div><dt>Additional Notes</dt><dd>{{ contactForm.value.notes || '—' }}</dd></div>
            </dl>
          </div>

          <!-- Socials & Stat -->
          <div class="preview-card socials-card area-socials">
            <div class="card-head"><h3>Socials & Stat</h3><button type="button" class="icon-btn" (click)="jump(1)" aria-label="Edit Socials">✎</button></div>
            <ul class="platform-stats alt">
              <li *ngFor="let p of platforms | slice:0:8" [class.connected]="p.connected">
                <span class="icon" [innerHTML]="p.icon" aria-hidden="true"></span>
                <div class="info">
                  <div class="top-line">
                    <span class="pname">{{ p.name }}</span>
                    <span class="ext" aria-hidden="true"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="m15 3 6 6M21 3h-6v6"/></svg></span>
                  </div>
                  <div class="metric" *ngIf="p.connected; else dash">{{ platformMetrics[p.id] || '—' }}</div>
                  <ng-template #dash><div class="metric empty">—</div></ng-template>
                </div>
              </li>
            </ul>
          </div>

          <!-- Top Content -->
          <div class="preview-card content-card area-topcontent">
            <div class="card-head"><h3>Top Content</h3><a href="#" class="view-link" (click)="$event.preventDefault()">View all ▸</a></div>
            <div class="top-content-grid precise">
              <!-- First row: 3 thumbs -->
              <ng-container *ngFor="let c of topContents | slice:0:3; let i=index">
                <div class="content-thumb" [ngClass]="'c-'+i"></div>
              </ng-container>
              <!-- Second row: next single thumb in column 1 -->
              <div class="content-thumb second-row" *ngIf="topContents.length>3" [ngClass]="'c-3'"></div>
              <div class="add-contents" (click)="addContent()">+ Add Contents</div>
            </div>
          </div>
        </div>
      </ng-template>

  <div class="preview-pane" *ngIf="activeStep===steps.length-1">
        <ng-container [ngTemplateOutlet]="previewGrid"></ng-container>
      </div>

      <!-- Actions (now always visible, with Save Media Kit on preview step) -->
      <div class="actions">
        <button type="button" class="back" [disabled]="activeStep===0" (click)="prev()"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg> Back</button>
        <button type="button" class="save" (click)="saveDraft()" *ngIf="activeStep < steps.length-1">Save For Later</button>
        <button type="button" class="next" (click)="next()" *ngIf="activeStep < steps.length-1">Next <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button>
        <button type="button" class="next" *ngIf="activeStep === steps.length-1" (click)="finish()">Save Media Kit</button>
      </div>
    </div>
  </div>

  <!-- Modal removed; navigation used instead -->
  `,
  styleUrls: ['./media-kit-setup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaKitSetupComponent implements OnInit {
  @Output() titleChange = new EventEmitter<string>();
  steps = [
    { label: 'Basic Information', desc: 'Tell us about yourself.' },
  { label: 'Socials & Stat', desc: 'Connect to your social<br>media accounts.' },
    { label: 'Collaborations', desc: 'Add your previous<br> experiences with brands.' },
    { label: 'Rates & Services', desc: 'Describe your services and <br>how you will like to be paid.' },
    { label: 'Contact Info', desc: 'How can brands reach you?' },
    { label: 'Preview', desc: 'You are all done. Review<br> and select your preferred <br>theme.' }
  ];
  activeStep = 0;
  submitted = false;
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
  platforms = [
  { id:'tiktok', name:'Tiktok', labelLower:'tiktok', connected:false, icon:`<svg width='24' height='24' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'><rect width='48' height='48' rx='10' fill='none'/><path d='M30.9 13.4c1.4 1.9 3.3 3.2 5.7 3.4v5.3c-2.1.2-4-.4-5.9-1.5v8.9c0 6.9-4.3 11-10.3 11-5.9 0-10.5-4.2-10.5-10.4 0-6.3 4.6-10.4 10.5-10.4.7 0 1.4.1 2 .2v5.5c-.5-.2-1.1-.3-1.8-.3-3 0-5 2.2-5 5 0 2.8 2 5 5 5 3.1 0 5.1-2.3 5.1-5.7V10.6h5.2c.1 1.1.5 2 1.1 2.8Z' fill='#010101'/><path d='M30.9 13.4c1.4 1.9 3.3 3.2 5.7 3.4v5.3c-2.1.2-4-.4-5.9-1.5v8.9c0 6.9-4.3 11-10.3 11-5.9 0-10.5-4.2-10.5-10.4 0-2.1.6-3.9 1.6-5.4-.5 1-.7 2.1-.7 3.3 0 6.2 4.6 10.4 10.5 10.4 6 0 10.3-4.2 10.3-11v-8.9c1.9 1.1 3.8 1.7 5.9 1.5v-2.5c-2.4-.2-4.3-1.5-5.7-3.4-.6-.8-1-1.7-1.1-2.8h-1c.1 1.1.5 2 1.1 2.8Z' fill='#FF004F'/><path d='M25.4 10.6v1.5c-.2 0-.5-.1-.7-.1-6 0-10.5 4.1-10.5 10.4 0 2 .5 3.7 1.4 5.1-1-1.5-1.6-3.3-1.6-5.4 0-6.3 4.6-10.4 10.5-10.4.3 0 .5 0 .9.1Z' fill='#25F4EE'/><path d='M36.6 16.8v1.4c-2.2.2-4.1-.4-6-1.5v1.4c1.9 1.1 3.8 1.7 6 1.5v-2.8Z' fill='#25F4EE'/><path d='M21.8 21.7c-.7 0-1.4.1-2 .3v1.5c.6-.2 1.3-.3 2-.3.7 0 1.2.1 1.8.3v-1.5c-.6-.2-1.1-.3-1.8-.3Z' fill='#25F4EE'/></svg>`},
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
  // Top content placeholder items (would contain thumbnail URLs in future)
  topContents: { id:number }[] = [ {id:1},{id:2},{id:3},{id:4},{id:5} ];
  // Placeholder previous collaborations list (would be aggregated from multiple form submissions later)
  previewCollaborations: { title: string; reach: string }[] = [
    { title:'MTN Ghana Router Review', reach:'12k Audiences Reached' },
    { title:'Samsung S25 Unbox', reach:'1k Audiences Reached' },
    { title:'Maxbeat Interview', reach:'7k Audiences Reached' }
  ];
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
  private _brandFileEl?: HTMLInputElement;
  servicesList = [
    { id:'sponsored', title:'Sponsored Posts', desc:'Promote a brand or product directly on your social media page as a paid post, tailored to your audience.' },
    { id:'reviews', title:'Product Reviews', desc:'Share your honest opinion about a product after using it — through a dedicated post, video, or story.' },
    { id:'coverage', title:'Event Coverage', desc:'Attend and cover a brand event or experience, sharing real-time or post-event content with your audience.' },
    { id:'ugc', title:'UGC Creation', desc:'Create high-quality content (photos or videos) that the brand can use on their own channels — without you posting it.' },
    { id:'giveaways', title:'Giveaways', desc:'Host a contest or giveaway on your platform to help a brand increase engagement, reach, and follower growth.' },
    { id:'ambassador', title:'Brand Ambassador', desc:'Form a long-term partnership with a brand, representing them through regular content, exclusive deals, or affiliate codes.' }
  ];
  selectedServices: string[] = [];
  chargingRates = [
    { id:'per_post', label:'Per post' },
    { id:'per_package', label:'Per package' },
    { id:'negotiable', label:'Negotiable' }
  ];
  ratesForm = new FormBuilder().group({
    chargingRate:['per_post'],
    currency:['GHC'],
    amount:['']
  });
  currencyList = ['GHC','USD','EUR','GBP','NGN'];
  openCurrency = false;
  /* Contact Info */
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
  ngOnInit(){ this.emitTitle(); }
  private emitTitle(){
    const title = this.activeStep === this.steps.length-1 ? 'Media Kit Preview' : 'Media Kit Setup';
    this.titleChange.emit(title);
    // Optional: also set document title
    if(typeof document !== 'undefined') document.title = title;
  }
  next(){ if(this.activeStep < this.steps.length-1){ this.activeStep++; this.emitTitle(); } }
  prev(){ if(this.activeStep>0){ this.activeStep--; this.emitTitle(); } }
  saveDraft(){ /* TODO: persist draft */ }
  jump(i: number){ if(i < this.activeStep){ this.activeStep = i; this.emitTitle(); } }
  constructor(private router: Router){}
  finish(){
    this.submitted = true;
    this.emitTitle();
    // Navigate to saved page
    this.router.navigate(['/media-kit/saved']);
  }
  openPreview(e: Event){ e.preventDefault(); /* TODO: open preview modal/pane */ }
  toggleAudience(){ this.openAudience = !this.openAudience; this.openLanguages = false; }
  toggleLanguages(){ this.openLanguages = !this.openLanguages; this.openAudience = false; }
  selectAudience(val: string){ this.form.patchValue({ audienceBase: val }); this.openAudience = false; }
  selectLanguage(val: string){ this.form.patchValue({ languages: val }); this.openLanguages = false; }
  toggleConnect(p: any){ p.connected = !p.connected; }
  editPlatform(p: any){ /* TODO: open edit modal */ }
  toggleBrands(){ this.openBrands = !this.openBrands; }
  selectBrand(b: string){ this.collabForm.patchValue({ brand: b }); this.openBrands = false; }
  triggerBrandFile(){ if(this._brandFileEl){ this._brandFileEl.click(); } }
  onBrandLogoSelected(e: Event){
    const input = e.target as HTMLInputElement;
    this._brandFileEl = input;
    if(input.files && input.files[0]){
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (ev)=>{ this.brandLogoPreview = ev.target?.result as string; };
      reader.readAsDataURL(file);
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
  get amountValue(): number {
    const raw = this.ratesForm.value.amount as any;
    const num = parseFloat(raw);
    return isNaN(num) ? 0 : num;
  }
  preferredContactDisplay(){
    const method = this.contactForm.value.preferredMethod;
    if(!method) return '';
    if(method.toLowerCase()==='whatsapp' && this.contactForm.value.whatsapp){
      return `Whatsapp (${this.contactForm.value.whatsapp})`;
    }
    return method;
  }
  formatWebsite(url: string){
    if(!url) return '';
    if(!/^https?:\/\//i.test(url)) return 'https://' + url;
    return url;
  }
  addContent(){
    const nextId = this.topContents.length + 1;
    this.topContents.push({ id: nextId });
  }
}
