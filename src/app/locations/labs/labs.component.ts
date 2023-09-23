import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective, FormGroup, FormControl, Validators } from '@angular/forms';
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
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss']
})
export class LabsComponent implements OnInit {
  displayedColumns: string[] = [
    "name",
    "code",
    "center",
    "contact_number1",
    "status",
    "view",
    "edit",
    "delete",
  ];
  dataSource: MatTableDataSource<any>;

  country: any;
  public crudName = "Add";
  labList=[];
  public CenterList = [];
  cities=[];
  states= [];
  countries=[];
  ErrorMsg:any;
  error_msg=false;

  moduleAccess:any;
  filterValue:any;
  isReadonly=false;
  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
  };


  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private logger : ConsoleService) {}

  public editForm = new FormGroup({
    id: new FormControl(""),
    center: new FormControl("", [Validators.required]),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),
    contact_number1: new FormControl("", [Validators.required,Validators.pattern("^[0-9+]*$"),Validators.minLength(5)]),
    contact_number2: new FormControl("", [Validators.pattern("^[0-9+]*$"),Validators.minLength(5)]),
    city: new FormControl("", [Validators.required]),
    state: new FormControl("", [Validators.required]),
    country: new FormControl("", [Validators.required]),
    name: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z ]+")]),
    code: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z0-9 ]+")]),
    address: new FormControl("", [Validators.required]),
    zipcode : new FormControl("", [Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(4)]),
    sequence : new FormControl("", [Validators.pattern("^[0-9]*$")]),
    status : new FormControl("", [Validators.required]),

  });



  initForm() {
    this.editForm.patchValue({
     status: "1",
    });
  }



  populate(data) {
    this.getStates(data.country.id);
    this.getCity(data.state.id);
    this.getCenter(data.city.id);
    this.editForm.patchValue({id:data.id});
    this.editForm.patchValue({name:data.name});
    this.editForm.patchValue({status:data.status});
    this.editForm.patchValue({code:data.code});
    this.editForm.patchValue({created_by:data.created_by});
    this.editForm.patchValue({created_ip:data.created_ip});
    this.editForm.patchValue({modified_by:this.api.userid.user_id});
    this.editForm.patchValue({contact_number1:data.contact_number1});
    this.editForm.patchValue({contact_number2:data.contact_number2});
    this.editForm.patchValue({address:data.address});
    this.editForm.patchValue({zipcode:data.zipcode});
    this.editForm.patchValue({sequence:data.sequence});
    this.editForm.patchValue({city:data.city.id});
    this.editForm.patchValue({state:data.state.id});
    this.editForm.patchValue({center:data.center.id});
    this.editForm.patchValue({country:data.country.id});
    //console.log(data);
    //console.log(this.editForm);

  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
    // this.getCenter();
    // this.getCity();
    // this.getStates();
    this.getCountries();
    this.getAccess();
    this.getlab();
  }

  // getCenter() {
  //   this.api
  //     .getAPI(environment.API_URL + "master/center")
  //     .subscribe((res) => {
  //       //this.logger.log('center',res);
  //       this.CenterList = res.data;
  //      });
  // }
  chooseCountry(event) {
    this.getStates(event);
  }
  chooseCity(event) {
    this.getCity(event);
  }
  chooseCenter(event){
    this.getCenter(event);
  }

  getCity(event) {
    let id=event;
    this.api
    .getAPI(environment.API_URL + "master/cities?status=1&state_id="+id)
    .subscribe((res)=> {
      this.cities = res.data;
  });

 }
 getCenter(event) {
    let id=event;
    this.api
    .getAPI(environment.API_URL + "master/center?status=1&city_id="+id)
    .subscribe((res)=> {
      this.CenterList = res.data;
  });

 }

  getStates(event) {
    let id=event;
    this.api
    .getAPI(environment.API_URL + "master/states?status=1&country_id="+id)
    .subscribe((res)=> {
     this.states = res.data;
    });
  }

  getCountries() {
    this.api
    .getAPI(environment.API_URL + "master/countries?status=1")
    .subscribe((res)=> {
      this.countries = res.data;
  });

 }


  create() {
    this.crudName = "Add";
    this.isReadonly=false;
    this.editForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    element.checked = true;
  }

  editOption(center) {
    this.crudName = "Edit";
    this.isReadonly=false;
    this.editForm.enable();
    this.populate(center);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
  }

   onView(country) {
    this.crudName = 'View';
    this.isReadonly=true;
    this.editForm.disable();
    this.populate(country);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
  }

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "master/lab/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn('lab details '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getlab();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  onSubmit() {
     if (this.editForm.valid) {
      this.editForm.value.created_by = this.api.userid.user_id;
      this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "master/lab/details",
          this.editForm.value
        )
        .subscribe((res) => {
          //console.log(this.editForm.value)
          //this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.success(res.message);
            this.getlab();
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
      this.getlab();
    }
  }

  getlab(){
    this.api
    .getAPI(environment.API_URL + "master/lab")
    .subscribe((res)=> {
      this.labList=res.data;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.pagination;
      //console.log(this.labList);
  });
  }

}

