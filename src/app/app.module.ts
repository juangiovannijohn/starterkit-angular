import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './public/login/login.component';
import { NoFound404Component } from './shared/components/no-found404/no-found404.component';
import { LoginMagicLinkComponent } from './public/login-magic-link/login-magic-link.component';
import { SignupComponent } from './public/signup/signup.component';
import { AlertMessageModalComponent } from './shared/components/alert-message-modal/alert-message-modal.component';
import { RequestResetPasswordComponent } from './public/request-reset-password/request-reset-password.component';
import { ResetPasswordComponent } from './public/reset-password/reset-password.component';
import { SignupCompanyComponent } from './public/signup-company/signup-company.component';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginMagicLinkComponent,
    SignupComponent,
    RequestResetPasswordComponent,
    ResetPasswordComponent,
    SignupCompanyComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
