import { Component, OnInit, ViewChild, Input, ElementRef  } from '@angular/core';
// import { ApiService } from "src/app/service/api.service";
// import { environment } from "src/environments/environment";
// import { NotificationService } from "src/app/service/notification.service";

import { ApiService } from "src/app/service/api.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "src/app/service/notification.service";
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "src/environments/language";
import { Router } from '@angular/router';
import { ConsoleService } from "src/app/service/console.service";
import { of } from 'rxjs';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {

  displayedColumns: string[] = [
    "#",
    "created_on",
    "trail_unit",
    "name",
    "email",
    "mobile",
    "message",
  ];
  dataSource: MatTableDataSource<any>;

  public enquiryData = [];
  filterValue:any;


  @ViewChild(MatPaginator) pagination: MatPaginator;

  // constructor() { }
  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService) {
  }

  ngOnInit(): void {
    this.getEnquiryData();
  }

  getEnquiryData() {
    this.api.displayPageloading(true);
    this.api
      .getAPI(environment.API_URL + "website/contact")
      .subscribe((res) => {
        this.api.displayPageloading(false);
        this.dataSource = new MatTableDataSource(res.data);
        this.enquiryData = res.data;
        this.dataSource.paginator = this.pagination;
      });
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if(this.filterValue){
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getEnquiryData();
    }
  }
}
