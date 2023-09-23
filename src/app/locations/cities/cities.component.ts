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
  selector: "app-cities",
  templateUrl: "./cities.component.html",
  styleUrls: ["./cities.component.scss"],
})
export class CitiesComponent implements OnInit {
  constructor(private api: ApiService, private notification : NotificationService,
    public dialog:MatDialog, private logger : ConsoleService) {}

  editForm = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [
      Validators.required,
      Validators.pattern("[a-zA-Z ]+")
    ]),
    code: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z0-9 ]+")]),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),
    state: new FormControl("", [Validators.required]),
    status: new FormControl(""),
    sequence : new FormControl("", [Validators.pattern("^[0-9]*$")]),
  });

  crudName = "Add";
  city: any;
  cityList = [];
  states =[];
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

  @ViewChild("closebutton") closebutton;
  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  displayedColumns: string[] = [
    "name",
    "code",
    "state",
    "status",
    "view",
    "edit",
    "delete",
  ];
  dataSource: MatTableDataSource<any>;

  initForm() {
    this.editForm.patchValue({
      status: "1",
    });
  }

  populate(data) {
    let stateList = (this.states).filter(type => {
      //this.logger.info(type);
      return type.name==data.state.name
    })
    this.editForm.patchValue({state:data.state.id});
    this.editForm.patchValue({id:data.id});
    this.editForm.patchValue({name:data.name});
    this.editForm.patchValue({status:data.status});
    this.editForm.patchValue({code:data.code});
    this.editForm.patchValue({created_by:data.created_by});
    this.editForm.patchValue({created_ip:data.created_ip});
    this.editForm.patchValue({modified_by:this.api.userid.user_id});
    this.editForm.patchValue({sequence:data.sequence});
    // this.editForm.patchValue(data);
    //this.logger.info(stateList);
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
    this.getCities();
    this.getStates();
    this.getAccess();
  }

  getCities() {
    this.api.getAPI(environment.API_URL + "master/cities").subscribe((res) => {
      this.dataSource = new MatTableDataSource(res.data);
      this.cityList = res.data;
      this.dataSource.paginator = this.pagination;
      //this.logger.log('cities',this.cityList);
    });
  }

  getStates() {
    this.api
    .getAPI(environment.API_URL + "master/states?status=1")
    .subscribe((res)=> {
      this.states = res.data;
      //this.logger.log('states',this.states);
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

  onUpdate(city) {
    this.crudName = "Edit";
    this.isReadonly=false;
    this.editForm.enable();
    //this.logger.info(city);
    this.populate(city);
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
        this.api.postAPI(environment.API_URL + "master/cities/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          //this.logger.log('response',res)
          if(res.status==environment.SUCCESS_CODE) {
            //this.logger.info('delete')
            this.notification.warn('City details '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getCities();
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
          environment.API_URL + "master/cities/details",
          this.editForm.value
        )
        .subscribe((res) => {
            //this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            //this.logger.log('FormValue',this.editForm.value);
            this.notification.success(res.message);
            this.getCities();
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
      this.getCities();
    }
  }


}
