import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SecurityPinComponent } from './security-pin/security-pin.component';
import { AuthguardGuard } from 'src/app/service/authguard.guard';
import { AuthenticateComponent } from './authenticate.component';
import { RoleSelectionComponent } from './role-selection/role-selection.component';
import { LoginEtmaComponent } from './login-etma/login-etma.component';
import { LoginCbiuComponent } from './login-cbiu/login-cbiu.component';
import { LoginMtuComponent } from './login-mtu/login-mtu.component';
import { LoginGtttComponent } from './login-gttt/login-gttt.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginDtttComponent } from './login-dttt/login-dttt.component';
import { PageComponent } from './page/page.component';
import { AboutusComponent } from './page/aboutus/aboutus.component';
import { ContactusComponent } from './page/contactus/contactus.component';
import { HierarchyComponent } from './page/hierarchy/hierarchy.component';
import { KmsComponent } from './page/kms/kms.component';

const routes: Routes = [
{
    path: 'home',
    component: LandingPageComponent,
  },
  {
    path: 'about-us',
    component: AboutusComponent,
  },
  {
    path: 'kms',
    component: KmsComponent,
  },

  {
    path: 'hierarchy',
    component: HierarchyComponent,
  },
  {
    path: 'contact-us',
    component: ContactusComponent,
  },
  // {
  //   path: 'role-selection/:id',
  //   component: RoleSelectionComponent,
  // },
   {
    path: 'role-selection',
    component: RoleSelectionComponent,
  },

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'login/etma',
    component: LoginEtmaComponent,
     data:{title:'ETMA'}
  },
  {
    path: 'login/cbiu',
    component: LoginCbiuComponent,
    data:{title:'CBIU'}
  },
  {
    path: 'login/mtu',
    component: LoginMtuComponent,
    data:{title:'MTU'}
  },
  {
    path: 'login/gttt',
    component: LoginGtttComponent,
     data:{title:'GTTT'}
  },
  {
    path: 'login/dttt',
    component: LoginDtttComponent,
    data:{title:'DTTT'}
  },
  {
    path: 'page/:id',
    component: PageComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent, canActivate: [AuthguardGuard]
  },
  {
    path: 'twofactor',
    component: SecurityPinComponent, canActivate: [AuthguardGuard]
  },
  {
    path: 'etma',
    component: LandingPageComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticateRoutingModule { }
