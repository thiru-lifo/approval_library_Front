import { Component, OnInit ,ViewChild, Input, ElementRef} from '@angular/core';
import { Router, NavigationStart,RouterStateSnapshot } from '@angular/router';
import { ApiService } from "src/app/service/api.service";
import { NotificationService } from "src/app/service/notification.service";
import { MatDialog } from "@angular/material/dialog";
import { ConsoleService } from "src/app/service/console.service";
import { environment } from "src/environments/environment";
import { HttpClient } from '@angular/common/http';





@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {




  constructor(private router : Router,public api: ApiService, private notification : NotificationService,
  private dialog:MatDialog, private elementref : ElementRef,private logger:ConsoleService,private http: HttpClient) { }

  ngOnInit(): void {
  //console.log('fgdf',this.countryList)
    this.getdata();
    localStorage.removeItem('UNITTITLE');
  }
  public countryList = [];
  ImgUrl:any;

  getdata() {
    this.http.get(environment.API_URL + "master/landing?order_column=sequence&order_type=asc&status=1")
      .subscribe((res:any) => {
        this.countryList = res.data;
        console.log('country',this.countryList)
        var Img = environment.API_URL;
        this.ImgUrl = Img.substring(0,Img.length-1);

      });
  }
   goto:any;
   type:any;
   target:any;
}
