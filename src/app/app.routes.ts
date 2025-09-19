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
import { CreatorSignupComponent } from './features/auth/creator-signup.component';

export const routes: Routes = [
  // Landing page as the initial route
  { path: '', component: HomeComponent, data: { title: 'Home' } },
  { path: 'signup/creator', component: CreatorSignupComponent, data: { title: 'Sign up - Creator' } },
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent), data: { title: 'Log in' } },
  { path: 'auth/otp', loadComponent: () => import('./features/auth/otp-verification.component').then(m => m.OtpVerificationComponent), data: { title: 'OTP Verification' } },
  { path: 'auth/welcome', loadComponent: () => import('./features/auth/welcome.component').then(m => m.WelcomeComponent), data: { title: 'Welcome' } },
  { path: 'auth/forgot', loadComponent: () => import('./features/auth/forgot-password.component').then(m => m.ForgotPasswordComponent), data: { title: 'Forgot Password' } },
  { path: 'auth/create-password', loadComponent: () => import('./features/auth/create-password.component').then(m => m.CreatePasswordComponent), data: { title: 'Create New Password' } },
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      // Keep dashboard as the default under the dashboard layout
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
      // Home route remains accessible explicitly if needed
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
