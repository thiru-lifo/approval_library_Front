import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "src/app/service/api.service";
import { ConsoleService } from "src/app/service/console.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { NotificationService } from "src/app/service/notification.service";
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "src/environments/language";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit {

 constructor(private api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private logger : ConsoleService) {}

  crudName = "Add";
  region = [];
  countries=[];
  data: any;
  isReadonly=false;
  ErrorMsg:any;
  error_msg=false;

  moduleAccess:any;
  filterValue:any;
  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
  };

  editForm = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z ]+")]),
    code: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z0-9 ]+")]),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),
    country: new FormControl("", [Validators.required]),
    description: new FormControl(""),
    status: new FormControl("", [Validators.required]),
    sequence : new FormControl("", [Validators.pattern("^[0-9]*$")]),
  });

  displayedColumns: string[] = [
    "name",
    "code",
    "description",
    "country",
    "status",
    "view",
    "edit",
    "delete",
  ];
  dataSource: MatTableDataSource<any>;
  @ViewChild("closebutton") closebutton;
  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  ngOnInit(): void {
    this.getRegion();
    this.getAccess();
    this.getcountry();
  }

  initForm() {
    this.editForm.patchValue({
      status: "1",
    });
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  getRegion() {
    this.api
      .getAPI(environment.API_URL + "master/region")
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.region = res.data;
        this.dataSource.paginator = this.pagination;
        //this.logger.log('region',this.region);
      });
  }

  getcountry() {
    this.api
    .getAPI(environment.API_URL + "master/countries?status=1")
    .subscribe((res)=> {
      this.countries = res.data;
      //this.logger.log('countries',this.countries);
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

  populate(data) {
    this.editForm.patchValue(data);
    this.editForm.patchValue({modified_by:this.api.userid.user_id});
    this.editForm.patchValue({country:data.country.id});
    //console.log(JSON.parse(data));
  }

  onUpdate(data) {
    this.crudName = "Edit";
    this.isReadonly=false;
    this.editForm.enable();
    //this.logger.info(data);
    this.populate(data);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
  }

   onView(data) {
    this.crudName = 'View';
    this.isReadonly=true;
    this.editForm.disable();
    this.populate(data);
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
      data:language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "master/region/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          //this.logger.log('response',res)
          if(res.status==environment.SUCCESS_CODE) {
            //this.logger.info('delete')
            this.notification.warn('Region details '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getRegion();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  onSubmit() {
    //this.logger.info(this.editForm);
    if (this.editForm.valid) {
      this.editForm.value.created_by = this.api.userid.user_id;
      this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "master/region/details",
          this.editForm.value
        )
        .subscribe((res) => {
            //this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.success(res.message);
            this.getRegion();
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
      this.getRegion();
    }
  }


}
