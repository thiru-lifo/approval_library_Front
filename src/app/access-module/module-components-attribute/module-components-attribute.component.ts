import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-module-components-attribute',
  templateUrl: './module-components-attribute.component.html',
  styleUrls: ['./module-components-attribute.component.scss']
})
export class ModuleComponentsAttributeComponent implements OnInit {

  constructor(private api : ApiService,
    private notification : NotificationService,
    private dialog : MatDialog, private logger : ConsoleService) { }

  crudName = "Add";
  components=[];
  attributes = [];
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
    module_component: new FormControl("", [Validators.required]),
    type: new FormControl("", [Validators.required]),
    name: new FormControl("", [Validators.required]),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    action: new FormControl("", [Validators.required]),
    url: new FormControl("", [Validators.required]),
    status: new FormControl(""),
    sequence : new FormControl(""),
  });

  displayedColumns: string[] = [
    "module_component",
    // "type",
    "name",
    "sequence",
    "status",
    "edit",
    "delete",
  ];
  dataSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getAttributes();
    this.getComponent();
  }


  initForm() {
    this.editForm.setValue({
      id: "",
      module_component: "",
      type: "",
      name :"",
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

  getAttributes() {
    this.api
      .getAPI(environment.API_URL + "access/module_components_attribute")
      .subscribe((res) => {
        //this.logger.log('attributes',res);
        this.dataSource = new MatTableDataSource(res.data);
        this.attributes = res.data;
        this.dataSource.paginator = this.pagination;
      });
  }

  moduleChange(event) {
    this.getPrivileges(event.action);
  }
  getPrivileges(actions) {
    let condition = "";
    if(actions) {
      this.action = actions.map(function(a){return a["id"]})
      condition='?id=['+this.action+']';
    }
    this.api
    .getAPI(environment.API_URL + "access/privileges"+condition)
    .subscribe((res)=> {
       let filter = res.data.filter(function(el){
        return el.status !=2
      });
      this.Privileges = filter;
    });
  }
  getComponent() {
    this.api
    .getAPI(environment.API_URL + "access/modulecomponents")
    .subscribe((res)=> {
      this.components = res.data;
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
    let componentList = (this.components).filter(type => {return type.name==data.module_component.name});
    this.editForm.patchValue({module_component:componentList[0]});
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
    //this.logger.info(data.type);

  }
  makeParseInt(str)
  {
    return parseInt(str);
  }
  onUpdate(data) {
    this.crudName = "Edit";
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
        this.api.postAPI(environment.API_URL + "access/module_components_attribute/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status=='success') {
            this.notification.warn(language[environment.DEFAULT_LANG].deleteMsg);
            this.getAttributes();
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
      this.editForm.value.module_component = this.editForm.value.module_component.id;
      this.editForm.value.status = this.editForm.value.status ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "access/module_components_attribute/details",
          this.editForm.value,
        )
        .subscribe((res) => {
          //this.logger.log('FormValue',res);
          if(res.status=='success') {
          this.notification.success(res.message);
          this.getAttributes();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }
          this.closebutton.nativeElement.click();
        });
    }
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
      this.getAttributes();
    }
  }

}
