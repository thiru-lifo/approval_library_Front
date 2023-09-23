import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
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
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  displayedColumns: string[] = [
    "trial_unit",
    "page_title",
    "page_content",
    "page_featured_image",
    "page_status",
    "view",
    "edit",
    "delete",
  ];
  dataSource: MatTableDataSource<any>;

  country: any;
  public crudName = "Add";
  public countryList = [];
  filterValue:any;
  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;

  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
  };

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService) {
  }

  public editForm = new FormGroup({
    id: new FormControl(""),
    trial_unit: new FormControl("",[Validators.required]),
    page_title: new FormControl("", [
      Validators.required,
    ]),
    // description: new FormControl(""),
    page_slug: new FormControl(""),
    page_featured_image: new FormControl(""),
    page_content: new FormControl("", [Validators.required]),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),  
    page_status: new FormControl("", [Validators.required]),
  });
   page_status = this.editForm.value.page_status;
   ImgUrl: any;
   env:any;
  populate(data) {
    this.editForm.patchValue(data);
    this.editForm.patchValue({trial_unit:data.trial_unit.id});
    this.editForm.patchValue({modified_by:this.api.userid.user_id});
    //this.logger.info(data.page_status)
    if(data?data.page_featured_image:""){
    var img_link = data.page_featured_image;
    var trim_img = img_link.substring(1)
    this.ImgUrl = environment.API_URL + trim_img;

  }
  }

  initForm() {
    this.editForm.patchValue({
      page_status: "1",
    });
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
     this.getPages();
     this.getAccess();
     this.getTrialUnits();
     var img =environment.API_URL;
     this.env = img.substring(0,img.length-1)
  }

  trialUnits:any;
  getTrialUnits() {
    this.api
      .getAPI(environment.API_URL + "master/trial_units?status=1")
      .subscribe((res) => {
        this.trialUnits = res.data;
      });
  }

  getPages() {
    this.api.displayPageloading(true);
    this.api
      .getAPI(environment.API_URL + "website/pages")
      .subscribe((res) => {
        this.api.displayPageloading(false);
        this.dataSource = new MatTableDataSource(res.data);
        this.countryList = res.data;
        this.dataSource.paginator = this.pagination;
        //this.logger.log('country',this.countryList)
      });
  }

  create() {
    this.crudName = "Add";
    this.isReadonly=false;
    this.editForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    element.checked = true;
  }

  editOption(country) {
    this.isReadonly=false;
    this.editForm.enable();
    this.crudName = "Edit";
    //this.logger.info(country);
    this.populate(country);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.page_status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
  }

  onView(country) {
    this.crudName = 'View';
    this.isReadonly=true;
    this.editForm.disable();
    this.populate(country);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.page_status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
  }

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "website/pages/crud", {
          id: id,
          page_status: 3,
        }).subscribe((res)=>{
          //this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            //this.logger.info('delete')
            this.notification.warn('Trial Type '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getPages();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  onSubmit() {
  //  this.editForm.value.created_by = this.api.userid.user_id;
   this.editForm.value.page_status = this.editForm.value.page_status==true ? 1 : 2;
    const formData = new FormData();
    formData.append('id', this.editForm.value.id);
    formData.append('page_title', this.editForm.value.page_title);
    formData.append('page_content', this.editForm.value.page_content);
    formData.append('trial_unit', this.editForm.value.trial_unit);
    formData.append('page_slug', this.editForm.value.page_slug);
    if(this.imgToUpload!=null){
    formData.append('page_featured_image', this.imgToUpload);
    }
    formData.append('page_status', this.editForm.value.page_status);
     if (this.editForm.valid) {

      this.api
        .postAPI(
          environment.API_URL + "website/pages/crud",
          formData
        )
        .subscribe((res) => {
          //this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // //this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getPages();
            this.editForm.get('file_name').reset();
            this.editForm.controls['file_name'].reset();
            this.closebutton.nativeElement.click();
          } else if(res.status==environment.ERROR_CODE) {
            this.error_msg=true;
            this.ErrorMsg=res.message;
            setTimeout(()=> {
              this.error_msg = false;
           }, 2000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
  }
imgToUpload: File | null = null;
  onImageHandler(event) {
    //console.log(event, event.target.files[0])
    if (event.target.files.length > 0) {
      this.imgToUpload = event.target.files[0];


    };

  }

  getAccess() {
    this.moduleAccess=this.api.getPageAction();
    if(this.moduleAccess)
    {
      let addPermission=(this.moduleAccess).filter(function(access){ if(access.code=='ADD') return access.status; }).map(function(obj) {return obj.status;});
      let editPermission=(this.moduleAccess).filter(function(access){ if(access.code=='EDIT') { return access.status;} }).map(function(obj) {return obj.status;});;
      let viewPermission=(this.moduleAccess).filter(function(access){ if(access.code=='VIW') { return access.status;} }).map(function(obj) {return obj.status;});;
      let deletePermission=(this.moduleAccess).filter(function(access){ if(access.code=='DEL') { return access.status;} }).map(function(obj) {return obj.status;});;
      this.permission.add=addPermission.length>0?addPermission[0]:false;
      this.permission.edit=editPermission.length>0?editPermission[0]:false;;
      this.permission.view=viewPermission.length>0?viewPermission[0]:false;;
      this.permission.delete=deletePermission.length>0?deletePermission[0]:false;;
    }

    //this.logger.log('this.permission',this.permission);
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if(this.filterValue){
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getPages();
    }
  }

}
