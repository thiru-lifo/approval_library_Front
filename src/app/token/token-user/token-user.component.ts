import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/service/api.service';
import { ConsoleService } from 'src/app/service/console.service';
import { NotificationService } from 'src/app/service/notification.service';
import { environment } from 'src/environments/environment';
import { language } from 'src/environments/language';

@Component({
  selector: 'app-token-user',
  templateUrl: './token-user.component.html',
  styleUrls: ['./token-user.component.scss']
})
export class TokenUserComponent implements OnInit {
  UserRoleList=[];
  centerList=[];
  user_name_list=[];

  editForm: FormGroup;
  error = "";
  id: number;
  myModel = false;
  public crudName = "Add";
  public tokenUser = [];
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
    private formBuilder: FormBuilder,
    private dialog:MatDialog, private logger : ConsoleService,
  ) {

  }

  dataSource: MatTableDataSource<any>;
  displayedColumns = ["user_name", "user_role","user","center","status","view","edit","delete"];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  ngOnInit(): void {
    this.initForm();
    this.getAccess();
    this.getuser_Role();
    this.getcenter();
    this.token_user();
    // this.gettoken_userName();

  }

  initForm() {
    this.editForm = this.formBuilder.group({
      id: new FormControl(""),
      user:new FormControl("", [Validators.required]),
      user_role: new FormControl("", [Validators.required]),
      user_name: new FormControl("",[Validators.required]),
      center: new FormControl("",[Validators.required]),
      created_by: new FormControl(""),
      created_ip: new FormControl(""),
      status : new FormControl("", [Validators.required]),
      // modified_by:new FormControl("")
    });
  }
  effectFrom:any;
  populateForms(users) {
    this.editForm.patchValue({modified_by:this.api.userid.user_id});
    this.editForm.patchValue({id:users.id});
    this.editForm.patchValue({user_name:users.user_name});
    this.editForm.patchValue({user_role:users.user_role.id});
    this.editForm.patchValue({center:users.center.id});
    this.editForm.patchValue({status:users.status});
    this.getUserName(users.user.id);
    this.editForm.patchValue({user:users.user.id});
    // if(users.user){
    // let username_value =this.user_name_list.filter(type=>{ return type.user__id==users.user.id})
    // this.editForm.patchValue({user:username_value[0].user__id});
    //console.log(username_value);
    // }
    //console.log(users);
  }

  initialize() {
    this.editForm.patchValue({
      id: "",
      user: "",
      user_role: "",
      user_name: "",
      center: "",
      created_by: "",
      created_ip: "",
      status:"1"
      // sequence:''
    });
  }
  token_user() {
      this.api.getAPI(environment.API_URL + "tms/token_user").subscribe({
      next: (res) => {
        // //this.logger.log('catalog',res);
        this.dataSource = new MatTableDataSource(res.data);
        this.tokenUser = res.data;
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
    this.editForm.enable();
    let reset=this.formGroupDirective.resetForm();
    // this.initialize();
    if(reset!==null){
     this.initialize();
    }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    element.checked = true;
  }
  update(value) {
    this.crudName="Edit";
    this.viewButton=false;
    this.editForm.enable();
    // //this.logger.info(package_setting);
    this.crudName = "Edit";
    this.populateForms(value);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
  }

  viewButton=false;
  onView(value) {
    this.crudName = 'View';
    this.editForm.disable();
    this.viewButton=true;
    this.populateForms(value);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
  }

  crudSubmit() {
    if (this.editForm.invalid) {
      return;
    } else {
      this.editForm.value.created_by = this.api.userid.user_id;
      this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
      //console.log(this.editForm.value);
      this.api
        .postAPI(
          environment.API_URL + "tms/token_user/details",
          this.editForm.value
        )
        .subscribe((res)=>{
          //this.logger.log('FormValue',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.success(res.message);
            this.token_user();
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
    // this.initialize();
  }

  delete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data:language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "tms/token_user/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn("Token user details " +language[environment.DEFAULT_LANG].deleteMsg);
            this.token_user();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
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
      this.token_user();
    }
  }


  getuser_Role() {
    this.api.getAPI(environment.API_URL + "access/access_user_roles?status=1").subscribe({
      next: (res) => {
        // //this.logger.log('package',res);
        this.UserRoleList = res.data;
      },
      error: (error) => {
        //this.logger.error('error',error);
      },
    });
  }

  choose_user_name(role_id){
    this.getUserName(role_id);
    // this.api.getAPI(environment.API_URL + "tokenuser/get_user?status=1&user_role="+role_id).subscribe({
    //   next: (res) => {
    //     // //this.logger.log('package',res);
    //     this.user_name_list = res.data;
    //     //console.log(this.user_name_list[0].user.first_name)
    //   },
    //   error: (error) => {
    //     //this.logger.error('error',error);
    //   },
    // });
  }

  getUserName(role_id){
    this.api.getAPI(environment.API_URL + "tms/get_user?status=1&user_role="+role_id).subscribe({
      next: (res) => {
        // //this.logger.log('package',res);
        this.user_name_list = res.data;
      },
      error: (error) => {
        //this.logger.error('error',error);
      },
    });
  }

  getcenter() {
    this.api
      .getAPI(environment.API_URL + "master/center?status=1")
      .subscribe((res) => {
        this.centerList = res.data;
        // //this.logger.log('visaCategory',this.data);
      });
  }


}
