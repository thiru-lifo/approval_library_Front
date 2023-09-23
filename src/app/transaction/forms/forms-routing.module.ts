import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormAComponent } from './form-a/form-a.component';
import { FormMComponent } from './form-m/form-m.component';

const routes: Routes = [
  { path: 'form-a', component: FormAComponent, data: { breadcrumb: 'AccessCard Form-A'}  },

  { path: 'form-m', component: FormMComponent, data: { breadcrumb: 'VehiclePass Form-M'}  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
