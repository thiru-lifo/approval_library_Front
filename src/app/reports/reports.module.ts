import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { TrialsComponent } from './trials/trials.component';
import { ReturnsComponent } from './returns/returns.component';
import { CbpmComponent } from './cbpm/cbpm.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { VehiclePassComponent } from './vehicle-pass/vehicle-pass.component';
import { AccessCardComponent } from './access-card/access-card.component';




@NgModule({
  declarations: [
    TrialsComponent,
    ReturnsComponent,
    CbpmComponent,
    VehiclePassComponent,
    AccessCardComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NgbModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ReportsModule { }
