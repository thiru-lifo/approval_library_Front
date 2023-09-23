import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SecurityPinComponent } from './security-pin/security-pin.component';

import { AuthenticateRoutingModule } from './authenticate-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule} from '@angular/forms';
import { AuthenticateComponent } from './authenticate.component';
import { RoleSelectionComponent } from './role-selection/role-selection.component';
import { LoginEtmaComponent } from './login-etma/login-etma.component';
import { LoginCbiuComponent } from './login-cbiu/login-cbiu.component';
import { LoginGtttComponent } from './login-gttt/login-gttt.component';
import { LoginMtuComponent } from './login-mtu/login-mtu.component';
import { LoginDtttComponent } from './login-dttt/login-dttt.component';
import {LandingPageComponent } from './landing-page/landing-page.component';
import { PageComponent } from './page/page.component';
import { AboutusComponent } from './page/aboutus/aboutus.component';
import { ContactusComponent } from './page/contactus/contactus.component';
import { PageHeaderComponent } from './page/page-header/page-header.component';
import { PageFooterComponent } from './page/page-footer/page-footer.component';
import { HierarchyComponent } from './page/hierarchy/hierarchy.component';
import { KmsComponent } from './page/kms/kms.component';



@NgModule({
  declarations: [
    LandingPageComponent,
    AuthenticateComponent,
    LoginComponent,
    ForgotPasswordComponent,
    SecurityPinComponent,
    RoleSelectionComponent,
    LoginEtmaComponent,
    LoginCbiuComponent,
    LoginGtttComponent,
    LoginMtuComponent,
    LoginDtttComponent,
    PageComponent,
    AboutusComponent,
    ContactusComponent,
    PageHeaderComponent,
    PageFooterComponent,
    HierarchyComponent,
    KmsComponent,
  ],
  imports: [
    AuthenticateRoutingModule,
    NgbModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AuthenticateModule { }
