import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { PackageSettingComponent } from './package-setting/package-setting.component';
import { ServiceSettingComponent } from './service-setting/service-setting.component';
import { TemplateComponent } from './template/template.component';
import { ApprovalComponent } from './approval/approval.component';

const routes: Routes = [
  { path: '', component: ConfigComponent, data: { breadcrumb: 'Configuration'} },
  { path: 'config', component : ConfigComponent, data: { breadcrumb: 'Configuration'} },
  { path: 'approval-config', component : ApprovalComponent, data: { breadcrumb: 'Approval'} },
  { path: 'templates', component : TemplateComponent, data: { breadcrumb: 'Template'} },
  { path: 'package-settings', component : PackageSettingComponent, data: { breadcrumb: 'Package settings'} },
  { path: 'service-settings', component : ServiceSettingComponent, data: { breadcrumb: 'Service settings'} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
