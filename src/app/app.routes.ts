import { Routes } from '@angular/router';
import { StampsComponent } from './stamps/stamps.component';
import { StampDetailsComponent } from './stamp-details/stamp-details.component';
import { AddStampComponent } from './add-stamp/add-stamp.component';
import { EditStampComponent } from './edit-stamp/edit-stamp.component';
import { DashboardComponent } from './dashboard/dashboard';
import { AuditComponent } from './audit.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'stamps', component: StampsComponent },
  { path: 'stamps/new', component: AddStampComponent },
  { path: 'stamps/:id', component: StampDetailsComponent },
  { path: 'stamps/edit/:id', component: EditStampComponent },
  { path: 'audit', component: AuditComponent },
];