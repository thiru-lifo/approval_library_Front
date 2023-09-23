import { Component, OnInit,ElementRef,AfterContentInit,ViewChild } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { ConsoleService } from "src/app/service/console.service";
import { environment } from "src/environments/environment";
import { Router } from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  public modules=[];
  public mKey=0;
  menuElement:any;
  public moduleLoaded:any;
  public loginDetail:any;
  constructor(private api : ApiService,private _elementRef : ElementRef,private router: Router,
    private logger : ConsoleService) {
    let tokenDetail=this.api.decryptData(localStorage.getItem('token-detail'));
    this.loginDetail=tokenDetail;

   }

  roleName:any;

  @ViewChild('sidemenu', { static: true, read: ElementRef }) sidemenu: ElementRef;

  ngOnInit(): void {
    let tokenDetail=this.api.decryptData(localStorage.getItem('token-detail'));
    this.loginDetail=tokenDetail;
    if(this.loginDetail.role_center.length==1) {
      this.roleName = this.loginDetail.role_center[0].user_role.code
    } else {
      this.roleName=this.loginDetail.role_code;
    }

    if(this.loginDetail.permissions)
    {
      this.modules=JSON.parse(tokenDetail.permissions);
      console.log('this.modules',this.modules);
    }
  }

  ngAfterContentInit():void{

  }


  goToPage(url)
  {
    //console.log('url',url);
    if(url)
      this.router.navigateByUrl(url);

  }
  getPageAction(modules)
  {
    let components = modules.map(value => value.components);
    let mergedComponents = [].concat.apply([], components);

    let attributes = mergedComponents.map(value => value.attributes);
    let mergedAttributes = [].concat.apply([], attributes);


    let currentPath=location.pathname;
    currentPath=currentPath.substring(1);

    let currentPageAction = mergedComponents.map(value => value.url==currentPath?value.action:'');

    var filtered = currentPageAction.filter(function (el) {
      return el != '';
    });
    let finalActions=filtered.length>0?filtered[0]:'';
    if(finalActions!='')
    {
      let filterStatus = finalActions.map(value => value.status==true?value:'');
      var filteredStatus = filterStatus.filter(function (el) {
        return el != '';
      });
      return filteredStatus;
    }
    else
      return '';

  }

}
