import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorsRoutingModule } from './errors-routing.module';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PermissiondeniedComponent } from './permissiondenied/permissiondenied.component';


@NgModule({
  declarations: [
    PagenotfoundComponent,
    PermissiondeniedComponent
  ],
  imports: [
    CommonModule,
    ErrorsRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class ErrorsModule { }
