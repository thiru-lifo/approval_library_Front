import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ApiService } from "src/app/service/api.service";
import { ConsoleService } from "src/app/service/console.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { NotificationService } from "src/app/service/notification.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { language } from "src/environments/language";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-states",
  templateUrl: "./states.component.html",
  styleUrls: ["./states.component.scss"],
})
export class StatesComponent implements OnInit {
  stateList = [];
  countries = [];
  regions = [];
  state: any;
  crudName = "Add";
  isReadonly=false;
  moduleAccess:any;
  filterValue:any;
  ErrorMsg:any;
  error_msg=false;
  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
  };

  displayedColumns: string[] = [
    "name",
    "code",
    "country",
    "region",
    "status",
    "view",
    "edit",
    "delete",
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild("closebutton") closebutton;
  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(private api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private logger : ConsoleService) {

  }

  ngOnInit(): void {
    this.getStates();
    this.getcountry();
    this.getAccess();
  }

  editForm = new FormGroup(
    {
      id: new FormControl(""),
      name: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z ]+")]),
      code: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z0-9 ]+")]),
      created_by: new FormControl(""),
      created_ip: new FormControl(""),
      modified_by: new FormControl(""),
      country: new FormControl("", [Validators.required]),
      region: new FormControl("", [Validators.required]),
      status: new FormControl(""),
      sequence : new FormControl("", [Validators.pattern("^[0-9]*$")]),
    });

  initForm() {
    this.editForm.patchValue({
      status: "1",
    });
  }

  populate(data) {
    this.getRegion({value:data.country.id})
    this.editForm.patchValue({country:data.country.id});
    this.editForm.patchValue({id:data.id});
    this.editForm.patchValue({name:data.name});
    this.editForm.patchValue({status:data.status});
    this.editForm.patchValue({code:data.code});
    this.editForm.patchValue({region:data.region.id});
    this.editForm.patchValue({created_by:data.created_by});
    this.editForm.patchValue({created_ip:data.created_ip});
    this.editForm.patchValue({modified_by:this.api.userid.user_id});
    this.editForm.patchValue({sequence:data.sequence});
    //console.log(JSON.parse(data));
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  getStates() {
    this.api.getAPI(environment.API_URL + "master/states").subscribe((res) => {
      this.dataSource = new MatTableDataSource(res.data);
      this.stateList = res.data;
      this.dataSource.paginator = this.pagination;
      //this.logger.log('states',this.stateList);
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

  getRegion(id) {
    //this.logger.info(id)
    this.api
    .getAPI(environment.API_URL + "master/region?status=1&country_id="+id.value)
    .subscribe((res)=> {
      this.regions = res.data;
      //this.logger.log('regions',this.regions);
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

  onUpdate(state) {
    this.crudName = "Edit";
    this.isReadonly=false;
    this.editForm.enable();
    //this.logger.info(state);
    this.populate(state);
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
      data:language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "master/states/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          //this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            //this.logger.info('delete')
            this.notification.warn('State details '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getStates();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.editForm.value.created_by = this.api.userid.user_id;
      this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "master/states/details",
          this.editForm.value
        )
        .subscribe((res) => {
          //this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.success(res.message);
            this.getStates();
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
      this.getStates();
    }
  }
}
