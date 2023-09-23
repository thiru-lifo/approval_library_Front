import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { PermissiondeniedComponent } from './permissiondenied/permissiondenied.component';


const routes: Routes = [
{ path: '404', component: PagenotfoundComponent },
{ path: '403', component: PermissiondeniedComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorsRoutingModule { }
