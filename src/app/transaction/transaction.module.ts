import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionRoutingModule } from './transaction-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { TrialsComponent } from './trials/trials.component';
import { VechiclePassComponent } from './vechicle-pass/vechicle-pass.component';
import { AccessCardComponent } from './access-card/access-card.component';


@NgModule({
  declarations: [
    TrialsComponent,
    VechiclePassComponent,
    AccessCardComponent,

  ],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    NgbModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,

  ]
})
export class TransactionModule { }
