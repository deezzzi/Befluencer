import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'bf-media-kit-saved',
  standalone: true,
  template: `
  <div class="saved-wrapper">
    <div class="saved-card">
      <div class="page-head">
        <h1 class="title">Media Kit</h1>
        <button type="button" class="export-btn">
          Export
          <svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g clip-path="url(#clip0_184_3527)">
            <path d="M19.8386 11.7704L19.8608 11.7428C19.8774 11.7214 19.8928 11.6992 19.9068 11.6762L19.926 11.645L19.9438 11.6096C19.9497 11.5983 19.9549 11.5872 19.9594 11.5763L19.9727 11.5409L19.986 11.5048L19.9957 11.4694L20.0053 11.4311L20.012 11.3907L20.0171 11.3567C20.0171 11.3319 20.0208 11.3064 20.0208 11.2816C20.0208 11.2566 20.0196 11.2316 20.0171 11.2066C20.0166 11.1948 20.0149 11.1834 20.012 11.1726C20.0075 11.1563 20.0082 11.1449 20.0053 11.1322L19.9957 11.0939L19.986 11.0592L19.9727 11.0224C19.9687 11.0101 19.9643 10.9985 19.9594 10.9877L19.9438 10.9544L19.926 10.919L19.9068 10.8878L19.8853 10.8538L19.8601 10.8212C19.8512 10.8106 19.846 10.8021 19.8379 10.7936C19.8216 10.7752 19.8045 10.7572 19.7868 10.7398L17.7623 8.8046C17.6886 8.72778 17.5994 8.66601 17.5001 8.62301C17.4007 8.58002 17.2933 8.55669 17.1843 8.55443C17.0753 8.55217 16.967 8.57102 16.8658 8.60986C16.7646 8.6487 16.6727 8.70671 16.5956 8.78041C16.5184 8.85411 16.4577 8.94198 16.417 9.03871C16.3763 9.13544 16.3566 9.23905 16.3589 9.34329C16.3611 9.44753 16.3855 9.55024 16.4304 9.64526C16.4753 9.74027 16.5398 9.82561 16.6201 9.89615L16.6208 9.89685L17.2616 10.5096H14.7964V6.44019C14.7968 6.2612 14.7315 6.08774 14.612 5.95002L14.6127 5.95144L14.6097 5.94719C14.595 5.93021 14.5794 5.9139 14.5631 5.89831L14.5564 5.89194L14.5357 5.8714L8.63492 0.228813C8.61862 0.213184 8.60156 0.198293 8.58381 0.184188L8.56677 0.171438L8.52751 0.143105L8.50751 0.129646C8.49319 0.120674 8.47887 0.11241 8.46455 0.104855L8.44677 0.0949378C8.42751 0.0850212 8.40751 0.0758128 8.38677 0.0673128L8.36158 0.0573962L8.32084 0.0425212L8.29195 0.0340212L8.24529 0.0226879L8.22455 0.0177295C8.20183 0.0139517 8.17887 0.0106462 8.15566 0.00781285H1.0601C0.846985 0.00761894 0.642432 0.0880048 0.491044 0.231443C0.339656 0.374881 0.253713 0.569736 0.251953 0.773521V16.2279C0.251953 16.6551 0.614175 17.0007 1.0601 17.0007H13.989C14.4357 17.0007 14.7971 16.6544 14.7971 16.2279V12.0551H17.2631L16.6223 12.6679C16.542 12.7383 16.4774 12.8236 16.4324 12.9186C16.3875 13.0136 16.3631 13.1163 16.3607 13.2206C16.3583 13.3248 16.3781 13.4284 16.4187 13.5252C16.4593 13.6219 16.52 13.7098 16.597 13.7836C16.6741 13.8573 16.766 13.9154 16.8671 13.9543C16.9683 13.9932 17.0766 14.0121 17.1857 14.0099C17.2947 14.0077 17.4021 13.9845 17.5014 13.9415C17.6008 13.8986 17.69 13.8369 17.7638 13.7601L17.7645 13.7594L19.7853 11.8313C19.8045 11.8105 19.8218 11.7902 19.8386 11.7704ZM8.86973 2.63785L12.0364 5.66598H8.86973V2.63785ZM13.1794 15.4537H1.86677V1.5449H7.25418V6.43877C7.25418 6.8659 7.6164 7.21156 8.06232 7.21156H13.1801V10.5089H9.65492C9.44058 10.5089 9.23503 10.5903 9.08347 10.7352C8.93191 10.8801 8.84677 11.0767 8.84677 11.2816C8.84677 11.4866 8.93191 11.6832 9.08347 11.8281C9.23503 11.973 9.44058 12.0544 9.65492 12.0544H9.67862H9.67714H13.1786L13.1794 15.4537Z" fill="white"/>
            </g>
            <defs>
            <clipPath id="clip0_184_3527">
            <rect width="20" height="17" fill="white" transform="translate(0.25)"/>
            </clipPath>
            </defs>
          </svg>
        </button>
      </div>
      <!-- The page reuses the preview grid styles; actual data would normally be resolved or shared state. For now it’s a static scaffold. -->
      <div class="preview-grid design-layout">
        <div class="preview-card summary-card area-summary"><div class="summary-inner"><div class="last-updated"><div class="label">Last Updated</div><div class="time">12:00 PM | Apr,08</div></div><div class="divider-vert" aria-hidden="true"></div><div class="status-section"><div class="status-line"><span class="status-icon" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6.5 5.2 9 9 3"/></svg></span><span class="status-label">Status: <strong>Finished</strong></span></div><div class="progress-line">7/7 Completed</div></div><button type="button" class="edit-kit-btn">Preview</button></div></div>
        <div class="preview-card collabs-card area-collabs"><div class="card-head"><h3>Previous Collaborations</h3><a href="#" class="view-link" (click)="$event.preventDefault()">View all ▸</a></div><ul class="collab-list"><li class="collab-item"><div class="logo-box logo-0" aria-hidden="true"></div><div class="c-meta"><div class="reach">12k Audiences Reached</div><div class="title">MTN Ghana Router Review</div></div></li><li class="collab-item"><div class="logo-box logo-1" aria-hidden="true"></div><div class="c-meta"><div class="reach">1k Audiences Reached</div><div class="title">Samsung S25 Unbox</div></div></li><li class="collab-item"><div class="logo-box logo-2" aria-hidden="true"></div><div class="c-meta"><div class="reach">7k Audiences Reached</div><div class="title">Maxbeat Interview</div></div></li></ul></div>
        <div class="preview-card services-card area-services"><div class="card-head"><h3>Services & Rates</h3></div><div class="services-rates"><div class="svc-col"><div class="col-head">Services</div><ul class="plain-list"><li>Sponsored Posts</li><li>Product Reviews</li><li>UGC Creation</li></ul></div><div class="rate-col"><div class="col-head">Rates</div><ul class="plain-list"><li>GHC 100.00 per post</li><li>GHC 1500.00 per package</li></ul></div></div></div>
        <div class="preview-card basic-card area-basic"><div class="card-head"><h3>Basic Info</h3></div><div class="profile-line"><div class="avatar small" aria-hidden="true">JD</div><div class="person"><div class="name">John Doe</div><div class="role">Creator</div></div></div><div class="bio-label">Bio</div><div class="bio">Smartphone reviews that cut through the hype. Helping you find the right device — fast and fact-based.</div><dl class="kv"><div><dt>Location</dt><dd>Accra, Ghana</dd></div><div><dt>Content Niche (s)</dt><dd>Tech Review</dd></div><div><dt>Languages (s)</dt><dd>English, French, Spanish</dd></div><div><dt>Stage Name</dt><dd>—</dd></div></dl></div>
        <div class="preview-card content-card area-topcontent"><div class="card-head"><h3>Top Content</h3><a href="#" class="view-link" (click)="$event.preventDefault()">View all ▸</a></div><div class="top-content-grid precise"><div class="content-thumb c-0"></div><div class="content-thumb c-1"></div><div class="content-thumb c-2"></div><div class="content-thumb second-row c-3"></div><div class="add-contents">+ Add Contents</div></div></div>
  <div class="preview-card contact-card area-contact"><div class="card-head"><h3>Contact Information</h3></div><dl class="kv tight"><div><dt>Email Address</dt><dd>ruoviasoje7&#64;gmail.com</dd></div><div><dt>Phone Number (s)</dt><dd>05788237492</dd></div><div><dt>Website/Booking site</dt><dd><a class="site-link" href="https://www.joekingandreviews.com" target="_blank" rel="noopener">www.joekingandreviews.com</a></dd></div><div><dt>Booking Availability</dt><dd>Available anytime</dd></div><div><dt>Preferred Contact Method</dt><dd>Whatsapp (02038645720)</dd></div><div><dt>Additional Notes</dt><dd>—</dd></div></dl></div>
        <div class="preview-card socials-card area-socials"><div class="card-head"><h3>Socials & Stat</h3></div><ul class="platform-stats alt"><li><span class="icon" aria-hidden="true"></span><div class="info"><div class="top-line"><span class="pname">Instagram</span><span class="ext" aria-hidden="true"></span></div><div class="metric">12.5k</div></div></li><li><span class="icon" aria-hidden="true"></span><div class="info"><div class="top-line"><span class="pname">Instagram</span><span class="ext" aria-hidden="true"></span></div><div class="metric">12.5k</div></div></li><li><span class="icon" aria-hidden="true"></span><div class="info"><div class="top-line"><span class="pname">Instagram</span><span class="ext" aria-hidden="true"></span></div><div class="metric">12.5k</div></div></li><li><span class="icon" aria-hidden="true"></span><div class="info"><div class="top-line"><span class="pname">Instagram</span><span class="ext" aria-hidden="true"></span></div><div class="metric">12.5k</div></div></li><li><span class="icon" aria-hidden="true"></span><div class="info"><div class="top-line"><span class="pname">Instagram</span><span class="ext" aria-hidden="true"></span></div><div class="metric">12.5k</div></div></li><li><span class="icon" aria-hidden="true"></span><div class="info"><div class="top-line"><span class="pname">Instagram</span><span class="ext" aria-hidden="true"></span></div><div class="metric">12.5k</div></div></li><li><span class="icon" aria-hidden="true"></span><div class="info"><div class="top-line"><span class="pname">Instagram</span><span class="ext" aria-hidden="true"></span></div><div class="metric">12.5k</div></div></li><li><span class="icon" aria-hidden="true"></span><div class="info"><div class="top-line"><span class="pname">Instagram</span><span class="ext" aria-hidden="true"></span></div><div class="metric">12.5k</div></div></li></ul></div>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['../media-kit-setup/media-kit-setup.component.scss'],
  styles: [`
    .saved-wrapper{ padding:1.8rem 1.6rem 3rem; display:flex; justify-content:center; }
    .saved-card{ width:100%; max-width:1280px; background:transparent; padding:0; }
    .page-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; padding:0 .25rem; }
    .title{ margin:0; font-size:1rem; font-weight:700; color:#111; }
  .export-btn{ display:inline-flex; align-items:center; gap:.4rem; border:1px solid #ff7a00; background:#ff7a00; color:#fff; padding:.45rem .85rem; border-radius:999px; font-size:.55rem; font-weight:600; line-height:1; }
  .export-btn svg{ display:block; }
  .export-btn:hover{ background:#ff8e26; border-color:#ff8e26; }
    /* Saved page-only adjustment: add extra space between Basic Info and Socials & Stat on desktop */
    @media (min-width:1101px){
      .saved-wrapper .preview-grid.design-layout .area-socials{ margin-top: 15px !important; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaKitSavedComponent {}
