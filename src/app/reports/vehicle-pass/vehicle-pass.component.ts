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
import { ConsoleService } from "src/app/service/console.service";
import { of } from 'rxjs'
declare var moment: any;
declare function openModal(selector): any;
declare function closeModal(selector): any;
declare function formSubmit(selector): any;
declare function triggerClick(selector): any;

@Component({
  selector: 'app-vehicle-pass',
  templateUrl: './vehicle-pass.component.html',
  styleUrls: ['./vehicle-pass.component.scss']
})
export class VehiclePassComponent implements OnInit {

  
    displayedColumns: string[] = [
      "trial_number",
      "trial_unit",
      "satellite_unit",
      "ship",
      "section",
      // "equipment",
      "trial_type",
      "requested_by",
      "requested_on",
      "status",
      "view",
      "download",
  
    ];
    dataSource: MatTableDataSource<any>;
  
    country: any;
    public crudName = "Add";
    public countryList = [];
    filterValue: any;
    isReadonly = false;
    moduleAccess: any;
    ErrorMsg: any;
    error_msg = false;
    moment = moment;
    pageEvent: PageEvent;
    totalLength=0;
    public permission = {
      add: false,
      edit: false,
      view: false,
      delete: false,
      download: false
    };
  
    @ViewChild(MatPaginator) pagination: MatPaginator;
    @ViewChild("closebutton") closebutton;
    @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  
    constructor(public api: ApiService, private notification: NotificationService,
      private dialog: MatDialog, private router: Router, private elementref: ElementRef, private logger: ConsoleService) {
  
    }
  
    public editForm = new FormGroup({
      id: new FormControl(""),
      trial_unit: new FormControl("", [Validators.required]),
      satellite_unit: new FormControl("", [Validators.required]),
      ship: new FormControl("", [Validators.required]),
      section: new FormControl("", [Validators.required]),
      equipment: new FormControl("", [Validators.required]),
      trial_type: new FormControl("", [Validators.required]),
      status: new FormControl(1, [Validators.required]),
    });
    public approvalForm = new FormGroup({
      approved_level: new FormControl(""),
      trial_id: new FormControl("", [Validators.required]),
      comments: new FormControl("", [Validators.required]),
      status: new FormControl("", [Validators.required]),
      trial_unit: new FormControl("", [Validators.required]),
      satellite_unit: new FormControl("", [Validators.required]),
      approved_role_id: new FormControl(this.api.userid.role_id, [Validators.required]),
    });
    status = this.editForm.value.status;
    populate(data) {
      this.editForm.patchValue(data);
      this.editForm.patchValue({ trial_unit: data.trial_unit.id });
      this.getSatelliteUnits(data.trial_unit.id);
      this.getShips(data.trial_unit.id, data.satellite_unit.id);
      this.getSections(data.trial_unit.id, data.satellite_unit.id, data.ship.id);
      this.getEquipments(data.trial_unit.id, data.satellite_unit.id, data.ship.id, data.section.id);
      this.getTrialTypes(data.trial_unit.id);
      setTimeout(() => {
        this.editForm.patchValue({ satellite_unit: data.satellite_unit.id });
        this.editForm.patchValue({ ship: data.ship.id });
        this.editForm.patchValue({ section: data.section.id });
        this.editForm.patchValue({ equipment: data.equipment.id });
        this.editForm.patchValue({ trial_type: data.trial_type.id });
      }, 500);
      this.editForm.patchValue({ modified_by: this.api.userid.user_id });
      //this.logger.info(data.status)
    }
  
    initForm() {
      this.editForm.patchValue({
        status: "1",
      });
    }
  
    displaySatelliteUnit(units) {
      let satelliteUnits = '';
      for (let i = 0; i < units.length; i++)
        satelliteUnits += units[i].satellite_unit.name + ' & ';
  
      return satelliteUnits.substring(0, (satelliteUnits.length) - 3);
    }
  
    Error = (controlName: string, errorName: string) => {
      return this.editForm.controls[controlName].hasError(errorName);
    };
    ErrorApproval = (controlName: string, errorName: string) => {
      return this.approvalForm.controls[controlName].hasError(errorName);
    };
  
    ngOnInit(): void {
      this.getTrials();
      this.getTrialUnits();
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
    trialUnits: any;
    selectedTrial: any;
    openCurrentStatus(trial) {
      this.selectedTrial = trial;
      openModal('#trial-status-modal');
    }
  
    getTrialUnits() {
      this.api
        .getAPI(environment.API_URL + "master/trial_units?status=1")
        .subscribe((res) => {
          this.trialUnits = res.data;
        });
    }
    satelliteUnits: any;
    getSatelliteUnits(trial_unit_id = '') {
      this.getTrialTypes(trial_unit_id);
      this.api
        .getAPI(environment.API_URL + "master/satellite_units?trial_unit_id=" + trial_unit_id + '&status=1')
        .subscribe((res) => {
          this.satelliteUnits = res.data;
        });
    }
    ships: any;
    getShips(trial_unit_id = '', satellite_unit_id = '') {
      this.api
        .getAPI(environment.API_URL + "master/ships?satellite_unit_id=" + satellite_unit_id + "&trial_unit_id=" + trial_unit_id + '&status=1')
        .subscribe((res) => {
          this.ships = res.data;
        });
    }
  sections=[];
    getSections(trial_unit_id = '', satellite_unit_id = '', ship_id = '') {
      this.api
        .getAPI(environment.API_URL + "master/sections?trial_unit_id=" + trial_unit_id +"&satellite_unit_id=" + satellite_unit_id + "&ship_id=" + ship_id +'&status=1')
        .subscribe((res) => {
          // this.sections = res.data;
          this.sections = [];
          for (let i = 0; i < res.data.length; i++){
            for (let j = 0; j < res.mapped.length; j++){
              if (res.data[i].code == res.mapped[j].section_code)
                this.sections.push(res.data[i])
            }
          }
        });
    }
    equipments: any;
    getEquipments(trial_unit_id = '', satellite_unit_id = '', ship_id = '', section_id = '') {
      this.api
        .getAPI(environment.API_URL + "master/equipments?trial_unit_id=" + trial_unit_id + "&satellite_unit_id=" + satellite_unit_id + "&ship_id=" + ship_id + "&section_id=" + section_id + '&status=1')
        .subscribe((res) => {
          this.equipments = res.data;
        });
    }
    trial_types: any;
    getTrialTypes(trial_unit_id = '') {
      this.api
        .getAPI(environment.API_URL + "master/trial_types?trial_unit_id=" + trial_unit_id + '&status=1')
        .subscribe((res) => {
          this.trial_types = res.data;
        });
    }
    getTrials() {
      let limit_start=0;
      let limit_end=10;
       if(this.pageEvent)
      {
        limit_end = (this.pageEvent.pageIndex+1) * this.pageEvent.pageSize;
        limit_start = (this.pageEvent.pageIndex ) * this.pageEvent.pageSize;
      }
      this.api.displayLoading(true)
      if (this.param == undefined) this.param = ""; else this.param;
      let searchString = ('?approved_level=-1&legacy_data=No&trial_type__type=Trials'+'&limit_start='+limit_start+'&limit_end='+limit_end+'&'+ this.param);
      this.api
       .getAPI(environment.API_URL + "transaction/trials" + searchString)
        .subscribe((res) => {
          this.api.displayPageloading(false);
          this.dataSource = new MatTableDataSource(res.data);
          this.countryList = res.data;
          this.dataSource.paginator = this.pagination;
          this.totalLength = res.total_length;
          //this.logger.log('country', this.countryList)
          if (this.countryList.length==0) {
              this.notification.displayMessage("No Data Found");
          }
        });
    }
  
  
    create() {
      this.crudName = "Create";
      this.isReadonly = false;
      this.editForm.enable();
      let reset = this.formGroupDirective.resetForm();
      if (reset !== null) {
        this.initForm();
      }
      var element = <HTMLInputElement>document.getElementById("exampleCheck1");
      element.checked = true;
    }
  
    editOption(country) {
      this.isReadonly = false;
      this.editForm.enable();
      this.crudName = "Edit";
      //this.logger.info(country);
      this.populate(country);
      var element = <HTMLInputElement>document.getElementById("exampleCheck1");
      if (this.editForm.value.status == 1) {
        element.checked = true;
      }
      else {
        element.checked = false;
      }
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
    showTrialForm(country = {}) {
      this.viewTrial = country;
      this.viewTrial['type'] = 'view';
      localStorage.setItem('trial_form', this.api.encryptData(this.viewTrial));
      this.goToTrialForm1(this.viewTrial.trial_type);
  
    }
    goToTrialForm1(trial_type) {
      this.router.navigateByUrl(trial_type.url);
  
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
      if (this.editForm.valid) {
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
              res.data['type'] = 'edit';
              localStorage.setItem('trial_form', this.api.encryptData(res.data));
              this.goToTrialForm1(res.data.trial_type);
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
    openApprovalForm(trial) {
      this.approvalForm.patchValue({ trial_id: trial.id, approved_level: (trial.approval.level ? trial.approval.level : ''), trial_unit: trial.trial_unit.id, satellite_unit: trial.satellite_unit.id, approved_role_id: this.api.userid.role_id });
      openModal('#approval-modal');
    }
    approvalHistory: any;
    openApprovalHistory(history = '') {
      this.approvalHistory = history;
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
      //console.log('onApprovalSubmit', this.approvalForm);
      if (this.approvalForm.valid) {
        //console.log(this.approvalForm.value);
        this.api.postAPI(environment.API_URL + "transaction/trials/approval", this.approvalForm.value).subscribe((res) => {
          closeModal('#approval-modal');
          this.approvalForm.patchValue({ comments: '' });
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
  
    goToTrialForm(type) {
      switch (type) {
        case 'HSC':
          this.router.navigateByUrl('/transaction/etma/hs-converter');
          break;
        case 'HSRP':
          this.router.navigateByUrl('/transaction/etma/hsr-proforma');
          break;
        case 'IPDA':
          this.router.navigateByUrl('/transaction/etma/inhouse-proforma-da');
          break;
        case 'LTPDA':
          this.router.navigateByUrl('/transaction/etma/load-trial-proforma-da');
          break;
        case 'IPGTG':
          this.router.navigateByUrl('/transaction/etma/inhouse-proforma-gtg');
          break;
        case 'LTPGTG':
          this.router.navigateByUrl('/transaction/etma/load-trial-proforma-gtg');
          break;
        case 'PRTT':
          this.router.navigateByUrl('/transaction/etma/pre-refit-trial');
          break;
        case 'POTT':
          this.router.navigateByUrl('/transaction/etma/post-refit-trial');
          break;
        case 'EHC':
          this.router.navigateByUrl('/transaction/etma/eh-checks');
          break;
        // CBIU
        case 'BD':
          this.router.navigateByUrl('transaction/cbiu/boiler-data');
          break;
        case 'RTN':
          this.router.navigateByUrl('transaction/cbiu/returns');
          break;
        case 'FGA':
          this.router.navigateByUrl('transaction/cbiu/flue-gas-analyser');
          break;
        case 'BAR':
          this.router.navigateByUrl('transaction/cbiu/burner-alignment-readings');
          break;
        case 'BAP':
          this.router.navigateByUrl('transaction/cbiu/blowing-arc-port');
          break;
        case 'BASTBD':
          this.router.navigateByUrl('transaction/cbiu/blowing-arc-stbd');
          break;
        case 'ECO':
          this.router.navigateByUrl('transaction/cbiu/economiser-operating');
          break;
        case 'INFOH':
          this.router.navigateByUrl('transaction/cbiu/information-history');
          break;
        case 'INEX':
          this.router.navigateByUrl('transaction/cbiu/internal-examination');
          break;
      }
    }
  
  
    getAccess() {
      this.moduleAccess = this.api.getPageAction();
      if (this.moduleAccess) {
        let addPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'ADD') return access.status; }).map(function (obj) { return obj.status; });
        let editPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'EDIT') { return access.status; } }).map(function (obj) { return obj.status; });;
        let viewPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'VIW') { return access.status; } }).map(function (obj) { return obj.status; });;
        let deletePermission = (this.moduleAccess).filter(function (access) { if (access.code == 'DEL') { return access.status; } }).map(function (obj) { return obj.status; });;
        let downloadPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'DOW') { return access.status; } }).map(function (obj) { return obj.status; });;
        this.permission.add = addPermission.length > 0 ? addPermission[0] : false;
        this.permission.edit = editPermission.length > 0 ? editPermission[0] : false;;
        this.permission.view = viewPermission.length > 0 ? viewPermission[0] : false;;
        this.permission.delete = deletePermission.length > 0 ? deletePermission[0] : false;
        this.permission.download = downloadPermission.length > 0 ? downloadPermission[0] : false;
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
  
     param: any;
       searchForm= new FormGroup({
        trail_unit:new FormControl(""),
        satellite_unit:new FormControl(""),
        ship:new FormControl(""),
        section:new FormControl(""),
        trail_type:new FormControl(""),
      })
    search(){
      let type=this.searchForm.value.trail_unit?"trial_unit_id="+this.searchForm.value.trail_unit:"";
      type+=this.searchForm.value.satellite_unit?"&satellite_unit_id="+this.searchForm.value.satellite_unit:"";
      type+=this.searchForm.value.section?"&section_id="+this.searchForm.value.section:"";
      type+=this.searchForm.value.ship?"&ship_id="+this.searchForm.value.ship:"";
      type+=this.searchForm.value.trail_type?"&trial_type_id="+this.searchForm.value.trail_type:"";
      this.param=type;
      this.getTrials();
  
          }
  
    clear(){
            this.searchForm.reset();
            this.param="";
            this.getTrials();
          }
  
  
    close(){
            this.editForm.reset();
          }
  
  
  }
  
