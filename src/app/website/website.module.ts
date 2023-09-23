import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsiteRoutingModule } from './website-routing.module';
import { PagesComponent } from './pages/pages.component';
import { SlidersComponent } from './sliders/sliders.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ContactusComponent } from './contactus/contactus.component';


@NgModule({
  declarations: [
    PagesComponent,
    SlidersComponent,
    ContactusComponent
  ],
  imports: [
    CommonModule,
    WebsiteRoutingModule,    
    NgbModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class WebsiteModule { }
