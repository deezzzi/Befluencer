import { Component, ChangeDetectionStrategy, AfterViewInit, ElementRef, ViewChild, HostListener, ChangeDetectorRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../shared/services/translation.service';

/**
 * HomeComponent
 * -------------
 * Public landing page with language selector, login link, and role entry points.
 */
@Component({
  selector: 'bf-home-page',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, TranslateModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements AfterViewInit {
  private i18n = inject(TranslationService);
  @ViewChild('welcomeEl') welcomeEl!: ElementRef<HTMLElement>;
  welcomeWidth = 0;
  openLang = false;
  languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
    { code: 'zh', label: '中文' }
  ];
  selectedLanguage = 'English';

  /** Toggle the language dropdown panel. */
  toggleLang(){
    this.openLang = !this.openLang;
  }
  /** Select a language; future: persist in preferences or i18n service. */
  selectLang(l: { code: string; label: string }){
    this.selectedLanguage = l.label;
    this.openLang = false;
    this.i18n.use(l.code);
    // update welcome width after language switch
    setTimeout(() => this.updateWidths());
  }

  constructor(private cdr: ChangeDetectorRef) {
    this.syncSelectedLabel();
  }

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

  private syncSelectedLabel(){
    const found = this.languages.find(l => l.code === this.i18n.current);
    if (found) this.selectedLanguage = found.label;
  }
}
