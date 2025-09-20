import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

/**
 * HomeComponent
 * -------------
 * Public landing page with language selector, login link, and role entry points.
 */
@Component({
  selector: 'bf-home-page',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor],
  template: `
    <div class="home-shell">
      <div class="left">
        <div class="brand">
          <div class="logo">
            <span class="b">B</span>
            <span class="word">Befluencer</span>
          </div>
          <div class="tagline">Be seen. Be paid.</div>
        </div>
      </div>
      <div class="right">
        <div class="topbar" role="navigation" aria-label="Welcome options">
          <a class="back-link" href="#" (click)="$event.preventDefault()">&larr; Back</a>
          <div class="lang-select dropdown" [class.open]="openLang">
            <div class="input-icon" (click)="toggleLang()" role="button" aria-haspopup="listbox" [attr.aria-expanded]="openLang">
              <input type="text" [value]="selectedLanguage" readonly aria-label="Language" />
              <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <ul class="dropdown-panel" *ngIf="openLang" role="listbox">
              <li *ngFor="let l of languages" (mousedown)="selectLang(l)" role="option">{{ l }}</li>
            </ul>
          </div>
        </div>

        <div class="right-content" role="main">
          <h1 class="welcome">Welcome to our ecosystem!</h1>
          <div class="login">Already have an account? <a routerLink="/login">Log in</a></div>
          <div class="iam">I am a</div>
          <div class="role-buttons">
            <button class="btn creator" routerLink="/signup/creator">Creator</button>
            <button class="btn brand">Brand</button>
          </div>
          <p class="terms">
            By signing up, you agree to the <a href="#" (click)="$event.preventDefault()">Terms of Service</a> and <a href="#" (click)="$event.preventDefault()">Privacy,<br> Policy</a>, including <a href="#" (click)="$event.preventDefault()">cookie use</a>.
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  openLang = false;
  languages = ['English UK','Français','Español','Deutsch','中文'];
  selectedLanguage = this.languages[0];

  /** Toggle the language dropdown panel. */
  toggleLang(){
    this.openLang = !this.openLang;
  }
  /** Select a language; future: persist in preferences or i18n service. */
  selectLang(l: string){
    this.selectedLanguage = l;
    this.openLang = false;
  }
}
