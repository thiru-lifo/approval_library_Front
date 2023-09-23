import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountriesComponent } from './countries/countries.component';
import { StatesComponent } from './states/states.component';
import { CitiesComponent } from './cities/cities.component';
import { RecruitmentAgencyComponent } from './recruitment-agency/recruitment-agency.component'; 
import { VisaCategoryComponent } from './visa-category/visa-category.component';
import { CenterComponent } from './center/center.component';
import { RegionComponent } from './region/region.component';
import { LabsComponent } from './labs/labs.component';


const routes: Routes = [
  { path: '', component: CountriesComponent, data: { breadcrumb: 'Countries'} },
  { path: 'countries', component: CountriesComponent, data: { breadcrumb: 'Countries'}  },
  { path: 'states', component: StatesComponent, data: { breadcrumb: 'States'} },
  { path: 'cities', component: CitiesComponent, data: { breadcrumb: 'Cities'} },
  { path: 'recruitment', component: RecruitmentAgencyComponent, data: { breadcrumb: 'Recruitment agency'} },
  { path: 'visa', component: VisaCategoryComponent, data: { breadcrumb: 'Visa category'}},
  { path: 'center', component: CenterComponent, data: { breadcrumb: 'Center'} },
  { path: 'region', component: RegionComponent, data: { breadcrumb: 'Region'} },
  { path: 'lab', component: LabsComponent, data: { breadcrumb: 'lab'} }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule { }