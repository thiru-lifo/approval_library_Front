import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessControlDirective } from './access-control.directive';
import { PipePipe } from './pipe.pipe';




@NgModule({
  declarations: [
    AccessControlDirective,
    PipePipe,
   
  ],
  imports: [
    CommonModule
  ],
  exports : [
  AccessControlDirective,
  PipePipe
  ]
})
export class SharedModule { }
