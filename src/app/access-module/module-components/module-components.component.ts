import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { ConsoleService } from "src/app/service/console.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective} from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { NotificationService } from "src/app/service/notification.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { language } from "src/environments/language";

@Component({
  selector: 'app-module-components',
  templateUrl: './module-components.component.html',
  styleUrls: ['./module-components.component.scss']
})
export class ModuleComponentsComponent implements OnInit {

  constructor(private api : ApiService,
    private notification : NotificationService,
    private dialog : MatDialog, private logger : ConsoleService) { }

  crudName = "Add";
  modules=[];
  modulescomponents = [];
  Privileges =[];
  data: any;
  action:any;
  allSelected=false;
  filterValue:any;

  @ViewChild("closebutton") closebutton;
  @ViewChild('select') select: MatSelect;
  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  editForm = new FormGroup({
    id: new FormControl(""),
    module: new FormControl("", [Validators.required]),
    type: new FormControl("", [Validators.required]),
    name: new FormControl("", [Validators.required]),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    action: new FormControl("", [Validators.required]),
    url: new FormControl("", [Validators.required]),
    status: new FormControl(""),
    sequence : new FormControl("", [Validators.required]),
  });

  displayedColumns: string[] = [    "module",
    // "type",
    "name",
    "sequence",
    "status",
    "url",
    "edit",
    "delete",
  ];
  dataSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getModulesComponents();
    this.getModule();
  }

  initForm() {
    this.editForm.setValue({
      id: "",
      module: "",
      name:"",
      type: "type",
      created_by: "1",
      created_ip: "127.0.0.1",
      url : "",
      action: "",
      status: "1",
      sequence :"",
    });
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  getModulesComponents() {
    this.api
      .getAPI(environment.API_URL + "access/modulecomponents")
      .subscribe((res) => {
        //this.logger.log('components',res);
        this.dataSource = new MatTableDataSource(res.data);
        this.modulescomponents = res.data;
        this.dataSource.paginator = this.pagination;
        let filterValue=(document.querySelector('.search-mat-table') as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      });
  }
  moduleChange(event) {
    this.getPrivileges(event.action);
  }
  getPrivileges(actions) {
    let condition ="";
    if(actions) {
       this.action = actions.map(function(a){return a['id']})
        condition='?id=['+this.action+']';
    }
    this.api
    .getAPI(environment.API_URL + "access/privileges"+condition )
    .subscribe((res)=> {
    let filter = res.data.filter(function(el){
        return el.status !=2
      });
      this.Privileges = filter;
    });
  }
  getModule() {
    this.api
    .getAPI(environment.API_URL + "access/modules")
    .subscribe((res)=> {
      this.modules = res.data;
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
    let moduleList = (this.modules).filter(type => {
      return type.name==data.module.name
    })
    this.editForm.patchValue({module:moduleList[0]});
    // let strC=(data.action).replace('[','');
    // strC=(strC).replace(']','');
    // let actionArray=strC.split(',');
    // actionArray=actionArray.map(this.makeParseInt);
    // this.editForm.patchValue({action:actionArray});
    let actions = data.action.map(function(a){return a['id'];});
    this.editForm.patchValue({action:actions});
    this.editForm.patchValue({id:data.id});
    this.editForm.patchValue({type:data.type});
    this.editForm.patchValue({url:data.url});
    this.editForm.patchValue({created_by:data.created_by});
    this.editForm.patchValue({created_ip:data.created_ip});
    this.editForm.patchValue({sequence:data.sequence});
    this.editForm.patchValue({status:data.status});
    this.editForm.patchValue({name:data.name});
    // //this.logger.info(data.type);


  }
  makeParseInt(str)
  {
    return parseInt(str);
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
        this.api.postAPI(environment.API_URL + "access/modulecomponents/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status=='success') {
            this.notification.warn(language[environment.DEFAULT_LANG].deleteMsg);
            this.getModulesComponents();
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
      this.editForm.value.module = this.editForm.value.module.id;
      this.editForm.value.status = this.editForm.value.status ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "access/modulecomponents/details",
          this.editForm.value,
        )
        .subscribe((res) => {
          //this.logger.log('FormValue',res);
          if(res.status=='success') {
          this.notification.success(res.message);
          this.getModulesComponents();
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
      this.getModulesComponents();
    }
  }

}
