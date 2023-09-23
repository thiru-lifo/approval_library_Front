import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/service/api.service';
import { NotificationService } from 'src/app/service/notification.service';
import { environment } from 'src/environments/environment';
import { language } from 'src/environments/language';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { ConsoleService } from 'src/app/service/console.service';
// import custom validator  class
import { CustomValidators } from 'src/app/providers/CustomValidators';
declare var moment: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  ErrorMsg: any;
  error_msg = false;

  @ViewChild('closebutton') closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(
    private dialog: MatDialog,
    public router: Router,
    public api: ApiService,
    private notification: NotificationService
  ) {}

  header: any;
  tmsToken: any;
  moment = moment;
  modules = [];
  ship_length:any;
  equipments_length:any;
  transaction_length:any;
  applicant_details = this.api.decryptData(
    localStorage.getItem('applicant-details')
  );
  interval;
  currentPath=location.hash;
  appLogo=localStorage.getItem('APPLOGO')?localStorage.getItem('APPLOGO'):'';
  unitTitle=localStorage.getItem('UNITTITLE')?localStorage.getItem('UNITTITLE'):'';

  jsonData=[]
  buildJsonData() {
    //var jsonData = {}; // JSON object to be built
    console.log(this.unitTitle)
    if (this.unitTitle === 'ETMA') {
      this.jsonData = [{
        satellite_unit: 'ETMA MUMBAI'
      },
      {
        satellite_unit: 'ETMA VIZAG',
      },
      {
        satellite_unit: 'ETTT Kochi',
      },
      {
        satellite_unit: 'ETTT KochiB',
      }];
    }
    else if (this.unitTitle === 'CBIU') {
      this.jsonData = [{
        satellite_unit: 'CBIU MUMBAI'
      }];
    }
    else if (this.unitTitle === 'GTTT') {
      this.jsonData = [{
        satellite_unit: 'GTTT MUMBAI'
      },
      {
        satellite_unit: 'GTTT V'
      }];
    }
    else if (this.unitTitle === 'MTU') {
      this.jsonData = [{
        satellite_unit: '	MTU MUMBAI'
      }];
    }
    else if (this.unitTitle === 'DTTT') {
      this.jsonData = [{
        satellite_unit: '	DTTT MUM'
      }];
    }
    // Add more conditions for other unitTitle values

    // console.log(this.jsonData)
    //this.jsonData
    return this.jsonData;
  }

  userDetail:any
  ngOnInit(): void {
    this.userDetail = this.api.decryptData(localStorage.getItem('userDetail'));
    this.get_equipments();
    this.get_transaction();
    selectedOption: String(this.trial_unit_id);
    //console.log('this.api.userid',this.api.userid);
    this.router.events.subscribe((val) => {
      this.currentPath = location.hash;
    });
    let data = this.api.decryptData(localStorage.getItem('token-detail'));
    this.tmsToken = localStorage.getItem('tmsToken');
    if (data.role_center.length == 1) {
      this.header = data.role_center[0].user_role.code;
    } else {
      this.header = data.role_code;
    }
    //console.log(this.header)

    if (data.permissions) {
      this.modules = JSON.parse(data.permissions);
    }
    this.getPage(this.modules);
    this.getNotifications();
    this.reloadNotifications();
    this.buildJsonData();
  }

  unit_title =this.api.decryptData(localStorage.getItem('UNITTITLE'));
  trial_unit_id:any;
  selectedOption: string;

  get_trial_unit_id(){
    if (this.unit_title=='ETMA')
    {
      this.trial_unit_id ='1';
      this.selectedOption = this.trial_unit_id;
    }
    if (this.unit_title=='CBIU')
    {
      this.trial_unit_id ='2';
      this.selectedOption = this.trial_unit_id;
    }
    if (this.unit_title=='DTTT')
    {
      this.trial_unit_id ='5';
      this.selectedOption = this.trial_unit_id;
    }
    if (this.unit_title=='MTU')
    {
      this.trial_unit_id ='4';
      this.selectedOption = this.trial_unit_id;
    }
    if (this.unit_title=='GTTT')
    {
      this.trial_unit_id ='3';
      this.selectedOption = this.trial_unit_id;
    }

  }



  satellite_unit_id:any;
  satellite_unit_inner:any;
  func_satellite_unit(satellite_unit = '')
  {
    this.satellite_unit_inner= satellite_unit;
    console.log("satellite_unit_inner : ",this.satellite_unit_inner);

    if(this.satellite_unit_inner=='ETMA MUMBAI')
    {
      this.satellite_unit_id='6';
    }

    if(this.satellite_unit_inner=='ETMA VIZAG')
    {
      this.satellite_unit_id='1';
    }

    if(this.satellite_unit_inner=='ETMA Kochi')
    {
      this.satellite_unit_id='7';
    }
    this.api.displayPageloading(true)
    this.api
   .getAPI(environment.API_URL + "master/ships?satellite_unit_id=" + this.satellite_unit_id + "&trial_unit_id=" + this.trial_unit_id + '&status=1')
   .subscribe((res) => {
     this.ship_length = res.data.length;
      this.api.displayPageloading(false)
   })

   this.api
   .getAPI(environment.API_URL + "master/equipments?satellite_unit_id=" + this.satellite_unit_id + "&trial_unit_id=" + this.trial_unit_id + '&status=1')
  .subscribe((res) => {
    this.equipments_length = res.data.length;
    this.api.displayPageloading(false)
  })

  this.api
     .getAPI(environment.API_URL + "transaction/trials?satellite_unit_id=" + this.satellite_unit_id + "&trial_unit_id=" + this.trial_unit_id + '&status=1')
     .subscribe((res) => {
       this.transaction_length = res.data.length;
       this.api.displayPageloading(false);
     })

  }



  get_equipments() {
    this.get_trial_unit_id();
    this.trial_unit_id = String(this.trial_unit_id);
    // this.api.displayPageloading(true)

  }

  get_transaction(){
    this.get_trial_unit_id();
    this.trial_unit_id = String(this.trial_unit_id);
    // this.api.displayPageloading(true);

   }

  reloadNotifications() {
    this.interval = setInterval(() => {
      this.getNotifications();
    }, 1000 * 60 * 3);
  }
  getPage(modules) {
    let currentUrl = modules.map((value) => value.url);
    //console.log(currentUrl);
  }

  updateApplicantDetails() {
    this.applicant_details = this.api.decryptData(
      localStorage.getItem('applicant-details')
    );
  }

  logout() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].logoutMessage,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let response = localStorage.getItem('token-detail');
        let decResponse = this.api.decryptData(response);
        this.api.applicationLogoutLog();
        clearInterval(this.interval);
      }
      dialogRef = null;
    });
  }
  toggleDisplayDiv2() {
    let response = this.api.decryptData(localStorage.getItem('token-detail'));
    //console.log(response)
    var body = document.body;
    body.classList.toggle(
      response.role_code == 'admin' ? 'master_flow' : 'body_flow'
    );
  }

  toggleMenu() {
    let response = this.api.decryptData(localStorage.getItem('token-detail'));
    var body = document.body;
    body.classList.toggle(
      response.role_code == 'admin' ? 'master_flow' : 'body_flow'
    );
  }

  changePasswordForm = new FormGroup(
    {
      old_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
        ),
      ]),
      new_password2: new FormControl('', [Validators.required]),
    },
    CustomValidators.mustMatch('new_password', 'new_password2') // insert here
  );
  public signinDisable = false;

  populate(data) {
    this.changePasswordForm.patchValue(data);
    console.log("hlo",data);
    this.error_msg = false;
  }

  initForm() {
    this.changePasswordForm.patchValue({});
  }

  Error = (controlName: string, errorName: string) => {
    return this.changePasswordForm.controls[controlName].hasError(errorName);
  };

  /*changePassword() {
    //this.crudName = "Add";
    //this.isReadonly=false;
    this.changePasswordForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    element.checked = true;
  } */
  notificationsList = [];
  getNotifications() {
    this.api
      .postAPI(environment.API_URL + 'notification/get-notifications', {})
      .subscribe((res) => {
        if (res.status == environment.SUCCESS_CODE) {
          //console.log('getNotifications',res);
          this.notificationsList = res.data;
        } else if (res.status == environment.ERROR_CODE) {
          this.notification.displayMessage(res.message);
        } else {
          this.notification.displayMessage(
            language[environment.DEFAULT_LANG].unableSubmit
          );
        }
      });
  }
  saveNotificationsLog(notification_id) {
    this.api
      .postAPI(environment.API_URL + 'notification/save-notification-log', {
        notification_id: notification_id,
      })
      .subscribe((res) => {
        if (res.status == environment.SUCCESS_CODE) {
          //console.log('saveNotificationsLog',res);
          this.getNotifications();
        } else if (res.status == environment.ERROR_CODE) {
          this.notification.displayMessage(res.message);
        } else {
          this.notification.displayMessage(
            language[environment.DEFAULT_LANG].unableSubmit
          );
        }
      });
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

  // goToTrialForm(type)
  // {
  //   switch(type)
  //   {
  //     case 'HSC':
  //       this.router.navigateByUrl('/transaction/etma/hs-converter');
  //     break;
  //     case 'HSRP':
  //       this.router.navigateByUrl('/transaction/etma/hsr-proforma');
  //     break;
  //     case 'IPDA':
  //       this.router.navigateByUrl('/transaction/etma/inhouse-proforma-da');
  //     break;
  //     case 'LTPDA':
  //       this.router.navigateByUrl('/transaction/etma/load-trial-proforma-da');
  //     break;
  //     case 'IPGTG':
  //       this.router.navigateByUrl('/transaction/etma/inhouse-proforma-gtg');
  //     break;
  //     case 'LTPGTG':
  //       this.router.navigateByUrl('/transaction/etma/load-trial-proforma-gtg');
  //     break;
  //     case 'PRTT':
  //       this.router.navigateByUrl('/transaction/etma/pre-refit-trial');
  //     break;
  //     case 'POTT':
  //       this.router.navigateByUrl('/transaction/etma/post-refit-trial');
  //     break;
  //     case 'EHC':
  //       this.router.navigateByUrl('/transaction/etma/eh-checks');
  //     break;
  //   }
  // }
  viewTrialRequest(trial, notification_id) {
    this.saveNotificationsLog(notification_id);
    let viewTrial = trial;
    viewTrial['type'] = 'view';
    localStorage.setItem('trial_form', this.api.encryptData(viewTrial));
    //this.goToTrialForm(viewTrial.trial_type.code);
    if (trial.trial_type.type == 'Trials')
      this.router.navigateByUrl('/transaction/trials');
    if (trial.trial_type.type == 'Returns')
      this.router.navigateByUrl('/transaction/returns');
    if (trial.trial_type.type == 'CBPM')
      this.router.navigateByUrl('/transaction/cbpm');
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.changePasswordForm.value.user_id = this.api.userid.user_id;
      this.api
        .postAPI(
          environment.API_URL + 'api/auth/change-password',
          this.changePasswordForm.value
        )
        .subscribe((res) => {
          ////this.logger.log('response',res);
          //this.error= res.status;
          if (res.status == environment.SUCCESS_CODE) {
            // //this.logger.log('Formvalue',this.changePasswordForm.value);
            this.notification.success(res.message);
            this.closebutton.nativeElement.click();
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = true;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = false;
            }, 2000);
          } else {
            this.notification.displayMessage(
              language[environment.DEFAULT_LANG].unableSubmit
            );
          }
        });
    }
  }
close(){
  this.formGroupDirective.resetForm();
}
}

