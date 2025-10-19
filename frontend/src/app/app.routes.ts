import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent2 } from './products/products.component';
import { SettingsComponent } from './settings/settings.component';
import { PagesComponent } from './pages/pages.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainComponent } from './admin/main/main.component';
import { ProductsComponent } from './admin/products/products.component';

import { LogoutComponent } from './admin/logout/logout.component';
import { authGuard } from './auth.guard';
import { DepartmentsComponent } from './admin/departments/departments.component';
import { ReservationsComponent } from './admin/reservation/reservation.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent2 },
  { path: 'settings', component: SettingsComponent },
  { path: 'pages', component: PagesComponent },
  { path: 'Auth', redirectTo: 'Auth/register', pathMatch: 'full' }, 
  { path: 'Auth/login', component: LoginComponent },
  { path: 'Auth/register', component: RegisterComponent },
  {
    path: 'admin',
    component: MainComponent, 
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'reservation', pathMatch: 'full' },
      { path: 'products', component: ProductsComponent },
      { path: 'reservations', component:ReservationsComponent },
      { path: 'departments', component: DepartmentsComponent },
      { path: 'logout', component: LogoutComponent },
    ],
  },
];
