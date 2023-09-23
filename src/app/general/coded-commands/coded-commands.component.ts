import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective } from '@angular/forms';
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
  selector: 'app-coded-commands',
  templateUrl: './coded-commands.component.html',
  styleUrls: ['./coded-commands.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CodedCommandsComponent implements OnInit {

  form:FormGroup;
  error="";
  crudName="Add";
  coded_commandsList:[];
  codedCatalogList=[];

  moduleAccess:any;
  filterValue:any;
  isReadonly=false;
  ErrorMsg:any;
  error_msg=false;
  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
  };

   constructor(
     private api:ApiService,
     private notification:NotificationService,
     private formBuilder:FormBuilder,
     private dialog:MatDialog,
     private logger : ConsoleService) { }

   dataSource: MatTableDataSource<any>;
   displayedColumns = ["name", "code","code_command_catalog","description","status","view", "edit", "delete"];
   @ViewChild(MatPaginator) paginator: MatPaginator;
   @ViewChild("closebutton") closebutton;
   @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;


   ngOnInit(): void {
    this.initForm();
    this.getcoded_commands();
    this.getcatalogType();
    this.getAccess();
   }

   initForm(){
     this.form = this.formBuilder.group({
       id: new FormControl(""),
       name: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z ]+")]), //Validators.pattern('^[a-zA-Z \-\']+')
       code: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z0-9 ]+")]), //Validators.pattern("^[0-9]*$")
       status: new FormControl(""),
       description: new FormControl(""),
       created_by: new FormControl(""),
       created_ip: new FormControl(""),
       modified_by: new FormControl(""),
       code_command_catalog:new FormControl("",[Validators.required]),//accept number only
       sequence:new FormControl("",[Validators.pattern("^[0-9]*$")])
      });
   }

   populateForms(users) {
    // let catalogType=(this.codedCatalogList).filter(type=> { return type.name==users.code_command_catalog.name });
     this.form.patchValue(users);
     //this.logger.info(users);
     let val=this.form.patchValue({code_command_catalog:users.code_command_catalog.id});
     this.form.patchValue({modified_by:this.api.userid.user_id});
   }

   initialize() {
     this.form.patchValue({
       status: "1",
     });
   }

   getcoded_commands(){
     this.api.getAPI(environment.API_URL + "master/coded_commands").subscribe({
       next: (res) => {
         //this.logger.log('codedCommand',res);
         this.dataSource = new MatTableDataSource(res.data);
         let catalogType=(this.codedCatalogList).filter(type=> {  return type.id==res.code_command_catalog });
         this.coded_commandsList = res.data;
         this.dataSource.paginator = this.paginator;
       },
       error: (error) => {
         //this.logger.error('error',error);
       },
     });
   }

   add(){
     this.isReadonly=false;
     this.form.enable();
     let reset=this.formGroupDirective.resetForm();
     if(reset!==null){
      this.initialize();
     }
     this.crudName="Add";
   }

   update(value){
    this.isReadonly=false;
    this.form.enable();
    this.crudName="Edit";
    this.initialize();
    //this.logger.info(value);
    this.populateForms(value);
    let Element=<HTMLInputElement> document.getElementById("exampleCheck1")
    if(this.form.value.status == 1){
      Element.checked=true;
    }else{
      Element.checked=false;
    }
   }

   onView(value) {
    this.crudName = 'View';
    this.isReadonly=true;
    this.form.disable();
    this.populateForms(value);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.form.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
  }

   delete(id){
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "master/coded_commands/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn('Coded command details '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getcoded_commands();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
   }

   crudSubmit(){
     if (this.form.invalid) {
       return;
     } else {
       this.form.value.created_by = this.api.userid.user_id;
       this.form.value.status = this.form.value.status==true ? 1 : 2;
       // this.form.value.code_command_catalog=this.form.value.code_command_catalog.id;
       this.api
         .postAPI(
           environment.API_URL + "master/coded_commands/details",
           this.form.value
         )
         .subscribe((res)=> {
          //this.logger.log('FormValue',res);
          if(res.status==environment.SUCCESS_CODE) {
             this.notification.success(res.message);
             this.getcoded_commands();
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

   close(){
     // this.initialize();
   }

  getcatalogType(){
    this.api.getAPI(environment.API_URL+"master/code_command_catalog?status=1").subscribe({
      next:res=>{
        this.codedCatalogList = res.data;
      },
      error:error=>{
        //this.logger.error('error',error);
      }
    })
  }

  choosedcatalogType(value){
    this.form.value.service_type=value.id;
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
      this.getcoded_commands();
    }
  }
}
