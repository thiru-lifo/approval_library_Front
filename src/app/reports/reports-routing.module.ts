import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrialsComponent } from './trials/trials.component';
import { ReturnsComponent } from './returns/returns.component';
import { CbpmComponent } from './cbpm/cbpm.component';
import { VehiclePassComponent } from './vehicle-pass/vehicle-pass.component';
import { AccessCardComponent } from './access-card/access-card.component';


const routes: Routes = [
  // { path: '', component: TrialsComponent, data: { breadcrumb: 'Trials'} },
  { path: 'trials', component: TrialsComponent, data: { breadcrumb: 'Trials'}  },
  { path: 'returns', component: ReturnsComponent, data: { breadcrumb: 'E-Returns'}  },
  { path: 'cbpm', component: CbpmComponent, data: { breadcrumb: 'CBPM'}  },
  { path: 'access-card', component: AccessCardComponent, data: { breadcrumb: 'Access'}  },
  { path: 'vehicle-pass', component: VehiclePassComponent, data: { breadcrumb: 'Vehicle'}  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
