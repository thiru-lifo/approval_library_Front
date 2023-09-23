import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalysisRoutingModule } from './analysis-routing.module';
import { ListOfEquipmentComponent } from './list-of-equipment/list-of-equipment.component';
import { AnlaysiHomeComponent } from './anlaysi-home/anlaysi-home.component';


@NgModule({
  declarations: [
    ListOfEquipmentComponent,
    AnlaysiHomeComponent
  ],
  imports: [
    CommonModule,
    AnalysisRoutingModule
  ]
})
export class AnalysisModule { }
