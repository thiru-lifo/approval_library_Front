import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodeCommandsCatalogComponent } from './code-commands-catalog/code-commands-catalog.component';
import { CodedCommandsComponent } from './coded-commands/coded-commands.component';
import { DepartmentComponent } from './department/department.component';
import { JobPositionComponent } from './job-position/job-position.component';
import { LookupTypeComponent } from './lookup-type/lookup-type.component';
import { LookupValueComponent } from './lookup-value/lookup-value.component';
import { MohRadiologyComponent } from './moh-radiology/moh-radiology.component';
import { NationalityComponent } from './nationality/nationality.component';
import { PriorityComponent } from './priority/priority.component';
import { UnitCreationComponent } from './unit-creation/unit-creation.component';
import { VaccineComponent } from './vaccine/vaccine.component';
import { XrayComponent } from './xray/xray.component';
import { DocumentTypeComponent } from './document-type/document-type.component';

const routes: Routes = [
  { path: '', component: XrayComponent, data: { breadcrumb: 'X-ray'} },
  { path: 'Xray', component: XrayComponent, data: { breadcrumb: 'X-ray'} },
  { path:'moh', component: MohRadiologyComponent, data: { breadcrumb: 'MOH Radiology'} },
  { path:'codedCommand', component:CodedCommandsComponent, data: { breadcrumb: 'Coded command'} },
  { path:'codeCommandCatalog',component:CodeCommandsCatalogComponent, data: { breadcrumb: 'Coded command catalog'} },
  { path:'vaccine',component:VaccineComponent, data: { breadcrumb: 'Vaccine'}},
  { path:'unitCreation',component:UnitCreationComponent, data: { breadcrumb: 'Unit creation'}},
  { path:'lookupType',component:LookupTypeComponent, data: { breadcrumb: 'Lookup type'}},
  { path:'lookup',component:LookupValueComponent, data: { breadcrumb: 'Lookup value'}},
  { path:'jobPosition',component:JobPositionComponent, data: { breadcrumb: 'Job position'}},
  { path:'nationality',component:NationalityComponent, data: { breadcrumb: 'Nationality'}},
  { path:'priority' ,component:PriorityComponent, data: { breadcrumb: 'Priority'}},
  {path:'department',component:DepartmentComponent, data: { breadcrumb: 'Department'}},
  {path:'document-type',component:DocumentTypeComponent, data: { breadcrumb: 'Document type'}},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
