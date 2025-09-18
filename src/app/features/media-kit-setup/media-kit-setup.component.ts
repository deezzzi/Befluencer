import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { WizardStateService } from './wizard-state.service';
import { Subject, merge } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
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
  <div *ngIf="activeStep===0" class="step-content basic-info-step">
        <div class="profile-intro">
          <div class="avatar" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="#444" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.4-3.2 4.3-5 8-5s6.6 1.8 8 5"/></svg>

            <!-- <svg width="28" height="28" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M30 5C16.1925 5 5 16.1925 5 30C5 43.8075 16.1925 55 30 55C43.8075 55 55 43.8075 55 30C55 16.1925 43.8075 5 30 5Z" stroke="#1E1E1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.6777 45.865C10.6777 45.865 16.2502 38.75 30.0002 38.75C43.7502 38.75 49.3252 45.865 49.3252 45.865M30.0002 30C31.9894 30 33.897 29.2098 35.3035 27.8033C36.7101 26.3968 37.5002 24.4891 37.5002 22.5C37.5002 20.5109 36.7101 18.6032 35.3035 17.1967C33.897 15.7902 31.9894 15 30.0002 15C28.0111 15 26.1035 15.7902 24.6969 17.1967C23.2904 18.6032 22.5002 20.5109 22.5002 22.5C22.5002 24.4891 23.2904 26.3968 24.6969 27.8033C26.1035 29.2098 28.0111 30 30.0002 30Z" stroke="#1E1E1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg> -->

<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M30 5C16.1925 5 5 16.1925 5 30C5 43.8075 16.1925 55 30 55C43.8075 55 55 43.8075 55 30C55 16.1925 43.8075 5 30 5Z" stroke="#1E1E1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.6777 45.865C10.6777 45.865 16.2502 38.75 30.0002 38.75C43.7502 38.75 49.3252 45.865 49.3252 45.865M30.0002 30C31.9894 30 33.897 29.2098 35.3035 27.8033C36.7101 26.3968 37.5002 24.4891 37.5002 22.5C37.5002 20.5109 36.7101 18.6032 35.3035 17.1967C33.897 15.7902 31.9894 15 30.0002 15C28.0111 15 26.1035 15.7902 24.6969 17.1967C23.2904 18.6032 22.5002 20.5109 22.5002 22.5C22.5002 24.4891 23.2904 26.3968 24.6969 27.8033C26.1035 29.2098 28.0111 30 30.0002 30Z" stroke="#1E1E1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.72 16.64C6.97461 16.5657 7.24829 16.5957 7.48083 16.7232C7.71338 16.8507 7.88574 17.0654 7.96 17.32C8.03426 17.5746 8.00434 17.8483 7.87681 18.0808C7.74929 18.3134 7.53461 18.4857 7.28 18.56C6.78 18.706 6.42 18.86 6.189 19C6.427 19.143 6.803 19.303 7.325 19.452C8.48 19.782 10.133 20 12 20C13.867 20 15.52 19.782 16.675 19.452C17.198 19.303 17.573 19.143 17.811 19C17.581 18.86 17.221 18.706 16.721 18.56C16.4704 18.4825 16.2603 18.3096 16.136 18.0786C16.0117 17.8476 15.9831 17.577 16.0564 17.3251C16.1298 17.0733 16.2991 16.8603 16.528 16.7321C16.7569 16.604 17.0269 16.5709 17.28 16.64C17.948 16.835 18.56 17.085 19.03 17.406C19.465 17.705 20 18.226 20 19C20 19.783 19.452 20.308 19.01 20.607C18.532 20.929 17.907 21.18 17.224 21.375C15.846 21.77 14 22 12 22C10 22 8.154 21.77 6.776 21.375C6.093 21.18 5.468 20.929 4.99 20.607C4.548 20.307 4 19.783 4 19C4 18.226 4.535 17.705 4.97 17.406C5.44 17.085 6.052 16.835 6.72 16.64ZM12 7.5C10.46 7.5 9.498 9.167 10.268 10.5C10.625 11.119 11.285 11.5 12 11.5C13.54 11.5 14.502 9.833 13.732 8.5C13.5565 8.19597 13.304 7.9435 13 7.76796C12.6959 7.59243 12.3511 7.50001 12 7.5Z" fill="#ABABAB"/>
<path opacity="0.3" d="M12 2C13.9891 2 15.8968 2.79018 17.3033 4.1967C18.7098 5.60322 19.5 7.51088 19.5 9.5C19.5 12.068 18.1 14.156 16.65 15.64C16.0736 16.2239 15.4542 16.7638 14.797 17.255C14.203 17.701 12.845 18.537 12.845 18.537C12.5874 18.6834 12.2963 18.7604 12 18.7604C11.7037 18.7604 11.4126 18.6834 11.155 18.537C10.4811 18.1462 9.82938 17.7182 9.203 17.255C8.5458 16.7638 7.9264 16.2239 7.35 15.64C5.9 14.156 4.5 12.068 4.5 9.5C4.5 7.51088 5.29018 5.60322 6.6967 4.1967C8.10322 2.79018 10.0109 2 12 2Z" fill="#ABABAB"/>
</svg>
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
              <div class="icon" aria-hidden="true" [innerHTML]="p.iconSafe || p.icon"></div>
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
                  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse opacity="0.1" cx="50" cy="97" rx="50" ry="3" fill="#ABABAB"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M76.4199 11.7742C76.4199 10.3192 77.5995 9.13965 79.0545 9.13965C80.5096 9.13965 81.6891 10.3192 81.6891 11.7742V17.1941C81.6891 18.6491 80.5096 19.8286 79.0545 19.8286C77.5995 19.8286 76.4199 18.6491 76.4199 17.1941V11.7742ZM79.0545 11.1396C78.704 11.1396 78.4199 11.4238 78.4199 11.7742V17.1941C78.4199 17.5445 78.704 17.8286 79.0545 17.8286C79.405 17.8286 79.6891 17.5445 79.6891 17.1941V11.7742C79.6891 11.4238 79.405 11.1396 79.0545 11.1396ZM20 29C20 24.0294 24.0294 20 29 20H71C75.9706 20 80 24.0294 80 29V62.3222C86.2904 63.6955 91 69.2978 91 76C91 83.732 84.732 90 77 90C70.658 90 65.3009 85.783 63.5798 80H29C24.0294 80 20 75.9706 20 71V29ZM63.1418 78C63.0483 77.3468 63 76.679 63 76C63 72.0826 64.6089 68.541 67.202 66H32C28.6863 66 26 63.3137 26 60V32C26 28.6863 28.6863 26 32 26H68C71.3137 26 74 28.6863 74 32V60C74 60.8712 73.8143 61.6991 73.4804 62.4461C74.6049 62.1549 75.7844 62 77 62C77.3362 62 77.6697 62.0119 78 62.0352V29C78 25.134 74.866 22 71 22H29C25.134 22 22 25.134 22 29V71C22 74.866 25.134 78 29 78H63.1418ZM32 28C29.7909 28 28 29.7909 28 32V54.3844L35.691 46.4469C38.0485 44.0138 41.9515 44.0138 44.309 46.4469L51.1407 53.4975C52.2005 54.5913 53.9118 54.7174 55.1205 53.7907L59.3494 50.5485C61.5031 48.8974 64.4969 48.8974 66.6506 50.5485L72 54.6497V32C72 29.7909 70.2091 28 68 28H32ZM60.6834 42.6296C60.6834 44.9307 58.8231 46.7962 56.5282 46.7962C54.2334 46.7962 52.373 44.9307 52.373 42.6296C52.373 40.3284 54.2334 38.4629 56.5282 38.4629C58.8231 38.4629 60.6834 40.3284 60.6834 42.6296ZM82.1533 22.6346C82.1533 21.1795 83.3329 20 84.7879 20H90.2077C91.6628 20 92.8423 21.1795 92.8423 22.6346C92.8423 24.0896 91.6628 25.2692 90.2077 25.2692H84.7879C83.3329 25.2692 82.1533 24.0896 82.1533 22.6346ZM84.7879 22C84.4374 22 84.1533 22.2841 84.1533 22.6346C84.1533 22.9851 84.4374 23.2692 84.7879 23.2692H90.2077C90.5582 23.2692 90.8423 22.9851 90.8423 22.6346C90.8423 22.2841 90.5582 22 90.2077 22H84.7879ZM65 76C65 69.3726 70.3726 64 77 64C83.6274 64 89 69.3726 89 76C89 82.6274 83.6274 88 77 88C70.3726 88 65 82.6274 65 76ZM74.5 69.5C74.5 68.1193 75.6193 67 77 67C78.3807 67 79.5 68.1193 79.5 69.5V75.5C79.5 76.8807 78.3807 78 77 78C75.6193 78 74.5 76.8807 74.5 75.5V69.5ZM77 69C76.7239 69 76.5 69.2239 76.5 69.5V75.5C76.5 75.7761 76.7239 76 77 76C77.2761 76 77.5 75.7761 77.5 75.5V69.5C77.5 69.2239 77.2761 69 77 69ZM77 85C75.6193 85 74.5 83.8807 74.5 82.5C74.5 81.1193 75.6193 80 77 80C78.3807 80 79.5 81.1193 79.5 82.5C79.5 83.8807 78.3807 85 77 85ZM76.5 82.5C76.5 82.7762 76.7239 83 77 83C77.2761 83 77.5 82.7762 77.5 82.5C77.5 82.2239 77.2761 82 77 82C76.7239 82 76.5 82.2239 76.5 82.5Z" fill="#ABABAB"/>
</svg>
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
  <div *ngIf="activeStep===4" class="contact-step contact-info-step">
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
                <div class="time">{{ lastUpdatedStr || '—' }}</div>
              </div>
              <div class="divider-vert" aria-hidden="true"></div>
              <div class="status-section">
                <div class="status-line">
                  <span class="status-icon" aria-hidden="true">
                    <svg *ngIf="allComplete; else inProg" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6.5 5.2 9 9 3"/></svg>
                    <ng-template #inProg>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="#fff" xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="4" r="4"/></svg>
                    </ng-template>
                  </span>
                  <span class="status-label">Status: <strong>{{ allComplete ? 'Finished' : 'In Progress' }}</strong></span>
                </div>
                <div class="progress-line">{{ progressDone }}/{{ progressTotal }} Completed</div>
              </div>
              <button *ngIf="!allComplete; else editBtn" type="button" class="edit-kit-btn" (click)="continueToFirstIncomplete()">Continue</button>
              <ng-template #editBtn>
                <button type="button" class="edit-kit-btn" (click)="jump(0)">Edit Kit</button>
              </ng-template>
            </div>
          </div>

          <!-- Previous Collaborations -->
          <div class="preview-card collabs-card area-collabs">
            <div class="card-head"><h3>Previous Collaborations</h3><a href="#" class="view-link" (click)="$event.preventDefault()">View all ▸</a></div>
            <ng-container *ngIf="!isEmptyCollaborations(); else collabEmpty">
              <ul class="collab-list">
                <li class="collab-item" *ngFor="let c of previewCollaborations | slice:0:3; let i = index">
                  <div class="logo-box" [ngClass]="'logo-'+i" aria-hidden="true"></div>
                  <div class="c-meta">
                    <div class="reach" *ngIf="c.reach">{{ c.reach }}</div>
                    <div class="title">{{ c.title }}</div>
                  </div>
                </li>
              </ul>
            </ng-container>
            <ng-template #collabEmpty>
              <div class="empty-state">
                <div class="icon" aria-hidden="true">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M7 7V4h10v3"/><path d="M7 14h4"/><path d="M7 11h7"/></svg>
                </div>
                <div class="title">No Previous Collaborations</div>
                <div class="desc">You do not have any previous collaboration information yet. Proceed to add information.</div>
              </div>
            </ng-template>
          </div>

          <!-- Services & Rates -->
            <div class="preview-card services-card area-services">
            <div class="card-head"><h3>Services & Rates</h3><button type="button" class="icon-btn" (click)="jump(3)" aria-label="Edit Services & Rates"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/></svg></button></div>
            <ng-container *ngIf="!isEmptyServicesRates(); else servicesEmpty">
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
                    <li *ngIf="ratesForm.value.chargingRate!=='negotiable' && amountValue">{{ ratesForm.value.currency }} {{ amountValue | number:'1.2-2' }} {{ readableRate(ratesForm.value.chargingRate || null) }}</li>
                    <li *ngIf="amountValue && ratesForm.value.chargingRate==='per_post'">{{ ratesForm.value.currency }} {{ (amountValue * 15) | number:'1.2-2' }} per package</li>
                    <li *ngIf="amountValue && ratesForm.value.chargingRate==='per_package'">{{ ratesForm.value.currency }} {{ (amountValue / 15) | number:'1.2-2' }} per post</li>
                    <li *ngIf="!amountValue && ratesForm.value.chargingRate!=='negotiable'" class="empty">—</li>
                  </ul>
                </div>
              </div>
            </ng-container>
            <ng-template #servicesEmpty>
              <div class="empty-state">
                <div class="icon" aria-hidden="true">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M8 13h8M8 17h6"/></svg>
                </div>
                <div class="title">No Services or Rates Added</div>
                <div class="desc">Your Services will be displayed here. Proceed to add.</div>
              </div>
            </ng-template>
          </div>

          <!-- Basic Info -->
          <div class="preview-card basic-card area-basic">
            <div class="card-head"><h3>Basic Info</h3><button type="button" class="icon-btn" (click)="jump(0)" aria-label="Edit Basic Info"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/></svg></button></div>
            <ng-container *ngIf="!isEmptyBasicInfo(); else basicEmpty">
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
            </ng-container>
            <ng-template #basicEmpty>
              <div class="empty-state">
                <div class="icon" aria-hidden="true">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M4 20c1.4-3.2 4.3-5 8-5s6.6 1.8 8 5"/></svg>
                </div>
                <div class="title">No Basic Information</div>
                <div class="desc">You do not have any basic information yet. Proceed to add your information.</div>
              </div>
            </ng-template>
          </div>

          <!-- Contact Information -->
          <div class="preview-card contact-card area-contact">
            <div class="card-head"><h3>Contact Information</h3><button type="button" class="icon-btn" (click)="jump(4)" aria-label="Edit Contact Info"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/></svg></button></div>
            <ng-container *ngIf="!isEmptyContact(); else contactEmpty">
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
            </ng-container>
            <ng-template #contactEmpty>
              <div class="empty-state">
                <div class="icon" aria-hidden="true">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="3"/><path d="M3 8h18"/><circle cx="8" cy="12" r="2"/><path d="M12 16h6"/></svg>
                </div>
                <div class="title">No Contact Information Added</div>
                <div class="desc">You do not have any contact information to show here. Kindly proceed to add your contacts.</div>
              </div>
            </ng-template>
          </div>

          <!-- Socials & Stat -->
          <div class="preview-card socials-card area-socials">
            <div class="card-head"><h3>Socials & Stat</h3><button type="button" class="icon-btn" (click)="jump(1)" aria-label="Edit Socials"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/></svg></button></div>
            <ng-container *ngIf="!isEmptySocials(); else socialsEmpty">
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
            </ng-container>
            <ng-template #socialsEmpty>
              <div class="empty-state">
                <div class="icon" aria-hidden="true">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 12h10"/><path d="M7 8h6"/></svg>
                </div>
                <div class="title">No Socials Linked</div>
                <div class="desc">Proceed to link your social media account.</div>
              </div>
            </ng-template>
          </div>

          <!-- Top Content -->
          <div class="preview-card content-card area-topcontent">
            <div class="card-head"><h3>Top Content</h3><a href="#" class="view-link" (click)="$event.preventDefault()">View all ▸</a></div>
            <ng-container *ngIf="!isEmptyTopContent(); else topEmpty">
              <div class="top-content-grid precise">
                <ng-container *ngFor="let c of topContents | slice:0:3; let i=index">
                  <div class="content-thumb" [ngClass]="'c-'+i"></div>
                </ng-container>
                <div class="content-thumb second-row" *ngIf="topContents.length>3" [ngClass]="'c-3'"></div>
                <div class="add-contents" (click)="addContent()">+ Add Contents</div>
              </div>
            </ng-container>
            <ng-template #topEmpty>
              <div class="empty-state">
                <div class="icon" aria-hidden="true">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 15l4-4 3 3 4-4 4 4"/></svg>
                </div>
                <div class="title">No Contents Uploaded</div>
                <div class="desc">You do not have any contents to show here. Kindly proceed to add some videos.</div>
              </div>
            </ng-template>
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
export class MediaKitSetupComponent implements OnInit, OnDestroy {
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
  platforms: Array<{ id:string; name:string; labelLower:string; connected:boolean; icon:string; iconSafe?: SafeHtml }> = [
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
  // Top content placeholder items (would contain thumbnail URLs in future)
  topContents: { id:number }[] = [];
  // Placeholder previous collaborations list (would be aggregated from multiple form submissions later)
  previewCollaborations: { title: string; reach: string }[] = [];
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
  private destroy$ = new Subject<void>();
  // Progress / last updated
  progressTotal = 7;
  lastUpdatedStr: string | null = null;

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
        this.topContents = draft.topContents.slice();
      }
      this.emitTitle();
    }

    // Autosave on changes (debounced)
    merge(
      this.form.valueChanges,
      this.collabForm.valueChanges,
      this.ratesForm.valueChanges,
      this.contactForm.valueChanges
    ).pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(() => this.saveDraftInternal(false));
  }
  private emitTitle(){
    const title = this.activeStep === this.steps.length-1 ? 'Media Kit Preview' : 'Media Kit Setup';
    this.titleChange.emit(title);
    // Optional: also set document title
    if(typeof document !== 'undefined') document.title = title;
  }
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
  prev(){
    if(this.activeStep>0){
      this.activeStep--;
      this.submitted = false; // reset error flag when moving steps
      this.closeAllDropdowns();
      this.emitTitle();
      this.saveDraftInternal(false);
    }
  }
  saveDraft(){ this.saveDraftInternal(true); }
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
  jump(i: number){ if(i < this.activeStep){ this.activeStep = i; this.emitTitle(); this.saveDraftInternal(false); } }
  constructor(private router: Router, private sanitizer: DomSanitizer, private state: WizardStateService){}
  finish(){
    this.submitted = true;
    this.emitTitle();
    // Navigate to saved page
    this.router.navigate(['/media-kit/saved']);
  }
  ngOnDestroy(){ this.destroy$.next(); this.destroy$.complete(); }
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
  private closeAllDropdowns(){
    this.openAudience = false;
    this.openLanguages = false;
    this.openBrands = false;
    this.openCurrency = false;
    this.openBookingAvailability = false;
    this.openSocialsAccount = false;
    this.openPreferredContact = false;
  }
  openPreview(e: Event){
    e.preventDefault();
    this.activeStep = this.steps.length - 1;
    this.submitted = false;
    this.closeAllDropdowns();
    this.emitTitle();
    this.saveDraftInternal(false);
  }
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
  // ---------- Empty-state helpers & progress ----------
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
  isEmptyTopContent(){ return !(this.topContents && this.topContents.length > 0); }
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
