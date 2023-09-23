import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { SlidersComponent } from './sliders/sliders.component';
import { ContactusComponent } from './contactus/contactus.component';

const routes: Routes = [

  { path: 'pages', component: PagesComponent },
  { path: 'sliders', component: SlidersComponent },
  { path: 'enquiry', component: ContactusComponent},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class WebsiteRoutingModule { }
