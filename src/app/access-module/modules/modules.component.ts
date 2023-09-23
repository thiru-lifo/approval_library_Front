import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { ConsoleService } from "src/app/service/console.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { NotificationService } from "src/app/service/notification.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { language } from "src/environments/language";

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {

  constructor(private api : ApiService,
    private notification : NotificationService,
    private dialog : MatDialog, private logger : ConsoleService) { }


  crudName = "Add";
  modules = [];
  Privileges =[];
  data: any;
  allSelected=false;
  filterValue:any;

  @ViewChild("closebutton") closebutton;
  @ViewChild('select') select: MatSelect;
  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  editForm = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [Validators.required]),
    type: new FormControl("", [Validators.required]),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    action: new FormControl("", [Validators.required]),
    status: new FormControl(""),
    sequence : new FormControl("",[Validators.required]),
  });

  displayedColumns: string[] = [
    "name",
    // "type",
    // "action",
    "sequence",
    "status",
    "edit",
    "delete",
  ];
  dataSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getModules();
    this.getPrivileges();
  }

  initForm() {
    this.editForm.setValue({
      id: "",
      name: "",
      type: "type",
      created_by: "1",
      created_ip: "127.0.0.1",
      action: "",
      status: "1",
      sequence :"",
    });
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  getModules() {
    this.api
      .getAPI(environment.API_URL + "access/modules")
      .subscribe((res) => {
        //this.logger.log('modules',res);
        this.dataSource = new MatTableDataSource(res.data);
        this.modules = res.data;
        this.dataSource.paginator = this.pagination;
      });
  }
  getPrivileges() {
    this.api
    .getAPI(environment.API_URL + "access/privileges")
    .subscribe((res)=> {
      // this.Privileges = res.data;
      let filter = res.data.filter(function(el){
        return el.status !=2;
      });
      this.Privileges=filter;
      //console.log(this.Privileges)

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
    let actions = data.action.map(function(a){return a['id'];});
    this.editForm.patchValue({action:actions});
    this.editForm.patchValue({id:data.id});
    this.editForm.patchValue({type:data.type});
    this.editForm.patchValue({name:data.name});
    this.editForm.patchValue({created_by:data.created_by});
    this.editForm.patchValue({created_ip:data.created_ip});
    this.editForm.patchValue({sequence:data.sequence});
    this.editForm.patchValue({status:data.status});
}
  makeParseInt(str)
  {
    return parseInt(str);
  }

  onUpdate(data) {
    this.crudName = "Edit";
    //this.logger.info(data)
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
        this.api.postAPI(environment.API_URL + "access/modules/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status=='success') {
            this.notification.warn(language[environment.DEFAULT_LANG].deleteMsg);
            this.getModules();
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
      this.editForm.value.action = JSON.stringify(this.editForm.value.action);
      this.editForm.value.status = this.editForm.value.status ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "access/modules/details",
          this.editForm.value,
        )
        .subscribe((res) => {
          //this.logger.log('FormValue',res);
          if(res.status=='success') {
          this.notification.success(res.message);
          this.getModules();
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
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

   applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if(this.filterValue){
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getModules();
    }
  }

}
