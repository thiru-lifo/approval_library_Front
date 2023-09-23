import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { ConsoleService } from "src/app/service/console.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { NotificationService } from "src/app/service/notification.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { language } from "src/environments/language";

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss']
})
export class PrivilegesComponent implements OnInit {

  constructor(
    private api : ApiService,
    private notification : NotificationService,
    private dialog:MatDialog, private logger : ConsoleService) { }

  crudName = "Add";
  value= "Active";
  privileges = [];
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
    description: new FormControl("", [Validators.required]),
    status: new FormControl(""),
    sequence : new FormControl("", [Validators.required]),
  });

  displayedColumns: string[] = [
    "name",
    "code",
    "description",
    "status",
    "edit",
    "delete",
  ];
  dataSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getPrivileges();
  }

  initForm() {
    this.editForm.setValue({
      id: "",
      name: "",
      code: "",
      created_by: "1",
      created_ip: "127.0.0.1",
      description: "",
      status: "1",
      sequence : ''
    });
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  getPrivileges() {
    this.api
      .getAPI(environment.API_URL + "access/privileges")
      .subscribe((res) => {
        //this.logger.log('privileges',res);
        this.dataSource = new MatTableDataSource(res.data);
        this.privileges = res.data;
        this.dataSource.paginator = this.pagination;
      });
  }

  create() {
    this.crudName = "Add";
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    element.checked = true;
  }

  populate(data) {
    this.editForm.patchValue(data);
  }

  onUpdate(data) {
    this.crudName = "Edit";
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

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "access/privileges/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status=='success') {
            this.notification.warn(language[environment.DEFAULT_LANG].deleteMsg);
            this.getPrivileges();
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
      this.editForm.value.status = this.editForm.value.status ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "access/privileges/details",
          this.editForm.value
        )
        .subscribe((res) => {
          //this.logger.log('FormValue',res);
          if(res.status=='success') {
          this.notification.success(res.message);
          this.getPrivileges();

        } else {
          this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
        }
        this.closebutton.nativeElement.click();
        });
    }
  }
  close() {
    // this.initForm();
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if(this.filterValue){
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getPrivileges();
    }
  }

}
