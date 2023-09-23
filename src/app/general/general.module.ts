import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { XrayComponent } from './xray/xray.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MohRadiologyComponent } from './moh-radiology/moh-radiology.component';
import { CodedCommandsComponent } from './coded-commands/coded-commands.component';
import { CodeCommandsCatalogComponent } from './code-commands-catalog/code-commands-catalog.component';
import { VaccineComponent } from './vaccine/vaccine.component';
import { UnitCreationComponent } from './unit-creation/unit-creation.component';
import { LookupTypeComponent } from './lookup-type/lookup-type.component';
import { LookupValueComponent } from './lookup-value/lookup-value.component';
import { JobPositionComponent } from './job-position/job-position.component';
import { NationalityComponent } from './nationality/nationality.component';
import { MaterialModule } from '../material/material.module';
import { PriorityComponent } from './priority/priority.component';
import { DepartmentComponent } from './department/department.component';
import { SharedModule } from '../shared/shared.module';
import { DocumentTypeComponent } from './document-type/document-type.component';


@NgModule({
  declarations: [
    XrayComponent,
    MohRadiologyComponent,
    CodedCommandsComponent,
    CodeCommandsCatalogComponent,
    VaccineComponent,
    UnitCreationComponent,
    LookupTypeComponent,
    LookupValueComponent,
    JobPositionComponent,
    NationalityComponent,
    PriorityComponent,
    DepartmentComponent,
    DocumentTypeComponent
  ],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MaterialModule,
    SharedModule
    
  ]
})
export class GeneralModule { }
