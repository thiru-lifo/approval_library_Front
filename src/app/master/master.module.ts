import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastersRoutingModule } from './master-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { TrialunitsComponent } from './trialunits/trialunits.component';
import { UsersComponent } from './users/users.component';
import { LandingpageComponent } from './landingpage/landingpage.component';



@NgModule({
  declarations: [
    TrialunitsComponent,
    UsersComponent,
    LandingpageComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MastersRoutingModule
  ]
})
export class MasterModule { }
