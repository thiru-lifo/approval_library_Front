import { Component, OnInit ,ViewChild, Input, ElementRef} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from "src/app/service/api.service";
import { NotificationService } from "src/app/service/notification.service";
import { MatDialog } from "@angular/material/dialog";
import { ConsoleService } from "src/app/service/console.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { language } from "src/environments/language";
import { Location } from '@angular/common';
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {
  pages:any;
  id:any;

  customOptions: OwlOptions = {
		loop: true,
		margin: 0,
		nav: false,
		// responsiveClass: true,
		autoplay: true,
		autoplayTimeout: 5000,
		center: true,
		autoplaySpeed: 1000,
		autoplayHoverPause: false,
		responsive: {
			0: {
				items: 1,
				nav: false
			},
			480: {
				items: 1,
				nav: false
			},
			667: {
				items: 1,
				nav: true
			},
			1000: {
				items: 1,
				nav: true
			}
		}
	}

  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private route: ActivatedRoute, private elementref : ElementRef,private logger:ConsoleService,private http: HttpClient, private location: Location) {

   }

   public editForm = new FormGroup({
      id: new FormControl(""),
      trial_unit: new FormControl(this.api.decryptData(localStorage.getItem('UNITTITLE')),[Validators.required]),
      name: new FormControl("",[Validators.required]),
      email: new FormControl("",[Validators.required]),
      mobile: new FormControl("",[Validators.required]),
      message: new FormControl("",[Validators.required]),

      // status: new FormControl("", [Validators.required]),
    });


   ngOnInit(): void {
    // this.getPageDetails();
    this.getPageDetails();
  }
  public piechartoptions: any = {

    colors: ['#00bf00', '#f7a400', '#2e305f', '#06bf8d', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],

    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
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
  };
  public linechartoptions: any = {
    chart: {
      type: 'line'
  },
  title: {
      text: ''
  },
  subtitle: {
      text: ''
  },
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: {
      rotation: 90
    }
  },
  yAxis: {
    title: {
      text: 'Number of Trials'
    }
  },
  series: [{
    name: 'Trials in month',
    data: [3, 13, 22, 2, 20, 13, 11, 10, 12, 15, 16,30]
  }]
  };
  public linechartoptions2: any = {
    chart: {
      type: 'line'
  },
  title: {
      text: ''
  },
  subtitle: {
      text: ''
  },
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: {
      rotation: 90
    }
  },
  yAxis: {
    title: {
      text: 'Number of Equipment'
    }
  },
  series: [{
    name: 'Months',
    data: [0, 1, 35, 1, 2, 1, 0, 0, 0, 0, 0,0]
  }]
  };
  trial_id:any;
  trial_code:any;
  ImgUrl:any;
  common_page:any;
  unit_title:any;
  getPageDetails(){
    // this.apiService.getRequest('pages/details/'+this.id+'/').subscribe((result:any)=>{
    //   this.pages= result;
    // });

    this.id = this.api.decryptData(localStorage.getItem('UNITTITLE')).toLowerCase();


    this.http.get(environment.API_URL +'website/pages?page_slug='+this.id+'').subscribe((result:any)=>{
      this.pages= result.data[0];
      this.trial_id = this.pages.trial_unit.id;
      this.trial_code = this.pages.trial_unit.code;
      localStorage.setItem('UNITTITLE',this.trial_code);
      localStorage.setItem('COMMONPAGE','COMMONPAGE');
      var Img = environment.API_URL;
      this.ImgUrl = Img.substring(0,Img.length-1);
      this.getsliders();
    });
  }

  SlideUrl:any;
  sliders:any;
  getsliders(){
    // this.apiService.getRequest('pages/details/'+this.id+'/').subscribe((result:any)=>{
    //   this.pages= result;
    // });
    this.http.get(environment.API_URL +'website/sliders?trial_unit_id='+this.trial_id+'').subscribe((result:any)=>{
      this.sliders= result.data;
      var Img = environment.API_URL;
      this.SlideUrl = Img.substring(0,Img.length-1);
      //this.trial_id = this.pages.trial_unit.id
      //console.log('sliders', this.sliders);
      //console.log('sliders', this.SlideUrl);
    });
  }
  etma() {
    this.router.navigateByUrl('/authenticate/login/etma');
  }
  cbiu() {
    this.router.navigateByUrl('/authenticate/login/cbiu');
  }
  gttt() {
    this.router.navigateByUrl('/authenticate/login/gttt');
  }
  mtu() {
    this.router.navigateByUrl('/authenticate/login/mtu');
  }
  dttt() {
    this.router.navigateByUrl('/authenticate/login/dttt');
  }


  onSubmit() {
      const formData = new FormData();
      formData.append('name', this.editForm.value.name);
      formData.append('email', this.editForm.value.email);
      formData.append('mobile', this.editForm.value.mobile);
      formData.append('message', this.editForm.value.message);
      formData.append('trial_unit', this.editForm.value.trial_unit);
      if (this.editForm.valid) {
        const apiUrl = environment.API_URL + "website/contact/post";

        this.http.post(apiUrl, formData).subscribe(
          (response) => {
            this.notification.displayMessage("Request submited successfully");
            this.editForm.controls['name'].setValue('');
            this.editForm.controls['email'].setValue('');
            this.editForm.controls['mobile'].setValue('');
            this.editForm.controls['message'].setValue('');
          },
          (error) => {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }
        );
      }else{
        this.notification.displayMessage("All Field Required...");
      }
    }


}
