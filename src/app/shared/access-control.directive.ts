import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { environment } from "src/environments/environment";

@Directive({
  selector: '[appAccessControl]'
})
export class AccessControlDirective implements OnInit {

  constructor(private elementref : ElementRef, private api : ApiService) { }

@Input("showActions") showActions : string; 

modulesAccess: any;

ngOnInit() {
  this.checkAccess();
  
}

 checkAccess() {
  this.modulesAccess=this.api.getPageAction();

  //console.log('access',this.modulesAccess);
  let access=[];
  if(this.modulesAccess)
    access = (this.modulesAccess).filter(type=>{return type.name==this.showActions});
  
  if(access.length>0) {
    this.elementref.nativeElement.style.opacity = '1';
  } else {
    this.elementref.nativeElement.remove();
  }
 }

}
