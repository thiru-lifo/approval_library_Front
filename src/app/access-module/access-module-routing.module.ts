import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessModuleComponent } from './access-module.component';
import { RoleComponent } from './role/role.component';
import { ModulesComponent } from './modules/modules.component';
import { PrivilegesComponent } from './privileges/privileges.component';
import { ModuleComponentsComponent } from './module-components/module-components.component';
import { ModuleComponentsAttributeComponent } from './module-components-attribute/module-components-attribute.component';
import { ModuleAccessComponent } from './module-access/module-access.component';

const routes: Routes = [
// { path: '', component: AccessModuleComponent, data: { breadcrumb: 'General'} },
{ path: '', component: ModuleAccessComponent, data: { breadcrumb: ''} },
{ path: 'privileges', component: PrivilegesComponent, data: { breadcrumb: 'Privileges'} },
{ path: 'roles', component: RoleComponent, data: { breadcrumb: 'Roles'} },
{ path: 'module', component: ModulesComponent, data: { breadcrumb: 'Module'} },
{ path: 'component', component: ModuleComponentsComponent, data: { breadcrumb: 'Component'} },
{ path: 'attribute', component: ModuleComponentsAttributeComponent, data: { breadcrumb: 'Attribute'} },
{ path: 'access', component: ModuleAccessComponent, data: { breadcrumb: 'Access Privileges'} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessModuleRoutingModule { }
