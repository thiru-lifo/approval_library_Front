import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { ConsoleService } from "src/app/service/console.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "src/app/service/notification.service";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { language } from "src/environments/language";

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  constructor(
    private api : ApiService,
    private notification : NotificationService,
    private dialog:MatDialog, private logger: ConsoleService,
    ) { }


  crudName = "Add";
  roles = [];
  data: any;
  filterValue:any;

  @ViewChild("closebutton") closebutton;
  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  editForm = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [Validators.required]),
    code: new FormControl("", [Validators.required]),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    is_biometric: new FormControl(""),
  });

  displayedColumns: string[] = [
    "name",
    "code",
    "edit",
    "delete",
  ];
  dataSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getRoles();
  }

  initForm() {
    this.editForm.setValue({
      id: "",
      name: "",
      code:"",
      created_by: "1",
      created_ip: "127.0.0.1",
      is_biometric: "",
    });
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  getRoles() {
    this.api
      .getAPI(environment.API_URL + "access/access_user_roles")
      .subscribe((res) => {
        //this.logger.log('roles',res);
        this.dataSource = new MatTableDataSource(res.data);
        this.roles = res.data;
        this.dataSource.paginator = this.pagination;
      });
  }

  create() {
    this.crudName = "Add";
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
  }

  populate(data) {
    this.editForm.patchValue(data);
  }

  onUpdate(data) {
    this.crudName = "Edit";
    //this.logger.info(data);
    this.populate(data);
    // var element = <HTMLInputElement> document.getElementById("exampleCheck2");
    // if(this.editForm.value.is_biometric == 1) {
    //   element.checked = true;
    // }
    // else {
    //   element.checked = false;
    // }
  }

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "access/access_user_roles/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE){
            this.notification.warn(language[environment.DEFAULT_LANG].deleteMsg);
            this.getRoles();
          } else if(res.status==environment.ERROR_CODE) {
            this.notification.displayMessage(res.message);
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
      this.api
        .postAPI(
          environment.API_URL + "access/access_user_roles/details",
          this.editForm.value
        )
        .subscribe((res) => {
          //this.logger.log('FormValue',res);
         if(res.status==environment.SUCCESS_CODE){
            // //this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getRoles();
            this.closebutton.nativeElement.click();
          } else if(res.status==environment.ERROR_CODE) {
            this.notification.displayMessage(res.message);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }
        this.closebutton.nativeElement.click();
        });
    }
  }
  close() {
    this.initForm();
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if(this.filterValue){
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getRoles();
    }
  }

}
