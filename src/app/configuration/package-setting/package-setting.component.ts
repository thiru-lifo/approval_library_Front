import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/service/api.service';
import { ConsoleService } from 'src/app/service/console.service';
import { NotificationService } from 'src/app/service/notification.service';
import { environment } from 'src/environments/environment';
import { language } from 'src/environments/language';

@Component({
  selector: 'app-package-setting',
  templateUrl: './package-setting.component.html',
  styleUrls: ['./package-setting.component.scss'],
  providers: [DatePipe]
})
export class PackageSettingComponent implements OnInit {

  IspreganantCheck=false;
  packageList=[];
  countryList=[];
  visa_categoryList=[];
  jobPositionList=[];
  lookupVal=[];
  package_role=[];
  startDate = new FormControl(new Date(),Validators.required);
  endDate = new FormControl(new Date(),Validators.required);
  public searchStartDate='';
  public searchEndDate='';
  public startDateVar='';
  public EndDateVar='';
  packageid:any;
  countryid:any;
  visaid:any;
  jobposition_id:any;
  genderid:any;

  editForm: FormGroup;
  error = "";
  id: number;
  myModel = false;
  public crudName = "Add";
  public pack_settingList = [];
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
  accepted: Boolean = false;
  private _listner: any;


  constructor(
    public api: ApiService,
    private notification: NotificationService,
    private formBuilder:FormBuilder,
    private dialog:MatDialog, private logger : ConsoleService,
    public datepipe: DatePipe
  ) {

  }

  dataSource: MatTableDataSource<any>;
  displayedColumns = ["package","country", "visa_type","job_position","gender","status","view","edit", "delete"];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild("datepicker") datepicker;
  @ViewChild("datepicker1") datepicker1;

  ngOnInit(): void {
    this.initForm();
    this.getpackage_setting();
    this.getAccess();

    this.getpackage();
    this.getcountry();
    this.getVisaCategory();
    this.getjobPosition();
    this.getLookupVal();
    // this.getpackageset();
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      id: new FormControl(""),
      package: new FormControl("", [Validators.required]),
      country: new FormControl("",[Validators.required]),
      visa_type: new FormControl("",[Validators.required]),
      job_position:new FormControl("",[Validators.required]),
      gender:new FormControl("",[Validators.required]),
      is_pregnancy:new FormControl(""),
      effect_from:new FormControl(""),
      effect_to:new FormControl(""),
      status: new FormControl(""),
      created_by: new FormControl(""),
      created_ip: new FormControl(""),
      // modified_by:new FormControl("")
    });
  }
  effectFrom:any;
  populateForms(users) {
    var gen=this.lookupVal.filter(type=> {return type.id==users.gender.id})
    //console.log(gen);
    this.searchStartDate=users.effect_from;
    this.searchEndDate=users.effect_to;
    this.editForm.patchValue({modified_by:this.api.userid.user_id});
    this.editForm.patchValue({id:users.id});
    this.editForm.patchValue({package:users.package.id});
    this.editForm.patchValue({country:users.country.id});
    this.editForm.patchValue({visa_type:users.visa_type.id});
    this.editForm.patchValue({job_position:users.job_position.id});
    this.editForm.patchValue({gender:gen[0]});
    this.editForm.patchValue({effect_from:this.searchStartDate});
    this.editForm.patchValue({effect_to: this.searchEndDate});
    this.editForm.patchValue({status: users.status});
    // this.applicantForm.patchValue({personal:{is_pregnant:this.user_details.personal[0].is_pregnant?parseInt(this.user_details.personal[0].is_pregnant):''}});
    if(users.is_pregnancy){
      this.editForm.patchValue({is_pregnancy: users.is_pregnancy});
      if(gen[0].code=='F'){
        this.IspreganantCheck=true;
      }else
      this.IspreganantCheck=false;

    }
    //console.log(users);
  }

  initialize() {
    this.editForm.patchValue({
      id: "",
      package: "",
      country: "",
      visa_type: "",
      job_position: "",
      gender:"",
      is_pregnancy:"",
      status:"1",
      created_by: "",
      created_ip: "",
      // sequence:''
    });
     this.searchStartDate="";
     this.searchEndDate="";
  }
  getpackage_setting() {
      this.api.getAPI(environment.API_URL + "configuration/package_rules").subscribe({
      next: (res) => {
        //this.logger.log('catalog',res);
        this.dataSource = new MatTableDataSource(res.data);
        this.pack_settingList = res.data;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        //this.logger.error('error',error);
      },
    });
  }

  add() {
    this.crudName="Add";
    this.viewButton=false;
    this.isReadonly=false;
    this.datepicker.disabled=false;
    this.datepicker1.disabled=false;
    this.editForm.enable();
    let reset=this.formGroupDirective.resetForm();
    // this.initialize();
    this.IspreganantCheck=false;
    if(reset!==null){
     this.initialize();
    }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    element.checked = true;
  }
  update(package_setting) {
    this.crudName="Edit";
    this.viewButton=false;
    this.isReadonly=false;
    this.datepicker.disabled=false;
    this.datepicker1.disabled=false;
    this.editForm.enable();
    //this.logger.info(package_setting);
    this.crudName = "Edit";
    this.populateForms(package_setting);
    let Element=<HTMLInputElement> document.getElementById("exampleCheck1")
    if(this.editForm.value.status == 1){
      Element.checked=true;
    }else{
      Element.checked=false;
    }
  }

  viewButton=false;
  onView(package_setting) {
    this.crudName = 'View';
    this.editForm.disable();
    this.viewButton=true;
    this.isReadonly=true;
    this.populateForms(package_setting);
    this.datepicker.disabled=true;
    this.datepicker1.disabled=true;
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
  }

  crudSubmit() {
    //console.log(this.genderid);
    this.editForm.value.gender=this.genderid.id;
    this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
    this.myModel = Number(this.editForm.value.status) === 2 ? false : true;
    if (this.editForm.invalid) {
      return;
    } else {
      this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
      this.myModel = Number(this.editForm.value.status) === 2 ? false : true;
      this.startDateVar = this.datepipe.transform(this.searchStartDate, 'yyyy-MM-dd h:mm:ss');
      this.EndDateVar = this.datepipe.transform(this.searchEndDate, 'yyyy-MM-dd h:mm:ss');
      if(this.startDateVar==null){
        this.startDateVar='';
      }
      if(this.EndDateVar==null){
         this.EndDateVar='';
      }

      this.editForm.value.created_by = this.api.userid.user_id;
      this.editForm.value.effect_from=this.startDateVar;
      this.editForm.value.effect_to=this.EndDateVar;
      //console.log(this.editForm.value);
      this.api
        .postAPI(
          environment.API_URL + "configuration/package_rules/details",
          this.editForm.value
        )
        .subscribe((res)=>{
          //this.logger.log('FormValue',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.success(res.message);
            this.getpackage_setting();
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

  close() {
    this.initialize();
  }

  delete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data:language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "configuration/package_rules/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn("Package setting details " +language[environment.DEFAULT_LANG].deleteMsg);
            this.getpackage_setting();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  onCheckboxValueChange(data) {
    //console.log(data);
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
      this.getpackage_setting();
    }
  }


  getpackage() {
    this.api.getAPI(environment.API_URL + "master/package?status=1").subscribe({
      next: (res) => {
        // //this.logger.log('package',res);
        this.packageList = res.data;
      },
      error: (error) => {
        //this.logger.error('error',error);
      },
    });
  }

  getcountry() {
    this.api.getAPI(environment.API_URL + "master/countries?status=1").subscribe({
      next: (res) => {
        // //this.logger.log('package',res);
        this.countryList = res.data;
      },
      error: (error) => {
        //this.logger.error('error',error);
      },
    });
  }

  getVisaCategory() {
    this.api
      .getAPI(environment.API_URL + "master/visa_category?status=1")
      .subscribe((res) => {
        this.visa_categoryList = res.data;
        // //this.logger.log('visaCategory',this.data);
      });
  }

  getjobPosition(){
    this.api.getAPI(environment.API_URL + "master/job_position?status=1").subscribe({
      next: (res) => {
        // //this.logger.log('jobPosition',res);
        this.jobPositionList = res.data;
      },
      error: (error) => {
        //this.logger.error('error',error);
      },
    });
  }

  getLookupVal() {
    this.api
    .getAPI(environment.API_URL + "master/lookup?status=1")
    .subscribe((res)=> {
      this.lookupVal = res.data;
      //console.log("lookup",this.lookupVal);
    });
  }

  chooseGender(gen){
    this.IspreganantCheck=false;
    if(gen.code=='F'){
      this.IspreganantCheck=true;
      this.editForm.get('is_pregnancy').setValidators(Validators.required);
    }else{
      this.editForm.get('is_pregnancy').setValidators(null);
      this.editForm.get('is_pregnancy').setErrors(null);
    }
  }

  getpackageset() {
    this.api.getAPI(environment.API_URL + "configuration/package_rules").subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.pack_settingList = res.data;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        //this.logger.error('error',error);
      },
    });
  }

}
