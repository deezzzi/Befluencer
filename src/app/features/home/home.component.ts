import { Component, ChangeDetectionStrategy, AfterViewInit, ElementRef, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
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
            <img class="mark full" src="/logo.PNG" alt="Befluencer logo" />
          </div>
        </div>
      </div>
      <div class="right">
        <div class="topbar" role="navigation" aria-label="Welcome options">
          <a class="back-link" href="#" (click)="$event.preventDefault()">&larr; Back</a>
          <div class="lang-select dropdown" [class.open]="openLang">
            <div class="input-icon" (click)="toggleLang()" role="button" aria-haspopup="listbox" [attr.aria-expanded]="openLang">
              <svg class="lang-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <g clip-path="url(#clip0_316_2360)">
                  <path d="M16.0163 7.99952C16.0163 3.74927 12.6779 0.263523 8.48011 0.0147891C8.39361 0.00528906 8.30686 -0.000976562 8.21886 -0.000976562C8.19286 -0.000976562 8.16686 0.00177344 8.14086 0.00252344C8.09411 0.00177344 8.04761 -0.000976562 8.00036 -0.000976562C3.58036 -0.000976562 -0.015625 3.58802 -0.015625 7.99952C-0.015625 12.411 3.58038 16 8.00036 16C8.04761 16 8.09411 15.9973 8.14111 15.9963C8.16711 15.9973 8.19311 16 8.21911 16C8.30711 16 8.39386 15.9938 8.48036 15.9843C12.6779 15.7355 16.0164 12.2503 16.0163 7.99952ZM14.5249 10.575C14.2494 10.495 13.5574 10.3213 12.3364 10.1783C12.4374 9.48777 12.4927 8.75802 12.4927 7.99952C12.4927 7.40177 12.4582 6.82229 12.3944 6.26502C13.9414 6.08027 14.6192 5.84752 14.6647 5.83151L14.4784 5.30676C14.8259 6.13626 15.0184 7.04576 15.0184 7.99951C15.0184 8.90877 14.8422 9.77702 14.5249 10.575H14.5249ZM4.46116 7.99954C4.46116 7.44004 4.49819 6.89376 4.56592 6.36827C5.37667 6.43202 6.34617 6.47902 7.48566 6.49002V9.95977C6.37641 9.97052 5.42841 10.0155 4.63116 10.0765C4.52116 9.41727 4.46116 8.71904 4.46116 7.99954ZM8.48392 1.06551C9.70992 1.42076 10.7597 3.12324 11.2299 5.37974C10.4742 5.43999 9.56392 5.48401 8.48392 5.49427V1.06551ZM7.4857 1.07774V5.49374C6.41745 5.48299 5.5032 5.43948 4.73472 5.38074C5.21447 3.15249 6.27272 1.46274 7.4857 1.07774ZM7.4857 10.9562L7.48572 14.921C6.35447 14.562 5.35772 13.0682 4.83947 11.0612C5.58572 11.0065 6.46597 10.9665 7.4857 10.9562ZM8.48395 14.9335L8.48394 10.956C9.51444 10.9657 10.3912 11.0072 11.128 11.0642C10.6185 13.0975 9.62795 14.602 8.48395 14.9335ZM8.48394 9.95971L8.48395 6.49046C9.62944 6.47971 10.5932 6.43146 11.3932 6.36546C11.4608 6.90759 11.4947 7.45339 11.4947 7.99971C11.4947 8.72046 11.4367 9.41946 11.3302 10.0797C10.5424 10.016 9.59894 9.97021 8.48394 9.95971ZM14.2942 4.90471C14.1432 4.95171 13.512 5.13096 12.247 5.28021C11.965 3.78096 11.4552 2.49946 10.792 1.57446C12.316 2.23671 13.5597 3.42296 14.2942 4.90471ZM5.60697 1.41498C4.79122 2.35173 4.12522 3.69874 3.76172 5.29174C2.62922 5.16899 1.95045 5.02473 1.67872 4.95923C2.47122 3.32423 3.88247 2.04123 5.60697 1.41498ZM1.30723 5.89299C1.49973 5.94524 2.22775 6.12645 3.5815 6.2762C3.5016 6.84722 3.4615 7.42312 3.4615 7.99971C3.4615 8.75398 3.52975 9.47973 3.65275 10.1667C2.49025 10.2922 1.77525 10.4425 1.4545 10.52C1.15075 9.73723 0.9825 8.88799 0.9825 7.99948C0.9825 7.26573 1.09675 6.55798 1.30723 5.89299ZM1.8925 11.4425C2.256 11.3652 2.90675 11.2477 3.8705 11.1467C4.25 12.5485 4.86725 13.7345 5.607 14.5837C4.027 14.01 2.71175 12.8845 1.8925 11.4425ZM10.792 14.4242C11.3892 13.592 11.862 12.4707 12.156 11.1617C13.1468 11.2754 13.7688 11.4084 14.0825 11.4877C13.3323 12.7857 12.1785 13.822 10.792 14.4242Z" fill="#9A9A9A"/>
                </g>
                <defs>
                  <clipPath id="clip0_316_2360">
                    <rect width="16" height="16" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <input type="text" [value]="selectedLanguage" readonly aria-label="Language" />
              <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <ul class="dropdown-panel" *ngIf="openLang" role="listbox">
              <li *ngFor="let l of languages" (mousedown)="selectLang(l)" role="option">{{ l }}</li>
            </ul>
          </div>
        </div>

        <div class="right-content" role="main">
          <h1 class="welcome" #welcomeEl>Welcome to our ecosystem!</h1>
          <div class="login">Already have an account? <a routerLink="/login">Log in</a></div>
          <div class="iam">I am a</div>
          <div class="role-buttons" [style.width.px]="welcomeWidth">
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
export class HomeComponent implements AfterViewInit {
  @ViewChild('welcomeEl') welcomeEl!: ElementRef<HTMLElement>;
  welcomeWidth = 0;
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

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.updateWidths();
  }

  @HostListener('window:resize')
  onResize(){
    this.updateWidths();
  }

  private updateWidths(){
    if (this.welcomeEl?.nativeElement) {
      // Measure the actual text width by ensuring the element can shrink to content width via CSS
      this.welcomeWidth = Math.ceil(this.welcomeEl.nativeElement.getBoundingClientRect().width);
      this.cdr.markForCheck();
    }
  }
}
