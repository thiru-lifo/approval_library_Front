import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { ApiService } from "src/app/service/api.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator,PageEvent } from "@angular/material/paginator";
import { NotificationService } from "src/app/service/notification.service";
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "src/environments/language";
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConsoleService } from "src/app/service/console.service";
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { of } from 'rxjs';
declare var moment: any;
declare function openModal(selector): any;
declare function closeModal(selector): any;
declare function formSubmit(selector): any;
declare function triggerClick(selector): any;

@Component({
  selector: 'app-trials',
  templateUrl: './trials.component.html',
  styleUrls: ['./trials.component.scss']
})
export class TrialsComponent implements OnInit {

  active = 1;

  displayedColumnsApproved: string[] = [
    "name",
    "requested_by",
    "requested_on",
    "view",

  ];
  displayedColumnsPending: string[] = [
    "name",
    "requested_by",
    "requested_on",
    "status",
    "rec",
    "view",
    "edit",
    "delete",

  ];
  dataSource: MatTableDataSource<any>;
  dataSourceApproved: MatTableDataSource<any>;
  dataSourcePending: MatTableDataSource<any>;

  country: any;
  public crudName = "Add";
  public countryList = [];
  public dataListApproved = [];
  public dataListPending = [];
  filterValue: any;
  isReadonly = false;
  moduleAccess: any;
  ErrorMsg: any;
  error_msg = false;
  moment = moment;
  pageEvent: PageEvent;
  totalLength=0;
  // unit_title = this.api.decryptData(localStorage.getItem('UNITTITLE'));

  public permission = {
    add: false,
    edit: false,
    view: false,
    delete: false,
    recommend: false,
    approve: false,
    print: false,
  };
  tokenDetail:any
  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild('paginationApproved') paginationApproved: MatPaginator;
  @ViewChild('paginationPending') paginationPending: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(public api: ApiService, private notification: NotificationService,
    private dialog: MatDialog, private router: Router, private elementref: ElementRef, private logger: ConsoleService) {
  console.log("this.api",this.api.userid);

  }

  public editForm = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [Validators.required]),
    status: new FormControl(1, [Validators.required]),
  });
  public approvalForm = new FormGroup({
    user_id: new FormControl(this.api.userid.user_id),
    trans_id: new FormControl("", [Validators.required]),
    notes: new FormControl("", [Validators.required]),
    status: new FormControl("", [Validators.required]),
    // trial_unit: new FormControl("", [Validators.required]),
    // satellite_unit: new FormControl("", [Validators.required]),
    // type: new FormControl("", [Validators.required]),
    role_id: new FormControl(this.api.userid.role_id, [Validators.required]),
  });
  public importform = new FormGroup({
    file_upload: new FormControl(""),
  });

  status = this.editForm.value.status;
  populate(data) {
    this.editForm.patchValue(data);
    // this.editForm.patchValue({ satellite_unit: data.satellite_unit ? data.satellite_unit.id : '' });
    // this.editForm.patchValue({ modified_by: this.api.userid.user_id });

  }

  initForm() {
    this.editForm.patchValue({
      status: "1",
    });
  }
  selectedTrial: any;
  // AppHistory: any;
  openCurrentStatus(trial) {
    this.selectedTrial = trial;
    this.api.postAPI(environment.API_URL + "transaction/approved_history", {
      trial_id: this.selectedTrial.id,
    }).subscribe((res) => {
      this.approvalHistory = res.data;
      // console.log("this.approvalHistory",this.approvalHistory);
      // openModal('#approval-history');
    })

    openModal('#trial-status-modal');
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };
  ErrorApproval = (controlName: string, errorName: string) => {
    return this.approvalForm.controls[controlName].hasError(errorName);
  };

  isEquipment = true;
  isBoiler = false;
  selectedOption: string;


  ngOnInit(): void {
    this.getTrials();
    this.getAccess();
    this.refreshPaginator();
  }
   refreshPaginator() {
    let pageIndex = 0;
    setTimeout((idx) => {
      this.pagination.pageIndex = 0;
      this.pagination._changePageSize(10);
    }, 0, pageIndex);
  }


  getTrials() {
    this.getTrialsPending();
  }
  showApproved() {
    this.getTrialsApproved();
  }
  showPending() {
    this.getTrialsPending();
  }
  getTrialsApproved() {
    let limit_start=0;
    let limit_end=10;
     if(this.pageEvent)
    {
      limit_end = (this.pageEvent.pageIndex+1) * this.pageEvent.pageSize;
      limit_start = (this.pageEvent.pageIndex ) * this.pageEvent.pageSize;
    }
    if (this.app_param == undefined) this.app_param = ""; else this.app_param;
      // let searchString = ('?approved_level=-3&legacy_data=No&trial_type__type=Trials'+'&limit_start='+limit_start+'&limit_end='+limit_end+'&'+this.app_param);
    this.api.displayPageloading(true);
    this.api
      .getAPI(environment.API_URL + "transaction/trials")
      .subscribe((res) => {
        this.api.displayPageloading(false);
        this.dataSourceApproved = new MatTableDataSource(res.data);
        this.dataListApproved = res.data;
        this.dataSourceApproved.paginator = this.paginationApproved;
         this.totalLength = res.total_length;
        // if (this.dataListApproved.length == 0) {
        //   this.notification.displayMessage("No Data Found");
        // }
      });
  }
  getTrialsPending() {
    let limit_start=0;
    let limit_end=10;
     if(this.pageEvent)
    {
      limit_end = (this.pageEvent.pageIndex+1) * this.pageEvent.pageSize;
      limit_start = (this.pageEvent.pageIndex ) * this.pageEvent.pageSize;
    }
    this.api.displayLoading(true)
    if (this.param == undefined) this.param = ""; else this.param;
    // let searchString = ('?approved_level=-2&legacy_data=No&trial_type__type=Trials'+'&limit_start='+limit_start+'&limit_end='+limit_end+'&'+ this.param);
    this.api
      .getAPI(environment.API_URL + "transaction/trials")
      .subscribe((res) => {
        this.api.displayPageloading(false);
        this.dataSourcePending = new MatTableDataSource(res.data);
        this.dataListPending = res.data;
        this.totalLength = res.total_length;
        console.log('dfs', this.dataListPending)
        this.dataSourcePending.paginator = this.paginationPending;
        // if (this.dataListPending.length == 0) {
        //   this.notification.displayMessage("No Data Found");
        // }
      });
  }
  param: any

  create() {
    this.crudName = "Initiate";
    this.isReadonly = false;
    this.editForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if (reset !== null) {
      this.initForm();
    }
    // var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    // element.checked = true;
  }

  editOption(country) {
    this.isReadonly = false;
    this.editForm.enable();
    this.crudName = "Edit";
    //this.logger.info(country);
    this.populate(country);
    // var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    // if(this.editForm.value.status == 1) {
    //  element.checked = true;
    // }
    // else {
    //  element.checked = false;
    // }
  }
  viewTrial: any;
  onView(country) {
    this.crudName = 'View';
    this.viewTrial = country;
    this.isReadonly = true;
    this.editForm.disable();
    this.populate(country);
    /*var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }*/
  }
  // showTrialForm(country = {}) {
  //   //console.log(country)
  //   this.viewTrial = country;
  //   this.viewTrial['type'] = 'view';
  //   //console.log(this.viewTrial['type'])
  //   localStorage.setItem('trial_form', this.api.encryptData(this.viewTrial));
  //   this.goToTrialForm1(this.viewTrial.trial_type);
  //   //console.log(this.viewTrial);
  // }
  // showTrialForm2(country = {}) {
  //   //console.log(country)
  //   this.viewTrial = country;
  //   this.viewTrial['type'] = 'edit';
  //   this.isReadonly = false;
  //   //console.log(this.viewTrial['type'])
  //   localStorage.setItem('trial_form', this.api.encryptData(this.viewTrial));
  //   this.goToTrialForm1(this.viewTrial.trial_type);
  //   //console.log(this.viewTrial);
  // }
  onViewTemp() {
    closeModal('#approval-modal');
    // this.goToTrialForm1(this.trialPage);
  }
  /*showTrialForm()
  {
    this.closebutton.nativeElement.click();
    this.viewTrial['type']='view';
    localStorage.setItem('trial_form',this.api.encryptData(this.viewTrial));
    this.goToTrialForm(this.viewTrial.trial_type.code);
    //console.log(this.viewTrial);
  }*/

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.postAPI(environment.API_URL + "transaction/trials/crud", {
          id: id,
          status: 3,
        }).subscribe((res) => {
          //this.logger.log('response', res);
          if (res.status == environment.SUCCESS_CODE) {
            //this.logger.info('delete')
            this.notification.warn('Trial ' + language[environment.DEFAULT_LANG].deleteMsg);
            this.getTrials();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef = null;
    });
  }

  onSubmit() {
    console.log("hlo", this.editForm.value);
    if (this.editForm.valid) {
      console.log("this.editForm.value", this.editForm.value);
      this.editForm.value.created_by = this.api.userid.user_id;
      this.editForm.value.status = this.editForm.value.status == true ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "transaction/trials/crud",
          this.editForm.value
        )
        .subscribe((res) => {
          //this.logger.log('response', res);
          //this.error= res.status;
          if (res.status == environment.SUCCESS_CODE) {
            // //this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getTrials();
            this.closebutton.nativeElement.click();
            // res.data['type'] = 'edit';
            localStorage.setItem('trial_form', this.api.encryptData(res.data));
            // this.goToTrialForm1(res.data.trial_type);
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = true;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = false;
            }, 2000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
  }
  importname: any;
  import() {
    this.importname = 'Import';
  }

  Submit() {
    const formData = new FormData();
    formData.append('file_upload', this.imgToUpload);
    if (this.importform.valid) {
      // this.importform.value.created_by = this.api.userid.user_id;
      // this.importform.value.status = this.importform.value.status == true ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "transaction/trials_import",
          formData
        )
        .subscribe((res) => {
          //this.logger.log('response', res);
          //this.error= res.status;
          if (res.status == environment.SUCCESS_CODE) {
            // //this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getTrials();
            this.closebutton.nativeElement.click();
            // res.data['type'] = 'edit';
            // localStorage.setItem('trial_form', this.api.encryptData(res.data));
            // this.goToTrialForm1(res.data.trial_type);
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = true;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = false;
            }, 2000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
  }
  // trialPage: any;
  // goToTrialForm1(trial_type) {
  //   this.router.navigateByUrl(trial_type.url);
  // }
  approvalType = 'Recommendation';
  approvalButton = 'Recommend';
  aTrial: any;
  openApprovalForm(trial,) {
    this.aTrial = trial;
    console.log("this.aTrial",trial);
    // this.approvalType = type == 1 ? 'Recommendation' : '';
    // this.approvalButton = type == 1 ? 'Recommend' : 'Approve';
    this.approvalForm.patchValue({ trans_id: trial.id,role_id: this.api.userid.role_id});
    openModal('#approval-modal');
    // this.trialPage = trial.trial_type;
  }
  approvalHistory: any;
  openApprovalHistory(history = '') {
    // this.approvalHistory = history;
    openModal('#approval-history');
  }
  onApproval() {
    this.approvalForm.patchValue({ status: 1 });
    triggerClick('#approvalSubmit');
  }
  onReject() {
    this.approvalForm.patchValue({ status: 2 });
    triggerClick('#approvalSubmit');
  }
  onApprovalSubmit() {
    console.log('onApprovalSubmit', this.approvalForm.value);
    if (this.approvalForm.valid) {
      //console.log(this.approvalForm.value);
      this.api.postAPI(environment.API_URL + "approver/get_approved_config", this.approvalForm.value).subscribe((res) => {
        closeModal('#approval-modal');
        this.approvalForm.patchValue({ notes: '' });
        if (res.status == environment.SUCCESS_CODE) {
          this.notification.success(res.message);
          this.getTrials();
        } else if (res.status == environment.ERROR_CODE) {
          this.notification.displayMessage(res.message);
        } else {
          this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
        }

      });
    }
  }



  getAccess() {
    this.moduleAccess = this.api.getPageAction();
    console.log("this.moduleAccess", this.moduleAccess);
    if (this.moduleAccess) {
      let addPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'INI') return access.status; }).map(function (obj) { return obj.status; });
      let editPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'EDIT') { return access.status; } }).map(function (obj) { return obj.status; });
      let viewPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'VIW') { return access.status; } }).map(function (obj) { return obj.status; });
      let deletePermission = (this.moduleAccess).filter(function (access) { if (access.code == 'DEL') { return access.status; } }).map(function (obj) { return obj.status; });
      let recommendPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'REC') { return access.status; } }).map(function (obj) { return obj.status; });
      let approvePermission = (this.moduleAccess).filter(function (access) { if (access.code == 'APR') { return access.status; } }).map(function (obj) { return obj.status; });
      let printPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'PRI') { return access.status; } }).map(function (obj) { return obj.status; });
      this.permission.add = addPermission.length > 0 ? addPermission[0] : false;
      this.permission.edit = editPermission.length > 0 ? editPermission[0] : false;
      this.permission.view = viewPermission.length > 0 ? viewPermission[0] : false;
      this.permission.delete = deletePermission.length > 0 ? deletePermission[0] : false;
      this.permission.recommend = recommendPermission.length > 0 ? recommendPermission[0] : false;
      this.permission.approve = approvePermission.length > 0 ? approvePermission[0] : false;
      this.permission.print = printPermission.length > 0 ? printPermission[0] : false;
    }

    //this.logger.log('this.permission', this.permission);
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if (this.filterValue) {
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getTrials();
    }
  }

  applyFilterPending(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if (this.filterValue) {
      this.dataSourcePending.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getTrials();
    }
  }
  applyFilterApproved(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if (this.filterValue) {
      this.dataSourceApproved.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getTrials();
    }
  }
  getTrialURL(type) {
    let trialURL = '';
    switch (type) {
      case 'HSC':
        trialURL = 'hs-converter';
        break;
      case 'HSRP':
        trialURL = 'hsr-proforma';
        break;
      case 'IPDA':
        trialURL = 'inhouse-proforma-da';
        break;
      case 'LTPDA':
        trialURL = 'loadtrial-proforma-da';
        break;
      case 'IPGTG':
        trialURL = 'inhouse-proforma-gtg';
        break;
      case 'LTPGTG':
        trialURL = 'loadtrial-proforma-gtg';
        break;
      case 'PRTT':
        trialURL = 'pre-refit';
        break;
      case 'POTT':
        trialURL = 'post-refit';
        break;
      case 'EHC':
        trialURL = 'eh-checks';
        break;
      // CBIU
      case 'BD':
        trialURL = 'boiler-data';
        break;
      case 'RTN':
        trialURL = 'returns';
        break;
      case 'FGA':
        trialURL = 'flue-gas-analyser';
        break;
      case 'BAR':
        trialURL = 'burner-alignment-readings';
        break;
      case 'BAP':
        trialURL = 'blowing-arc-port';
        break;
      case 'BASTBD':
        trialURL = 'blowing-arc-stbd';
        break;
      case 'ECO':
        trialURL = 'economiser-operating';
        break;
      case 'INFOH':
        trialURL = 'information-history';
        break;
      case 'INEX':
        trialURL = 'internal-examination';
        break;
    }
    return trialURL;
  }
  downloadTrialForm(trial) {
    window.open(environment.API_URL + (trial.trial_type.report_url) + trial.id, '_blank', 'location=no,height=' + window.screen.height + ',width=' + window.screen.width + ',scrollbars=yes,status=yes');
  }

  imgToUpload: File | null = null;
  onImageHandler(event) {
    //console.log(event,event.target.files[0])
    if (event.target.files.length > 0) {
      this.imgToUpload = event.target.files[0];
      //console.log("ghjgjhri",file);
      // this.form.patchValue({files:file});
    };

  }

  InitiatToRec(init_data) {
    let data = {
      id:init_data.id,
      trial_type__type: init_data.trial_type.type,
      trial_number: init_data.trial_number,
      first_name: init_data.created_by.first_name,
      last_name: init_data.created_by.last_name,
      satellite_unit_id: init_data.satellite_unit.id,
      trial_unit_id: init_data.trial_unit.id,
      approval_level:2
    }

    this.api
      .postAPI(
        environment.API_URL + "transaction/intiate-to-rec",
        data
      )
      .subscribe((res) => {
        let hlo = res.data;
        this.notification.success(res.message);
        this.getTrials();
      })
  }



  searchForm = new FormGroup({
    trail_unit: new FormControl(""),
    satellite_unit: new FormControl(""),
    ship: new FormControl(""),
    section: new FormControl(""),
    trail_type: new FormControl(""),
  })
  search() {
    let type = this.searchForm.value.trail_unit ? "trial_unit_id=" + this.searchForm.value.trail_unit : "";
    type += this.searchForm.value.satellite_unit ? "&satellite_unit_id=" + this.searchForm.value.satellite_unit : "";
    type += this.searchForm.value.section ? "&section_id=" + this.searchForm.value.section : "";
    type += this.searchForm.value.ship ? "&ship_id=" + this.searchForm.value.ship : "";
    type += this.searchForm.value.trail_type ? "&trial_type_id=" + this.searchForm.value.trail_type : "";
    this.param = type;
    this.getTrialsPending();

  }

  clear() {
    this.searchForm.reset();
    this.param = "";
    this.getTrialsPending();
  }

  app_param: any;
  AppsearchForm = new FormGroup({
    trail_unit: new FormControl(""),
    satellite_unit: new FormControl(""),
    ship: new FormControl(""),
    section: new FormControl(""),
    trail_type: new FormControl(""),
  })
  app_search() {
    let type = this.AppsearchForm.value.trail_unit ? "trial_unit_id=" + this.AppsearchForm.value.trail_unit : "";
    type += this.AppsearchForm.value.satellite_unit ? "&satellite_unit_id=" + this.AppsearchForm.value.satellite_unit : "";
    type += this.AppsearchForm.value.section ? "&section_id=" + this.AppsearchForm.value.section : "";
    type += this.AppsearchForm.value.ship ? "&ship_id=" + this.AppsearchForm.value.ship : "";
    type += this.AppsearchForm.value.trail_type ? "&trial_type_id=" + this.AppsearchForm.value.trail_type : "";
    this.app_param = type;
    this.getTrialsApproved();
  }

  Appclear() {
    this.AppsearchForm.reset();
    this.app_param = "";
    this.getTrialsApproved();
  }

  close() {
    this.editForm.reset();
  }

}


