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
  selector: 'app-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.scss']
})
export class SlidersComponent implements OnInit {

  displayedColumns: string[] = [
    "trial_unit",
    "sequence",
    "title",
    "description",
    "image",
    "status",
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
    sequence : new FormControl("", [Validators.pattern("^[0-9]*$")]),
    title: new FormControl("", [
      Validators.required,
    ]),
    // description: new FormControl(""),
    slider_link: new FormControl(""),
    image: new FormControl(""),
    description: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z0-9 ]+")]),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),  
    status: new FormControl("", [Validators.required]),
  });
   status = this.editForm.value.status;
   ImgUrl: any;
   env:any;
  populate(data) {
    this.editForm.patchValue(data);
    this.editForm.patchValue({trial_unit:data.trial_unit.id});
    this.editForm.patchValue({modified_by:this.api.userid.user_id});
    //this.logger.info(data.status)
    if(data?data.image:""){
    var img_link = data.image;
    var trim_img = img_link.substring(1)
    this.ImgUrl = environment.API_URL + trim_img;

  }
  }

  initForm() {
    this.editForm.patchValue({
      status: "1",
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
      .getAPI(environment.API_URL + "website/sliders")
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
    if(this.editForm.value.status == 1) {
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
    if(this.editForm.value.status == 1) {
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
        this.api.postAPI(environment.API_URL + "website/sliders/crud", {
          id: id,
          status: 3,
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
   this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
    const formData = new FormData();
    formData.append('id', this.editForm.value.id);
    formData.append('title', this.editForm.value.title);
    formData.append('description', this.editForm.value.description);
    formData.append('trial_unit', this.editForm.value.trial_unit);
    formData.append('slider_link', this.editForm.value.slider_link);
    formData.append('sequence', this.editForm.value.sequence);
    if(this.imgToUpload!=null){
    formData.append('image', this.imgToUpload);
    }
    formData.append('status', this.editForm.value.status);
     if (this.editForm.valid) {

      this.api
        .postAPI(
          environment.API_URL + "website/sliders/crud",
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
