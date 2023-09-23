import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { ConsoleService } from "src/app/service/console.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { NotificationService } from "src/app/service/notification.service";
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { language } from 'src/environments/language';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.scss']
})
export class PriorityComponent implements OnInit {

  constructor(private api : ApiService , private notification : NotificationService,
    private dialog:MatDialog, private logger : ConsoleService) { }

  crudName = "Add";
  priority = [];
  data: any;

  moduleAccess:any;
  filterValue:any;
  isReadonly=false;
  ErrorMsg:any;
  error_msg=false;
  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
  };

  @ViewChild("closebutton") closebutton;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  editForm = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z ]+")]),
    code: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z0-9 ]+")]),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),
    description: new FormControl(""),
    status: new FormControl(""),
    sequence:new FormControl("",[Validators.pattern("^[0-9]*$")])
  });

  displayedColumns: string[] = [
    "name",
    "code",
    "description",
    "status",
    "view",
    "edit",
    "delete",
  ];
  dataSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getPriority();
    this.getAccess();
  }

  initForm() {
    this.editForm.patchValue({
      status: "1",
    });
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  getPriority() {
    this.api
      .getAPI(environment.API_URL + "master/priority")
      .subscribe((res) => {
        //this.logger.log('priority',res);
        this.dataSource = new MatTableDataSource(res.data);
        this.priority = res.data;
        this.dataSource.paginator = this.paginator;
      });
  }

  create() {
    this.crudName = "Add";
    this.isReadonly=false;
    this.editForm.enable();
    let reset=this.formGroupDirective.resetForm();
    if(reset!==null){
     this.initForm();
    }
  }

  populate(data) {
    this.editForm.patchValue(data);
    this.editForm.patchValue({modified_by:this.api.userid.user_id});
    //console.log(JSON.parse(data));
  }

  onUpdate(data) {
    this.crudName = "Edit";
    this.isReadonly=false;
    this.editForm.enable();
    //this.logger.info(data);
    this.populate(data);
    let Element=<HTMLInputElement> document.getElementById("exampleCheck1")
   if(this.editForm.value.status == 1){
     Element.checked=true;
   }else{
    Element.checked=false;
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
        this.api.postAPI(environment.API_URL + "master/priority/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn('Priority details '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getPriority();
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
          environment.API_URL + "master/priority/details",
          this.editForm.value
        )
        .subscribe((res) => {
          //this.logger.log('FormValue',res);
          if(res.status==environment.SUCCESS_CODE) {
          this.notification.success(res.message);
          this.getPriority();
          this.closebutton.nativeElement.click();
        } else if(res.status==environment.ERROR_CODE) {
          this.error_msg=true;
          this.ErrorMsg=res.message;
            setTimeout(()=> {
              this.error_msg = false;
           }, 2000);
        } else {
          this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit)
        }
      });
    }
  }
  close() {
    // this.initForm();
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
      this.getPriority();
    }
  }
}
