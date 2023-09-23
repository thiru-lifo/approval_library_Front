import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrialunitsComponent } from './trialunits/trialunits.component';
import { UsersComponent } from './users/users.component';
import { LandingpageComponent } from './landingpage/landingpage.component';




const routes: Routes = [
  { path: '', component: TrialunitsComponent, data: { breadcrumb: 'Trial Units'} },
  { path:'landing_page',component:LandingpageComponent, data:{breadcrumb: 'Landing Page'}},
  // { path: 'trial_units', component: TrialunitsComponent, data: { breadcrumb: 'Trial Units'}  },
  // { path: 'satellite_units', component: SatelliteunitsComponent, data: { breadcrumb: 'Satellite Units'}  },
  // { path: 'ships', component: ShipsComponent, data: { breadcrumb: 'Ships'}  },
  // { path: 'sections', component: SectionsComponent, data: { breadcrumb: 'Sections'}  },
  // { path: 'equipments', component: EquipmentsComponent, data: { breadcrumb: 'Equipments'}  },
  // { path: 'trial_types', component: TrialtypesComponent, data: { breadcrumb: 'Trail Types'}  },
  { path: 'users', component: UsersComponent, data: { breadcrumb: 'Users'}  },
  // { path:'boilers',component:BoilerComponent,data:{breadcrumb: 'Boilers'}},
  // { path:'command',component:CommandComponent,data:{breadcrumb: 'Command'}},
  // { path:'department',component:DepartmentComponent,data:{breadcrumb: 'Department'}},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
