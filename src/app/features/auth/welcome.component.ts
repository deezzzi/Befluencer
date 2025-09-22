import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * WelcomeComponent
 * ----------------
 */
@Component({
  selector: 'bf-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="welcome-shell">
      <div class="left purple">
        <div class="brand">
          <div class="logo">
            <span class="b">B</span>
            <span class="word">Befluencer</span>
          </div>
          <div class="tagline">Be seen. Be paid.</div>
        </div>
      </div>
      <div class="right">
        <div class="topbar">
          <a class="back-link" routerLink="/signup/creator">&larr; Back</a>
          <div class="mini-logo">
            <span class="b">B</span>
            <span class="name">Befluencer</span>
          </div>
        </div>

        <div class="content-wrap">
          <h1 class="title">
            <span class="warm">Welcome</span>
            <span> To A New Era of Collaboration !</span>
          </h1>

          <p class="subtitle">We are so excited to have you on board.</p>

          <div class="copy">
            <p>You've built a voice. You've earned your influence. Now it's time to turn passion into partnerships that matter.</p>
            <p>Whether you're here to share your story or elevate your brand, this space was made for authentic connections, fair value, and real impact.</p>
            <p>Let's build something unforgettable—together!</p>
          </div>

          <a class="cta" routerLink="/dashboard" aria-label="Begin your journey">Begin Your Journey <span class="arrow">&rarr;</span></a>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent {}
