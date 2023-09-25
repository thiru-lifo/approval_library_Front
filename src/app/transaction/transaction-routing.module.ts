import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrialsComponent } from './trials/trials.component';
const routes: Routes = [

  { path: 'trials', component: TrialsComponent, data: { breadcrumb: 'Trials'}  },
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
