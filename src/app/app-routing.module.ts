import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './public/login/login.component';
import { NoFound404Component } from './shared/components/no-found404/no-found404.component';
import { LoginMagicLinkComponent } from './public/login-magic-link/login-magic-link.component';
import { SignupComponent } from './public/signup/signup.component';
import { RequestResetPasswordComponent } from './public/request-reset-password/request-reset-password.component';
import { ResetPasswordComponent } from './public/reset-password/reset-password.component';
import { SignupCompanyComponent } from './public/signup-company/signup-company.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'login-magic-link', component: LoginMagicLinkComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'signup-company', component: SignupCompanyComponent},
  {path: 'reset', component: RequestResetPasswordComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  // {path: 'landing', component: HomeComponent},
  // {path: 'pricing', component: PricingComponent },
  {
    path: 'intranet',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: '**', component: NoFound404Component } //, component: Notfound404Component
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  useHash: true
}

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
