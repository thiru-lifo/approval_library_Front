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

@Component({
  selector: 'app-login-gttt',
  templateUrl: './login-gttt.component.html',
  styleUrls: ['./login-gttt.component.scss']
})
export class LoginGtttComponent implements OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  constructor(public api: ApiService, private notification : NotificationService,private dialog:MatDialog,
    private router: Router, private logger : ConsoleService) { }
  public loginForm = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    remember: new FormControl("")
  });
  public loginButton='Sign in';
  public signinDisable=false;

  ngOnInit(): void {
    localStorage.removeItem('userDetail');
    localStorage.removeItem('fp-detail');
    localStorage.removeItem('log-detail');
    // localStorage.removeItem('tmsToken');
    // localStorage.removeItem('liveCounter');
    localStorage.removeItem('token-detail');
    localStorage.removeItem('applicant-details');
     localStorage.removeItem('UNITTITLE');
    let userInfo=localStorage.getItem('userInfo');
    if(userInfo) {
      let getUser=this.api.decryptData(userInfo);
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
     if (this.loginForm.valid) {
      this.loginButton='Please wait...';
      this.signinDisable=true;
      this.api.getToken(
          this.loginForm.value.username,
          this.api.encrypt(this.loginForm.value.password,environment.SECRET_KEY)
        )
        .subscribe((res) => {
          this.api.displayPageloading(false)
          this.loginButton='Sign in';
          this.signinDisable=false;
          if(res.status=='success')
          {
            userDetail.loginname=this.loginForm.value.username;
            userDetail.password=this.loginForm.value.password;
            localStorage.setItem('APPLOGO','assets/images/gttt-logo.jpg');
            localStorage.setItem('UNITTITLE','GTTT');
            localStorage.setItem('LOGINPAGE','/authenticate/login/gttt');
            this.api.setUserLoggedIn(true);
            if(this.loginForm.value.remember) {
              localStorage.setItem('userInfo',this.api.encryptData(this.loginForm.value));
            }
            localStorage.setItem('userDetail',this.api.encryptData(userDetail));
            localStorage.setItem('token-detail',this.api.encryptData(res));
            // this.router.navigateByUrl('/locations/countries');


            if(res.role_center.length==0)
            {
              this.notification.displayMessage("It seems no previlleges has been set for this account. Please contact administrator");
            }
            else{
                if(res.role_center.length>1) {
                    this.router.navigateByUrl('/authenticate/role-selection');

                } else {
                  //console.log(res.role_center[0].user_role.id)
                  this.api.getAPI(environment.API_URL+"access/permissions?user_role_id="+res.role_center[0].user_role.id+'&process_id='+res.process_id).subscribe((res1)=>{
                    if(res1.status==environment.SUCCESS_CODE) {
                      if(res1.data.length==1){
                        let data =this.api.decryptData(localStorage.getItem('token-detail'));
                        data.permissions = res1.data[0].permissions;
                        //For Removing Boiler from master
                        data.permissions=data.permissions.replace(',{"id":57,"name":"Boilers","action":[{"id":2,"name":"Edit","code":"EDIT","status":true},{"id":3,"name":"Delete","code":"DEL","status":true},{"id":4,"name":"View","code":"VIW","status":true},{"id":1,"name":"Add","code":"ADD","status":true}],"url":"masters/boilers","attributes":[],"status":true}','');


                        data.role_code=res.role_center[0].user_role.code;
                        data.role_id=res.role_center[0].user_role.id;
                        data.center=res.role_center[0].center?res.role_center[0].center.id:'';
                        data.center_name=res.role_center[0].center?res.role_center[0].center.name:'';
                        data.role_name = res.role_center[0].user_role.name;

                        this.api.postAPI(environment.API_URL+"api/auth/authentications",{user_id:res.user_id,user_role_id:res.role_center[0].user_role.id,center_id:(res.role_center[0].center?res.role_center[0].center.id:''),'Unit_name':'GTTT'}).subscribe((res2)=>{
                          if(res2.status==environment.ERROR_CODE) {
                            this.notification.displayMessage(res2.message);
                          }
                          data.token_user=res2.authentication.token_user;
                          localStorage.setItem('token-detail',this.api.encryptData(data));

                          if(res2.authentication.biometric) {
                            if(res2.authentication.fpdata.length<3) {
                            this.router.navigateByUrl('/authenticate/biometrics-log');
                            } else {
                              this.router.navigateByUrl('/authenticate/biometrics-verify');
                            }
                          } else if(res2.authentication.twofactor){
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
          else
          {
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
   if(user)
   {
    this.loginForm.patchValue({username:user.username});
    this.loginForm.patchValue({password:user.password});
    this.loginForm.patchValue({remember:user.remember});
   }

  }

  rememberMe(evt) {
    if(!evt.checked)
    {
      localStorage.removeItem('userInfo');
      /*this.loginForm.patchValue({username:''});
      this.loginForm.patchValue({password:''});*/
      this.loginForm.patchValue({remember:''});
    }
  }
  home(){
    this.router.navigateByUrl('authenticate/home')
  }
}
