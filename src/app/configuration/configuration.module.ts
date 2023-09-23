import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { ConfigComponent } from './config/config.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { TemplateComponent } from './template/template.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PackageSettingComponent } from './package-setting/package-setting.component';
import { ServiceSettingComponent } from './service-setting/service-setting.component';
import { ApprovalComponent } from './approval/approval.component';


@NgModule({
  declarations: [
    ConfigurationComponent,
    ConfigComponent,
    TemplateComponent,
    PackageSettingComponent,
    ServiceSettingComponent,
    ApprovalComponent
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    AngularEditorModule
  ]
})
export class ConfigurationModule { }
