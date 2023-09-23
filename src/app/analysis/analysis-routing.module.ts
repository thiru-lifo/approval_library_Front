import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOfEquipmentComponent } from './list-of-equipment/list-of-equipment.component';
import { AnlaysiHomeComponent } from './anlaysi-home/anlaysi-home.component';

const routes: Routes = [
  {
    path: 'list-of-equipment',
    component: ListOfEquipmentComponent,data: { breadcrumb: 'List of Equipment'}
  },
  {
    path: 'anlaysi-home',
    component: AnlaysiHomeComponent,data: { breadcrumb: 'Analysis'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisRoutingModule { }
