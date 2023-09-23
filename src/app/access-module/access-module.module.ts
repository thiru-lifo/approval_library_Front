import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccessModuleRoutingModule } from './access-module-routing.module';
import { AccessModuleComponent } from './access-module.component';
import { RoleComponent } from './role/role.component';
import { ModulesComponent } from './modules/modules.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { PrivilegesComponent } from './privileges/privileges.component';
import { ModuleAccessComponent } from './module-access/module-access.component';
import { ModuleComponentsComponent } from './module-components/module-components.component';
import { ModuleComponentsAttributeComponent } from './module-components-attribute/module-components-attribute.component';


@NgModule({
  declarations: [
    AccessModuleComponent,
    RoleComponent,
    ModulesComponent,
    PrivilegesComponent,
    ModuleAccessComponent,
    ModuleComponentsComponent,
    ModuleComponentsAttributeComponent
  ],
  imports: [
    CommonModule,
    AccessModuleRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AccessModuleModule { }
