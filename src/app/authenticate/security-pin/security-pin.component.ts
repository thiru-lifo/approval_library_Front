import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import { language } from "src/environments/language";
import { ApiService } from "src/app/service/api.service";
import { NotificationService } from "src/app/service/notification.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-security-pin',
  templateUrl: './security-pin.component.html',
  styleUrls: ['./security-pin.component.scss']
})
export class SecurityPinComponent implements OnInit {

  codeverifyForm = new FormGroup({
    email : new FormControl(''),
    verification_code : new FormControl('',Validators.required),
  });

   resData:any;

  constructor(private api : ApiService, private notification : NotificationService, private router : Router) { }

  ngOnInit(): void {
    let checkfp = localStorage.getItem('fp-detail')
    let logdata = localStorage.getItem('log-detail')
    if(checkfp) {
      this.router.navigateByUrl('authenticate/biometrics-verify');
    } else if(logdata){
      this.router.navigateByUrl('authenticate/biometrics-log');
    } else {
      this.router.navigateByUrl('authenticate/twofactor');
    }

    this.getresponse();
  }

   Error = (controlName: string, errorName: string) => {
    return this.codeverifyForm.controls[controlName].hasError(errorName);
  };

  getresponse() {
    let response= localStorage.getItem('token-detail');
    this.resData = this.api.decryptData(response);
    //console.log(this.resData.user_id)
    this.codeverifyForm.patchValue({id:'',email:this.resData.user_email,});
  }

  CodeVerify() {
    //console.log(this.codeverifyForm.value);
    if(this.codeverifyForm.value.verification_code=='')
      this.notification.displayMessage('Enter verification code');
    else
    {
        this.api.postAPI(environment.API_URL + "api/auth/verifyemailverificationcode",this.codeverifyForm.value).subscribe((res)=>{
          //console.log(res);
          if(res.status==environment.SUCCESS_CODE) {
            //console.log(res);
            this.notification.displayMessage(language[environment.DEFAULT_LANG].codeVerify);
            switch(this.resData.role_code)
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
          } else {
            this.notification.displayMessage(res.message);
        }

      });
    }
     //this.router.navigateByUrl('dashboard/admin');
  }

  resendCode() {
    this.api.postAPI(environment.API_URL+'api/auth/resend-code',{user_id:this.resData.user_id}).subscribe((res)=> {
      if(res){
        this.notification.displayMessage(language[environment.DEFAULT_LANG].codeSent);
      } else {
        this.notification.displayMessage(language[environment.DEFAULT_LANG].codeErr);
      }
    })
  }

}
