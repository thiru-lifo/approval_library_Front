import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { ApiService } from "src/app/service/api.service";
import { ConsoleService } from "src/app/service/console.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { NotificationService } from "src/app/service/notification.service";
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "src/environments/language";
import { userDetail } from 'src/environments/userDetail';

import * as Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsData from 'highcharts/modules/data';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);

@Component({
  selector: 'app-login-etma',
  templateUrl: './login-etma.component.html',
  styleUrls: ['./login-etma.component.scss']
})
export class LoginEtmaComponent implements OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  constructor(public api: ApiService, private notification: NotificationService, private dialog: MatDialog,
    private router: Router, private logger: ConsoleService) { }
  public loginForm = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    remember: new FormControl("")
  });
  public loginButton = 'Sign in';
  public signinDisable = false;
  transactionsIndex: any



  ngOnInit(): void {
    Highcharts.chart('piechartcontainer', this.piechartoptions);
    localStorage.removeItem('userDetail');
    localStorage.removeItem('fp-detail');
    localStorage.removeItem('log-detail');
    // localStorage.removeItem('tmsToken');
    // localStorage.removeItem('liveCounter');
    localStorage.removeItem('token-detail');
    localStorage.removeItem('applicant-details');
    let userInfo = localStorage.getItem('userInfo');
    localStorage.removeItem('UNITTITLE');

    if (userInfo) {
      let getUser = this.api.decryptData(userInfo);
      //this.logger.info(getUser);
      this.populate(getUser);

    }
    // var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    //    element.checked=true;
  }

  Error = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  };






  onSubmit() {
    this.api.displayPageloading(true)
    // console.log(this.loginForm)
    if (this.loginForm.valid) {
      this.loginButton = 'Please wait...';
      this.signinDisable = true;
      this.api.getToken(
        this.loginForm.value.username,
        this.api.encrypt(this.loginForm.value.password, environment.SECRET_KEY)
      )

        .subscribe((res) => {
          this.api.displayPageloading(false)
          this.loginButton = 'Sign in';
          this.signinDisable = false;
          if (res.status == 'success') {
            localStorage.setItem('APPLOGO', 'assets/images/logo.png');
            localStorage.setItem('UNITTITLE', 'ETMA');
            localStorage.setItem('LOGINPAGE', '/authenticate/login/etma');
            localStorage.setItem('Unit_name', 'ETMA');
            userDetail.loginname = this.loginForm.value.username;
            userDetail.password = this.loginForm.value.password;
            this.api.setUserLoggedIn(true);
            if (this.loginForm.value.remember) {
              localStorage.setItem('userInfo', this.api.encryptData(this.loginForm.value));
            }
            localStorage.setItem('userDetail', this.api.encryptData(userDetail));
            localStorage.setItem('token-detail', this.api.encryptData(res));
            // this.router.navigateByUrl('/locations/countries');
            if (res.role_center.length == 0) {
              this.notification.displayMessage("It seems no previlleges has been set for this account. Please contact administrator");
            }
            else {
              if (res.role_center.length > 1) {
                this.router.navigateByUrl('/authenticate/role-selection');

              } else {
                //console.log(res.role_center[0].user_role.id)



                this.api.getAPI(environment.API_URL + "access/permissions?user_role_id=" + res.role_center[0].user_role.id + '&process_id=' + res.process_id).subscribe((res1) => {
                  if (res1.status == environment.SUCCESS_CODE) {
                    if (res1.data.length == 1) {
                      let data = this.api.decryptData(localStorage.getItem('token-detail'));
                      data.permissions1 = res1.data[0].permissions;
                      // console.log(data.permissions1)
                      // remove (E-Returns,CBPM)from the Transactions
                      const permissionsArray = JSON.parse(data.permissions1);
                      permissionsArray.map((item) => {
                        if (item.name === "Transactions" && Array.isArray(item.components)) {
                          item.components = item.components.filter(component => component.name !== "E-Returns");
                          item.components = item.components.filter(component => component.name !== "CBPM");
                        }
                        // removing the Boilers from the Masters
                        if (item.name === "Masters" && Array.isArray(item.components)) {
                          item.components = item.components.filter(component => component.name !== "Boilers");
                        }
                        return item;



                      });

                      //console.log("Modified Permissions Array", permissionsArray);
                      //console.log("dddddddd",permissionsArray.['Transactions'].components[1].id);
                      const modifiedPermissions = JSON.stringify(permissionsArray);
                      //console.log("Modified Permissions Array (Stringified)", modifiedPermissions);
                      data.permissions = modifiedPermissions;






                      //for removing E-return from ETMA
                      //  data.permissions=data.permissions.replace(',{"id":62,"name":"E-Returns","action":[{"id":2,"name":"Edit","code":"EDIT","status":true},{"id":3,"name":"Delete","code":"DEL","status":true},{"id":4,"name":"View","code":"VIW","status":true},{"id":7,"name":"Recommend","code":"REC","status":true},{"id":8,"name":"Approve","code":"APR","status":true},{"id":6,"name":"Initiate","code":"INI","status":true},{"id":9,"name":"Print","code":"PRI","status":false}],"url":"transaction/returns","attributes":[],"status":true}',"").replace(',{"id":64,"name":"E-Returns","action":[{"id":4,"name":"View","code":"VIW","status":true},{"id":5,"name":"Download","code":"DOW","status":true}],"url":"reports/returns","attributes":[],"status":true}','').replace(',{"id":80,"name":"E-Returns","action":[{"id":2,"name":"Edit","code":"EDIT","status":true},{"id":3,"name":"Delete","code":"DEL","status":true},{"id":4,"name":"View","code":"VIW","status":true},{"id":8,"name":"Approve","code":"APR","status":true},{"id":6,"name":"Initiate","code":"INI","status":true},{"id":9,"name":"Print","code":"PRI","status":true}],"url":"legacy-data/returns","attributes":[],"status":true}','').replace(',{"id":67,"name":"E-Returns","action":[{"id":2,"name":"Edit","code":"EDIT","status":true},{"id":3,"name":"Delete","code":"DEL","status":true},{"id":4,"name":"View","code":"VIW","status":true},{"id":7,"name":"Recommend","code":"REC","status":true},{"id":8,"name":"Approve","code":"APR","status":true},{"id":6,"name":"Initiate","code":"INI","status":true},{"id":9,"name":"Print","code":"PRI","status":false}],"url":"transaction/returns","attributes":[],"status":true}','').replace(',{"id":71,"name":"E-Returns","action":[{"id":4,"name":"View","code":"VIW","status":true},{"id":5,"name":"Download","code":"DOW","status":true}],"url":"reports/returns","attributes":[],"status":true}','').replace(',{"id":83,"name":"E-Returns","action":[{"id":2,"name":"Edit","code":"EDIT","status":false},{"id":3,"name":"Delete","code":"DEL","status":false},{"id":4,"name":"View","code":"VIW","status":false},{"id":8,"name":"Approve","code":"APR","status":false},{"id":6,"name":"Initiate","code":"INI","status":false},{"id":9,"name":"Print","code":"PRI","status":false}],"url":"legacy-data/returns","attributes":[],"status":false}',''); //this is for E returns removel

                      // For Removing Boiler from master
                      //data.permissions=data.permissions.replace(',{"id":57,"name":"Boilers","action":[{"id":2,"name":"Edit","code":"EDIT","status":true},{"id":3,"name":"Delete","code":"DEL","status":true},{"id":4,"name":"View","code":"VIW","status":true},{"id":1,"name":"Add","code":"ADD","status":true}],"url":"masters/boilers","attributes":[],"status":true}','');


                      data.role_code = res.role_center[0].user_role.code;
                      data.role_id = res.role_center[0].user_role.id;
                      data.center = res.role_center[0].center ? res.role_center[0].center.id : '';
                      data.center_name = res.role_center[0].center ? res.role_center[0].center.name : '';
                      data.role_name = res.role_center[0].user_role.name;

                      this.api.postAPI(environment.API_URL + "api/auth/authentications", { user_id: res.user_id, user_role_id: res.role_center[0].user_role.id, center_id: (res.role_center[0].center ? res.role_center[0].center.id : ''), 'Unit_name': 'ETMA' }).subscribe((res2) => {
                        if (res2.status == environment.ERROR_CODE) {
                          this.notification.displayMessage(res2.message);
                        }
                        data.token_user = res2.authentication.token_user;
                        localStorage.setItem('token-detail', this.api.encryptData(data));

                        if (res2.authentication.biometric) {
                          if (res2.authentication.fpdata.length < 3) {
                            this.router.navigateByUrl('/authenticate/biometrics-log');
                          } else {
                            this.router.navigateByUrl('/authenticate/biometrics-verify');
                          }
                        } else if (res2.authentication.twofactor) {
                          this.router.navigateByUrl('/authenticate/twofactor');
                        } else {
                          this.router.navigateByUrl('dashboard/admin');
                        }
                      });
                    }
                  }
                });
              }
            }



            /*if(res.biometric) {
              if(res.fpdata.length<3 ) {
               this.router.navigateByUrl('/authenticate/biometrics-log');
               } else {
                this.router.navigateByUrl('/authenticate/biometrics-verify');
               }
            }
            else if(res.twofactor) {
              this.router.navigateByUrl('/authenticate/twofactor');
            }
            else  {
              if(res.role.length>1){
                this.router.navigateByUrl('/authenticate/role-selection');
              } else {
                switch(res.role[0].code)
                {

                  case 'admin':
                    this.router.navigateByUrl('dashboard/admin');
                  break;
                  case 'gro':
                    this.router.navigateByUrl('/gro/dashboard');
                  break;
                  case 'nurse':
                    this.router.navigateByUrl('/nurse/dashboard-nurse');
                  break;
                  default:
                    this.router.navigateByUrl('');
                  break;
                }
              }

            }*/
          }
          else {
            this.notification.displayMessage(res.message);
          }
        });
    }
  }

  Forgot() {
    this.notification.displayMessage(language[environment.DEFAULT_LANG].contactAdmin);
  }

  showDiv: boolean = false;
  buttonClicked: boolean = false;
  toggleDiv() {
    this.showDiv = !this.showDiv;
    this.buttonClicked = true;
  }

  populate(user) {
    //this.logger.info(user)
    if (user) {
      this.loginForm.patchValue({ username: user.username });
      this.loginForm.patchValue({ password: user.password });
      this.loginForm.patchValue({ remember: user.remember });
    }

  }


  public piechartoptions: any = {

    colors: ['#00bf00', '#f7a400', '#2e305f', '#06bf8d', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],

    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      backgroundColor: '#03e7fc'
    },
    title: {
      text: ''
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    accessibility: {
      point: {
        valueSuffix: ''
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}'
        }
      }
    },

    series: [{
      //name: 'Brands',
      colorByPoint: true,
      data: [
        {
          name: 'Pending',
          y: 150,
          sliced: true
        },
        {
          name: 'Approved',
          y: 40,
          sliced: true
        }
      ]
    }]
  }


  rememberMe(evt) {
    if (!evt.checked) {
      localStorage.removeItem('userInfo');
      /*this.loginForm.patchValue({username:''});
      this.loginForm.patchValue({password:''});*/
      this.loginForm.patchValue({ remember: '' });
    }
  }

  home() {
    this.router.navigateByUrl('authenticate/home')
  }

}
