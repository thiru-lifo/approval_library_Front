import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrialsComponent } from './trials/trials.component';
import { VechiclePassComponent } from './vechicle-pass/vechicle-pass.component';
import { AccessCardComponent } from './access-card/access-card.component';
const routes: Routes = [

  { path: 'trials', component: TrialsComponent, data: { breadcrumb: 'Trials'}  },

  { path: 'access-card', component: AccessCardComponent, data: { breadcrumb: 'Access'}  },

  { path: 'vehicle-pass', component: VechiclePassComponent, data: { breadcrumb: 'Pass'}  },

  {
    path: 'forms',
     loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule), data: { breadcrumb: 'Forms'}
  },

  // {
  //   path: 'cbiu',
  //   loadChildren: () => import('./cbiu/cbiu.module').then(m => m.CbiuModule), data: { breadcrumb: 'CBIU'}
  // },
  // {
  //   path: 'gttt',
  //   loadChildren: () => import('./gttt/gttt.module').then(m => m.GtttModule), data: { breadcrumb: 'GTTT'}
  // },
  // {
  //   path: 'mtu',
  //   loadChildren: () => import('./mtu/mtu.module').then(m => m.MtuModule), data: { breadcrumb: 'MTU'}
  // },

  // {
  //   path: 'dttt',
  //   loadChildren: () => import('./dttt/dttt.module').then(m => m.DtttModule), data: { breadcrumb: 'DTTT'}
  // },

  // {
  //   path: 'dttt',
  //   loadChildren: () => import('./dttt/dttt.module').then(m => m.DtttModule), data: { breadcrumb: 'DTTT'}
  // },
  // { path: 'kms', component: KMSComponent, data: { breadcrumb: 'kms'}  },


];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
