import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ApiService } from "src/app/service/api.service";
import { ConsoleService } from "src/app/service/console.service";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { environment } from "src/environments/environment";
import { NotificationService } from "src/app/service/notification.service";
import { language } from "src/environments/language";
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

 temp:any;
  moduleAccess:any;
  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
  };
  countries=[];
  centers=[];
  reset=false;
  actual_template:any;
  public crudName = "Add";
  isReadonly=false;
  ErrorMsg:any;
  error_msg=false;
  templateDetails:any;
  countryDetails:any;
  centerDetails:any;
  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize','toggleEditorMode','customClasses']
    ]
};

  constructor(public api : ApiService, private logger : ConsoleService, private notification : NotificationService,) { }

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  displayedColumns: string[] = [
    "name",
    "code",
    "view",
    "edit",
  ];
  dataSource: MatTableDataSource<any>;


  public editForm = new FormGroup({
    id: new FormControl(""),
    title: new FormControl("", [Validators.required,Validators.pattern('^[a-zA-Z ]+')]),
    code: new FormControl("", [Validators.required,Validators.pattern('[a-zA-Z0-9 ]+')]),
    center: new FormControl(""),
    country: new FormControl(""),
    modified_template : new FormControl("",[Validators.required]),
    actual_template : new FormControl(""),
    created_by: new FormControl(""),
    modified_by:new FormControl("")
  });

   Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };


  ngOnInit(): void {
     this.getCountry();
     this.getAccess();
     this.getTemplate();
  }

  initForm() {
    /*this.editForm.patchValue({
      status:"1",
    });*/
  }

  getTemplate() {
    this.api.
    getAPI(environment.API_URL+"configuration/template_table")
    .subscribe((res)=>{
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.pagination;
      //this.logger.log('template',res);
    })
  }

  getTemplateCountry(country_id) {
    this.api.
    getAPI(environment.API_URL+"configuration/template_country?country_id="+country_id)
    .subscribe((res)=>{
      let data=res.data;
      if(data.length>0)
      {
        data=data[0];
        this.countryDetails=data;
        this.editForm.patchValue({id:data.id,actual_template:data.actual_template,modified_template:data.modified_template});
      }
      else
      {
        this.editForm.patchValue({id:''});
      }
    })
  }

  getTemplateCenter(center_id) {
    this.api.
    getAPI(environment.API_URL+"configuration/template_center?center_id="+center_id)
    .subscribe((res)=>{
      let data=res.data;
      if(data.length>0)
      {
        data=data[0];
        this.centerDetails=data;
        this.editForm.patchValue({id:data.id,actual_template:data.actual_template,modified_template:data.modified_template});
      }
      else
      {
        this.editForm.patchValue({id:''});
      }
    })
  }

  countrySelection(option)
  {
    let country_id=option.value;
    this.editForm.patchValue({center:''});
    if(country_id)
    {
      this.getCenter(option);
      this.getTemplateCountry(country_id);
    }
    else
    {
      this.centers=[];
      if(this.editForm.value.center)
        this.getTemplateCenter(this.editForm.value.center);
      else
        this.editForm.patchValue(this.templateDetails);
    }

  }
  centerSelection(option)
  {
    let center_id=option.value;
    if(center_id)
    {
      this.getTemplateCenter(center_id);
    }
    else
    {
      if(this.editForm.value.country)
        this.getTemplateCountry(this.editForm.value.country);
      else
        this.editForm.patchValue(this.templateDetails);
    }

  }

  getCountry() {
    this.api
    .getAPI(environment.API_URL + "master/countries?status=1")
    .subscribe((res)=> {
      this.countries = res.data;
      //this.logger.log('countries',this.countries);
    });
  }

  getCenter(option) {
    this.api
    .getAPI(environment.API_URL + "master/center?status=1&country_id="+option.value)
    .subscribe((res)=> {
      this.centers = res.data;
      //this.logger.log('centers',this.centers);
    });
  }

  populate(data) {
    this.templateDetails=data;
    this.editForm.patchValue(data);
    this.editForm.patchValue({country:'',center:''});
  }

  create() {
    this.crudName = "Add";
    this.isReadonly=false;
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
  }

  onEdit(template) {
    this.crudName = "Edit";
    this.isReadonly=false;
    this.populate(template);
    this.editorConfig.editable=true;
    /*//this.logger.info(template);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }*/
  }

  onView(template) {
    this.crudName = "View";
    this.isReadonly=true;
    this.editorConfig.editable=false;
    //console.log('editorConfig',this.editorConfig);
    this.populate(template);
  }

  onReset() {

    if(this.editForm.value.center)
    {
      this.editForm.patchValue({modified_template:this.centerDetails.actual_template});
    }
    else if(this.editForm.value.country)
    {
      this.editForm.patchValue({modified_template:this.countryDetails.actual_template});
    }
    else
    {
      this.editForm.patchValue({modified_template:this.templateDetails.actual_template});
    }
  }

  close() {
    this.reset=false;
  }

  onSubmit() {
    //this.logger.log('form',this.editForm.value)
    if(this.editForm.valid) {
      let saveData=this.editForm.value;

      let endPoint=environment.API_URL + "configuration/template_table/details";
      if(this.editForm.value.center)
      {
        endPoint=environment.API_URL + "configuration/template_center/details";
        saveData.template=this.templateDetails.id;
      }
      else if(this.editForm.value.country)
      {
        endPoint=environment.API_URL + "configuration/template_country/details";
        saveData.template=this.templateDetails.id;
      }
      else
        delete saveData.template;

      saveData.created_by = this.api.userid.user_id;
      saveData.status = this.editForm.value.status==true ? 1 : 2;
      this.api
        .postAPI(
          endPoint,
          saveData
        )
        .subscribe((res) => {
            //this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.success(res.message);
            this.getTemplate();
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

 gettemp(val){
//console.log(val);
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


}
