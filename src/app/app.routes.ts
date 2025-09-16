import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HomeComponent } from './features/home/home.component';
import { ReportsComponent } from './features/reports/reports.component';
import { SettingsComponent } from './features/settings/settings.component';
import { CampaignsComponent } from './features/campaigns/campaigns.component';
import { MediaKitComponent } from './features/media-kit/media-kit.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';
import { WalletComponent } from './features/wallet/wallet.component';
import { CollabToolsComponent } from './features/collab-tools/collab-tools.component';
import { TasksComponent } from './features/tasks/tasks.component';
import { CommunityComponent } from './features/community/community.component';
import { SupportComponent } from './features/support/support.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
  { path: 'home', component: HomeComponent, data: { title: 'Home' } },
  { path: 'campaigns', component: CampaignsComponent, data: { title: 'Campaigns' } },
  { path: 'media-kit', component: MediaKitComponent, data: { title: 'Media Kit' } },
  { path: 'media-kit/setup', loadComponent: () => import('./features/media-kit-setup/media-kit-setup.component').then(m => m.MediaKitSetupComponent), data: { title: 'Set-up Media Kit' } },
  { path: 'media-kit/saved', loadComponent: () => import('./features/media-kit-saved/media-kit-saved.component').then(m => m.MediaKitSavedComponent), data: { title: 'Media Kit (Saved)' } },
  { path: 'analytics', component: AnalyticsComponent, data: { title: 'Analytics' } },
  { path: 'wallet', component: WalletComponent, data: { title: 'Wallet' } },
  { path: 'collab-tools', component: CollabToolsComponent, data: { title: 'Collab Tools' } },
  { path: 'tasks', component: TasksComponent, data: { title: 'Tasks' } },
  { path: 'community', component: CommunityComponent, data: { title: 'Community' } },
  { path: 'reports', component: ReportsComponent, data: { title: 'Reports' } },
  { path: 'settings', component: SettingsComponent, data: { title: 'Settings' } },
  { path: 'support', component: SupportComponent, data: { title: 'Support' } },
    ]
  },
  { path: '**', redirectTo: '' }
];
