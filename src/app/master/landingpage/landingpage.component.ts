import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, FormArray } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "src/app/service/notification.service";
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "src/environments/language";
import { Router } from '@angular/router';
import { ConsoleService } from "src/app/service/console.service";
import { of } from 'rxjs';
declare var inArray:any;

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
  displayedColumns: string[] = [
    "name",
    "code",
    "url_type",
    "url",
    "logo",
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
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService,private formBuilder: FormBuilder) {
  }

  public editForm = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [
      Validators.required,
    ]),
    // description: new FormControl(""),
    url_type: new FormControl("",[
      Validators.required,
    ]),
    url_target : new FormControl("",[
      Validators.required,
    ]),
    url: new FormControl("",[
      Validators.required,
    ]),
    logo: new FormControl(""),
    code: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z0-9 ]+")]),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),
    sequence : new FormControl("", [Validators.pattern("^[0-9]*$")]),
    status: new FormControl("", [Validators.required]),
  });
   status = this.editForm.value.status;
   ImgUrl: any;
   env:any;
  populate(data) {
    console.log(data);
    this.items = this.docForm.get('items') as FormArray;
    this.clearFormArray(this.items);
    this.editForm.patchValue(data);
    // this.editForm.patchValue({trial_unit:data.trial_unit.id});
    this.editForm.patchValue({ modified_by: this.api.userid.user_id });
    //this.logger.info(data.status)
    if (data ? data.logo : "") {
      var img_link = data.logo;
      var trim_img = img_link.substring(1)
      this.ImgUrl = environment.API_URL + trim_img;
    }
    if (data.satellite_data.length > 0) {
      let satellite_unit = '';
      let url = '';
      for (let i = 0; i < data.satellite_data.length; i++) {
        if (data.satellite_data[i].satellite_unit != null || data.satellite_data[i].url != null) {
          satellite_unit = data.satellite_data[i].satellite_unit;
          url = data.satellite_data[i].url;
          this.items.push(this.formBuilder.group({ satellite_unit: satellite_unit, url: url }));
        }
        else {
      this.items = this.docForm.get('items') as FormArray;
      this.items.push(this.formBuilder.group({ satellite_unit: '', url: '' }));
    }

      }

    }
    else {
      this.items = this.docForm.get('items') as FormArray;
      this.items.push(this.formBuilder.group({ satellite_unit: '', url: '' }));
    }
  }
public docForm = new FormGroup({
          items: new FormArray([]),
      });

  items!: FormArray;
  addMore(): void {
    this.items = this.docForm.get('items') as FormArray;
    this.items.push(this.createItem());
    // console.log(this.items)
  }

  removeItem(i): void {
    this.items.removeAt(i);
    /*delete this.items.value[i];
    delete this.items.controls[i];*/
    // console.log(this.items)
  }

createItem(): FormGroup {
    return this.formBuilder.group({
      satellite_unit: '',
      url:''
    });
  }

    clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
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
    this.getLanding();
     this.getAccess();
     var img =environment.API_URL;
     this.env = img.substring(0,img.length-1)
  }




  getLanding() {
    this.api.displayPageloading(true);
    this.api
      .getAPI(environment.API_URL + "master/landing")
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
    this.items = this.docForm.get('items') as FormArray;
    this.clearFormArray(this.items);
    this.items.push(this.formBuilder.group({satellite_unit: '',url:''}));
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
        this.api.postAPI(environment.API_URL + "master/landing/crud", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          //this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            //this.logger.info('delete')
            this.notification.warn('Trial Type '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getLanding();
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
    this.editForm.value.status = this.editForm.value.status == true ? 1 : 2;
    const formData = new FormData();
    formData.append('id', this.editForm.value.id);
    formData.append('name', this.editForm.value.name);
    formData.append('code', this.editForm.value.code);
    formData.append('url_type', this.editForm.value.url_type);
    formData.append('url_target', this.editForm.value.url_target);
    formData.append('url', this.editForm.value.url);
    if(this.imgToUpload!=null){
    formData.append('logo', this.imgToUpload);
    }
    formData.append('status', this.editForm.value.status);
    formData.append('sequence', this.editForm.value.sequence);
    formData.append('satellite_data', JSON.stringify(this.items.value));

      this.api
        .postAPI(
          environment.API_URL + "master/landing/crud",formData
        )
        .subscribe((res) => {
          //this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // //this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getLanding();
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
      this.getLanding();
    }
  }


}
