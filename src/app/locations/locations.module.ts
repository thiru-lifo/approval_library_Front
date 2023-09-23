import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesComponent } from './countries/countries.component';
import { LocationsRoutingModule } from './locations-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MaterialModule } from '../material/material.module';

import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { StatesComponent } from './states/states.component';
import { CitiesComponent } from './cities/cities.component';
import { RecruitmentAgencyComponent } from './recruitment-agency/recruitment-agency.component';
import { VisaCategoryComponent } from './visa-category/visa-category.component';
import { CenterComponent } from './center/center.component';
import { SharedModule } from '../shared/shared.module';
import { RegionComponent } from './region/region.component';
import { LabsComponent } from './labs/labs.component';

 


@NgModule({
  declarations: [
    CountriesComponent,
    StatesComponent,
    CitiesComponent,
    RecruitmentAgencyComponent,
    VisaCategoryComponent,
    CenterComponent,
    RegionComponent,
    LabsComponent,
   
  ],
  imports: [
    CommonModule,
    LocationsRoutingModule,
    NgbModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
    
  ],
  
})
export class LocationsModule { }
