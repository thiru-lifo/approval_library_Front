import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { FormAComponent } from './form-a/form-a.component';
import { FormMComponent } from './form-m/form-m.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FormAComponent,
    FormMComponent
  ],
  imports: [
    CommonModule,
    FormsRoutingModule,
    NgbModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,

  ]
})
export class FormsModule { }
