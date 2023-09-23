import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MetismenuAngularModule } from "@metismenu/angular";
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { DropdownkmsComponent } from './sidemenu/dropdownkms/dropdownkms.component';

@NgModule({
  declarations: [
    HeaderComponent,
    DropdownkmsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MetismenuAngularModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class TemplatesModule { }
