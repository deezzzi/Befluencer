import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'bf-media-kit-saved',
  standalone: true,
  template: `
  <div class="saved-wrapper">
    <div class="saved-card">
      <div class="page-head">
        <h1 class="title">Media Kit</h1>
        <button type="button" class="export-btn">Eport</button>
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
    .export-btn{ border:1px solid #ff7a00; color:#ff7a00; background:#fff; padding:.4rem .75rem; border-radius:999px; font-size:.55rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaKitSavedComponent {}
