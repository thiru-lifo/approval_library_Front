import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from "src/app/service/api.service";
import { NotificationService } from "src/app/service/notification.service";
import { MatDialog } from "@angular/material/dialog";
import { ConsoleService } from "src/app/service/console.service";
import { environment } from "src/environments/environment";
import { HttpClient } from '@angular/common/http';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PageFooterComponent } from './page-footer/page-footer.component';
// import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsData from 'highcharts/modules/data';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);



@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  pages: any;
  id: any;
  data_array_pending: number[] = Array(12).fill(0);
  data_array_approved: number[] = Array(12).fill(0);
  pending_total = 0;
  approved_total = 0;
  pie_chart_data = [];
  unit_title: any;
  graph_data: any;
  month_digit_pending: any;
  month_digit_approved: any;
  trial_unit_id: any;



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

  constructor(public api: ApiService, private notification: NotificationService,
    private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private elementref: ElementRef, private logger: ConsoleService, private http: HttpClient) {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      if (params['id']) {
        this.getPageDetails();
      }
    });
    //  this.get_graph_data();
  }


  ngOnInit(): void {
    this.unit_title = localStorage.getItem('UNITTITLE');
    // this.getPageDetails();
  }

    ngAfterViewInit() {
    setTimeout(() => {
      //console.log("this.piechartoptions : ",this.piechartoptions);
      Highcharts.chart('piechartoptions', this.piechartoptions);
      Highcharts.chart('linechartoptions', this.linechartoptions);
      Highcharts.chart('linechartoptions2', this.linechartoptions2);
    }, 1000);
 }

  get_trial_unit_id() {
    console.log("UNITTITLE in LANDING PAGE : ", this.unit_title);
    if (this.unit_title == 'ETMA') {
      this.trial_unit_id = '1';

    }
    else if (this.unit_title == 'CBIU') {
      this.trial_unit_id = '2';

    }
    else if (this.unit_title == 'DTTT') {
      this.trial_unit_id = '5';

    }
    else if (this.unit_title == 'MTU') {
      this.trial_unit_id = '4';

    }
    else if (this.unit_title == 'GTTT') {
      this.trial_unit_id = '3';

    } else {
      this.trial_unit_id = '1';
    }

  }
  // get_graph_data() {
  //   this.get_trial_unit_id();
  //   this.trial_unit_id = String(this.trial_unit_id);
  //   // console.log("Trial unit id in graph call : ",this.trial_unit_id);
  //   this.api.displayPageloading(true);

  //   this.http.get(environment.API_URL + "transaction/trials-graph-data-landing-page?trial_unit_id=" + this.trial_unit_id).subscribe((res: any) => {
  //     this.graph_data = res.data;

  //     this.api.displayPageloading(false);
  //     // console.log("graph data : ",this.graph_data);
  //        // pending
  //       this.month_digit_pending = this.graph_data.trial_obj_pending.created_on_month;
  //       this.data_array_pending[this.month_digit_pending - 1] = parseInt(this.graph_data.trial_obj_pending.total)
  //       this.pending_total = parseInt(this.graph_data['trial_obj_pending'].total)

  //       // Approved
  //       this.month_digit_approved = this.graph_data.trial_obj_approved.created_on_month;
  //       this.data_array_approved[this.month_digit_approved -1] = parseInt(this.graph_data.trial_obj_approved.total);
  //       this.approved_total =parseInt(this.graph_data['trial_obj_approved'].total)

  //       this.pie_chart_data.push({name: 'Pending Trials',y: this.pending_total,sliced: true,})
  //       this.pie_chart_data.push({ name: 'Approved Trials', y: this.approved_total, sliced: true, })
  //       // console.log("this.pending_total",  this.pie_chart_data);

  //   });

  // }

  public linechartoptions: any = {
    chart: {
      type: 'line',
    },
    title: {
      text: '',
    },
    subtitle: {
      text: '',
    },

    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      labels: {
        rotation: 90,
      },
    },
    yAxis: {
      title: {
        text: 'Number of Trials',
      },
    },

    series: [
      {
        name: 'Trials in month',
        //data: [3, 13, 22, 2, 20, 13, 11, 10, 12, 15, 16,30]
        data: this.data_array_pending,
      },
    ],
  };

  public linechartoptions2: any = {
    chart: {
      type: 'line',
    },
    title: {
      text: '',
    },
    subtitle: {
      text: '',
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      labels: {
        rotation: 90,
      },
    },
    yAxis: {
      title: {
        text: 'Number of Trials',
      },
    },
    series: [
      {
        name: 'Month',
        data: this.data_array_approved
      },
    ],
  };



  public piechartoptions: any = {
    colors: [
      '#00bf00',
      '#f7a400',
      '#2e305f',
      '#06bf8d',
      '#24CBE5',
      '#64E572',
      '#FF9655',
      '#FFF263',
      '#6AF9C4',
    ],

    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    title: {
      text: '',
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    accessibility: {
      point: {
        valueSuffix: '',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}',
        },
      },
    },

    series: [
      {
        //name: 'Brands',
        colorByPoint: true,
        data: this.pie_chart_data,
      },
    ],
  };

  trial_id: any;
  trial_code: any;
  ImgUrl: any;
  getPageDetails() {
    // this.apiService.getRequest('pages/details/'+this.id+'/').subscribe((result:any)=>{
    //   this.pages= result;
    // });
    this.http.get(environment.API_URL + 'website/pages?page_slug=' + this.id + '').subscribe((result: any) => {
      this.pages = result.data[0];
      this.trial_id = this.pages.trial_unit.id;
      this.trial_code = this.pages.trial_unit.code;
      localStorage.setItem('UNITTITLE', this.trial_code);
      localStorage.setItem('COMMONPAGE', 'COMMONPAGE');
      var Img = environment.API_URL;
      this.ImgUrl = Img.substring(0, Img.length - 1);
      this.getsliders();
      //console.log('pages', result);
    });
  }

  SlideUrl: any;
  sliders: any;
  getsliders() {
    let favIcon: HTMLLinkElement = document.querySelector('#favIcon');
    if (this.trial_code=="ETMA"){
      favIcon.href = 'assets/images/etma-logo.jpg';
    }
    if (this.trial_code=="CBIU"){
      favIcon.href = 'assets/images/cbiu-logo.png';
    }
    if (this.trial_code=="MTU"){
      favIcon.href = 'assets/images/mtu-logo.jpg';
    }
    if (this.trial_code=="DTTT"){
      favIcon.href = 'assets/images/dttt-logo.jpg';
    }
    if (this.trial_code=="GTTT"){
      favIcon.href = 'assets/images/gttt-logo.jpg';
    }
    // this.apiService.getRequest('pages/details/'+this.id+'/').subscribe((result:any)=>{
    //   this.pages= result;
    // });
    this.http.get(environment.API_URL + 'website/sliders?trial_unit_id=' + this.trial_id + '').subscribe((result: any) => {
      this.sliders = result.data;
      var Img = environment.API_URL;
      this.SlideUrl = Img.substring(0, Img.length - 1);
      //this.trial_id = this.pages.trial_unit.id
      //console.log('sliders', this.sliders);
      //console.log('sliders', this.SlideUrl);
      let favIcon: HTMLLinkElement = document.querySelector('#favIcon');
      if (this.trial_code=="ETMA"){
        favIcon.href = 'assets/images/etma-logo.jpg';
      }
      if (this.trial_code=="CBIU"){
        favIcon.href = 'assets/images/cbiu-logo.png';
      }
      if (this.trial_code=="MTU"){
        favIcon.href = 'assets/images/mtu-logo.jpg';
      }
      if (this.trial_code=="DTTT"){
        favIcon.href = 'assets/images/dttt-logo.jpg';
      }
      if (this.trial_code=="GTTT"){
        favIcon.href = 'assets/images/gttt-logo.jpg';
      }
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

}
