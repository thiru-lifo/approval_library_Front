import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { language } from 'src/environments/language';
import { NotificationService } from 'src/app/service/notification.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConsoleService } from 'src/app/service/console.service';
// import { EtmagraphpopupComponent } from 'src/app/etmagraphpopup/etmagraphpopup.component';
declare var moment: any;
declare function openModal(selector): any;
declare function closeModal(selector): any;
declare function formSubmit(selector): any;
declare function triggerClick(selector): any;
declare function inArray(needle, haystack);

import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsData from 'highcharts/modules/data';
import { formatDate } from '@angular/common';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.scss'],
  // entryComponents: [EtmagraphpopupComponent],
})
export class AdmindashboardComponent implements OnInit {
  trial_unit_length: any;
  satellite_units_length: any;
  ship_length: any;
  sections_length: any;
  equipments_length: any;
  transaction_length: any;
  trialstatusdata: any;
  data_array_pending: number[] = Array(12).fill(0);
  data_array_approved: number[] = Array(12).fill(0);
  pending_total = 0;
  approved_total = 0;
  pie_chart_data = [];
  unit_title =this.api.decryptData(localStorage.getItem('UNITTITLE'));
  date=new Date()
  displayedColumns: string[] = [
    'trial_number',
    'trial_unit',
    //  "satellite_unit",
    //  "ship",
    //  "section",
    // "equipment",
    'trial_type',
    // "requested_by",
    // "requested_on",
    // "approval",
    'view',
    // "download",
  ];

  displayedReports: string[] = [
    'trial_number',
    'trial_unit',
    'satellite_unit',
    'ship',
    // "section",
    // "equipment",
    'trial_type',
    'requested_by',
    'requested_on',
    'view',
    'download',
  ];

  custom_dashboard: any;
  dataSource: MatTableDataSource<any>;
  public countryList = [];
  @ViewChild(MatPaginator) pagination: MatPaginator;
  moment = moment;
  filterValue: any;
  interval: any;
  moduleAccess: any;
  graph_data: any;
  month_digit_pending: any;
  month_digit_approved: any;



  public piechartoptions2: any = {
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
      pointFormat: '<b>{point.percentage:.1f} %</b>',
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
        data: [
          {
            name: 'CBIU',
            y: 8,
            sliced: true,
            selected: true,
          },
          {
            name: 'ETMA',
            y: 8,
          },
          {
            name: 'GTTT',
            y: 8,
          },
          {
            name: 'MTU',
            y: 8,
          },
          {
            name: 'GTTT',
            y: 8,
          },
          {
            name: 'FTTT',
            y: 8,
          },
          {
            name: 'SEG',
            y: 8,
          },
          {
            name: 'WRSTG',
            y: 8,
          },
        ],
      },
    ],
  };

  // public piechartoptions2: any = {

  //   colors: ['#00bf00', '#f7a400', '#2e305f', '#06bf8d', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],

  //   chart: {
  //       plotBackgroundColor: null,
  //       plotBorderWidth: null,
  //       plotShadow: false,
  //       type: 'pie'
  //   },
  //   title: {
  //       text: ''
  //   },
  //   tooltip: {
  //       pointFormat: '<b>{point.percentage:.1f} %</b>'
  //   },
  //   accessibility: {
  //       point: {
  //           valueSuffix: ''
  //       }
  //   },
  //   plotOptions: {
  //       pie: {
  // 		size:100,
  //           allowPointSelect: true,
  //           cursor: 'pointer',
  //           dataLabels: {
  //               enabled: true,
  //               format: '<b>{point.name}</b>: {point.y}'
  //           }
  //       }
  //   },
  //   series: [{
  //       //name: 'Brands',
  //       colorByPoint: true,
  //       data: [{
  //           name: ' Last 30 days',
  //           y: 8,
  //           sliced: true,
  //           selected: true
  //       }, {
  //           name: ' current Month ',
  //           y: 5
  //       }]
  //   }]
  // }

  appLogo = localStorage.getItem('APPLOGO')
    ? localStorage.getItem('APPLOGO')
    : '';


  isetmagraphpopupOpen = false;


  openetmagraphpopup() {
    this.isetmagraphpopupOpen = !this.isetmagraphpopupOpen;
  }

  closeetmagraphpopup() {
    this.isetmagraphpopupOpen = false;
  }

  public permission = {
    view: true,
    download: true,
  };
  crudName: string;
  isReadonly: boolean;
  editForm: any;

  selectedWidgets = [
    'trial-units-count',
    'satellite-units-count',
    'ships-count',
    'equipment-count',
    'trials-count',
    'recent-notifications',
    'recent-trials',
    'recent-reports',
  ];
  dataSource_recent: MatTableDataSource<unknown>;

  onChangeWidget() {
    //console.log('this.custom_dashboard',this.custom_dashboard);
    localStorage.setItem(
      'custom_dashboard',
      this.api.encryptData(this.custom_dashboard)
    );
  }
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private api: ApiService,
    private dialog: MatDialog,
    private notification: NotificationService,
    private router: Router,
    private logger: ConsoleService
  ) {
    // this.get_graph_data();
    // this.get_gttt_graph();
    // this.get_gttt_graph2();
    // this.get_gttt_graph3();

  }

  ngOnInit(): void {
    this.custom_dashboard = localStorage.getItem('custom_dashboard')
      ? this.api.decryptData(localStorage.getItem('custom_dashboard'))
      : this.selectedWidgets;


    // this.get_trial_units();
    // this.get_satellite_units();
    // this.get_ships();
    // this.get_sections();
    // this.getTrialUnits();
    // this.getSatelliteUnits();
    // this.get_transaction();
    // this.get_recent_trials();
    // this.getNotifications();
    // this.getAccess();
    // this.getTrials();
    // this.get_Ship_count();
    // this.get_equipment_count();

;
  }
  ngAfterViewInit() {
    setTimeout(() => {

      Highcharts.chart('piechartoptions', this.piechartoptions);
      Highcharts.chart('linechartoptions', this.linechartoptions);
      Highcharts.chart('linechartoptions2', this.linechartoptions2);
    }, 1000);


 }

  checkWidgetExists(widgetName = '') {
    return inArray(widgetName, this.custom_dashboard);
  }

  // reloadNotifications()
  // {
  //   this.interval = setInterval(() => {
  //     this.getNotifications();
  //   },5000);

  // }

  get_trial_units() {
    this.api.displayPageloading(true);
    this.api
      .getAPI(environment.API_URL + 'master/trial_units')
      .subscribe((res) => {
        this.trial_unit_length = res.data.length;
        this.api.displayPageloading(false);
      });
  }
 Ship_count:any
  get_Ship_count() {
    this.api
      .getAPI(environment.API_URL + 'master/ship/count')
      .subscribe((res) => {
        this.Ship_count = res.data;
      });
  }
  Equipment_count:any
  get_equipment_count() {
    this.api
      .getAPI(environment.API_URL + 'master/equipment/count')
      .subscribe((res) => {
        this.Equipment_count = res.data;
      });
  }

  trial_unit_id:any;

  get_trial_unit_id(){
    if (this.unit_title=='ETMA')
    {
      this.trial_unit_id ='1';

    }
    if (this.unit_title=='CBIU')
    {
      this.trial_unit_id ='2';

    }
    if (this.unit_title=='DTTT')
    {
      this.trial_unit_id ='5';

    }
    if (this.unit_title=='MTU')
    {
      this.trial_unit_id ='4';

    }
    if (this.unit_title=='GTTT')
    {
      this.trial_unit_id ='3';

    }

  }

  get_graph_data() {
    this.get_trial_unit_id();
    this.trial_unit_id = String(this.trial_unit_id);
    this.api.displayPageloading(true);
    this.api
      .getAPI(environment.API_URL + "transaction/trials-graph-data?trial_unit_id="+this.trial_unit_id)
      .subscribe((res) => {
        this.graph_data = res.data;
        this.api.displayPageloading(false);
        // console.log("graph data : ", this.graph_data);
        // pending
        this.month_digit_pending = this.graph_data.trial_obj_pending.created_on_month;
        this.data_array_pending[this.month_digit_pending - 1] = parseInt(this.graph_data.trial_obj_pending.total)
        this.pending_total = parseInt(this.graph_data['trial_obj_pending'].total)

        // Approved
        this.month_digit_approved = this.graph_data.trial_obj_approved.created_on_month;
        this.data_array_approved[this.month_digit_approved -1] = parseInt(this.graph_data.trial_obj_approved.total);
        this.approved_total =parseInt(this.graph_data['trial_obj_approved'].total)

        this.pie_chart_data.push({name: 'Pending Trials',y: this.pending_total,sliced: true,})
        this.pie_chart_data.push({ name: 'Approved Trials', y: this.approved_total, sliced: true, })
        // console.log("this.pending_total",  this.pie_chart_data);
        // console.log("this.approved_total",this.approved_total);

         });

  }

  title: any = 'GTTT'
  trialUnits: any;
  getTrialUnits() {
    this.api
      .getAPI(environment.API_URL + "master/trial_units?status=1")
      .subscribe((res) => {
        this.trialUnits = res.data;

      });
  }

  commands: any;
  getCommand(trial_unit_id = '') {
    this.trial_unit_id = String(3);
    this.api
      .getAPI(environment.API_URL + "master/command?trial_unit_id=" + this.trial_unit_id + '&status=1')
      .subscribe((res) => {
        this.commands = res.data;
        // if(trial_unit_id=='1'){
        //   this.isEquipment=true;
        //   this.isBoiler=false;
        //  }
        //  else if(trial_unit_id=='2'){
        //   this.isEquipment=false;
        //   this.isBoiler=true;
        //  }
      });
  }

  satelliteUnits: any;
  getSatelliteUnits(command_id = '') {
     this.trial_unit_id =  String(3);
    //debugger;
    this.api
      .getAPI(environment.API_URL + "master/satellite_units?trial_unit_id=" + this.trial_unit_id + "&status=1")
      .subscribe((res) => {
        this.satelliteUnits = res.data;
      });
  }
  ships: any;
  getShips(satellite_unit_id = '') {
    this.trial_unit_id = String(3);
    this.api
      .getAPI(environment.API_URL + "master/ships?"+"satellite_unit_id="+satellite_unit_id+ '&status=1')
      .subscribe((res) => {
        this.ships = res.data;
      });
  }
  sections = [];
  getSections(trial_unit_id = '', satellite_unit_id = '', ship_id = '') {
    this.trial_unit_id = String(3);
    this.api
      .getAPI(environment.API_URL + "master/sections?"+"trial_unit_id="+this.trial_unit_id+"&status=1")
      .subscribe((res) => {
        this.sections = res.data;
        this.sections = [];
        //console.log("RES DATA : ",res.data);
        //console.log("RES MAPPED : ",res.mapped);
        for (let i = 0; i < res.data.length; i++) {
          for (let j = 0; j < res.mapped.length; j++) {
            if (res.data[i].code == res.mapped[j].section_code)
              this.sections.push(res.data[i])
          }
        }

      });
  }

  equipments: any;
  getEquipments(satellite_unit_id = '', ship_id = '', section_id = '') {
    this.trial_unit_id = String(3);
    this.api
      .getAPI(environment.API_URL + "master/equipments?" + "ship_id=" + ship_id + "&section_id=" + section_id + '&status=1')
      .subscribe((res) => {
        this.equipments = res.data;
      });
  }
fromDate: any;
toDate: any;
fromFormat(event) {

    this.fromDate = formatDate(event, 'dd-MM-yyy' ,this.locale);

  }


toFormat(event) {

    this.toDate = formatDate(event, 'dd-MM-yyy' ,this.locale);

  }

  param: any;
    searchForm = new FormGroup({
    trail_unit: new FormControl(""),
    satellite_unit: new FormControl(""),
    ship: new FormControl(""),
    section: new FormControl(""),
    equipment: new FormControl(""),
    from_date: new FormControl(""),
    to_date: new FormControl(""),
  })
  search() {
    let type = this.searchForm.value.trail_unit ? "trial_unit_id=" + this.searchForm.value.trail_unit : "";
    type += this.searchForm.value.satellite_unit ? "&satellite_unit_id=" + this.searchForm.value.satellite_unit : "";
    type += this.searchForm.value.section ? "&section_id=" + this.searchForm.value.section : "";
    type += this.searchForm.value.ship ? "&ship_id=" + this.searchForm.value.ship : "";
    type += this.searchForm.value.equipment ? "&equipment_id=" + this.searchForm.value.equipment : "";
    type += this.searchForm.value.equipment ? "&equipment_id=" + this.searchForm.value.equipment : "";
    type += String(this.fromDate) ? "&from_date=" + String(this.fromDate) : "";
    type +=this.toDate ? "&to_date=" +this.toDate : "";
    this.param = type;
    this.get_gttt_graph()
  }
 clear() {
   this.searchForm.reset();
   this.fromDate = '';
   this.toDate = '';
   this.param = "";
   this.get_gttt_graph();
  }
disableDate(){
    return false;
  }


  // GTTT chart 1
  gtt_graph: any;
  gtt_data:any;
  chart_data = []
  formattedDates = [];
  gtt_data_date: any;
  gtt_date: any;
  get_gttt_graph() {
    this.api.displayPageloading(true);
    if (this.param == undefined) this.param = ""; else this.param;
    this.api
      .getAPI(environment.API_URL + 'transaction/gttt-ex-temp-graph-data?'+this.param)
      .subscribe((res) => {
        this.gtt_graph = res.data
        console.log("gtt_data",this.gtt_graph);
        this.gtt_data =this.gtt_graph.chart_data
        console.log("gtt_data",this.gtt_data);
        this.gtt_data_date =  this.gtt_graph.date
        this.chart_data = this.gtt_data
        this.fromDate = '';
        this.toDate = '';
        this.formattedDates =[]
        this.gtt_data_date.forEach(timestamp => {
              const formattedDate = moment(timestamp).format("MM-YYYY");
              this.formattedDates.push(formattedDate);
        });
         console.log("this.formattedDates", this.formattedDates);
          // this.gtt_date = this.formattedDates.filter(item => item !== '')
          // console.log(" this.gtt_date", this.gtt_date);

        setTimeout(() => {
      Highcharts.chart('container',
 {
     chart: {
        type: 'column'
    },
    title: {
        text: 'GTTT Exhaust Gas Temperature',
        align: 'left'
    },
    xAxis: {
        categories: this.formattedDates
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Count Exhaust Gas Temperature'
        },
        stackLabels: {
            enabled: true
        }
    },
    // legend: {
    //     align: 'left',
    //     x: 70,
    //     verticalAlign: 'top',
    //     y: 70,
    //     floating: true,
    //     backgroundColor:
    //         Highcharts.defaultOptions.legend.backgroundColor || 'white',
    //     borderColor: '#CCC',
    //     borderWidth: 1,
    //     shadow: false
    // },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series:this.chart_data
    //   [{
    //     name: 'BPL',
    //     data: [3, 5, 1, 13]
    // }, {
    //     name: 'FA Cup',
    //     data: [14, 8, 8, 12]
    // }, {
    //     name: 'CL',
    //     data: [0, 2, 6, 3]
    // }]

        });
//     Highcharts.chart('container', {
//     data: {
//         table: 'datatable'
//     },
//     chart: {
//         type: 'column'
//     },
//     title: {
//         text: 'GTTT Exhaust Gas Temperature Month Base Average'
//     },
//     subtitle: {
//         text:
//             'Exhaust Gas Temperature'
//     },
//     xAxis: {
//         type: 'category'
//     },
//     yAxis: {
//         allowDecimals: false,
//         title: {
//             text: 'Count Exhaust Gas Temperature'
//         }
//     }
          // });]
//          Highcharts.chart('container', {
//     chart: {
//         type: 'line'
//     },
//     title: {
//         text: 'GTTT Exhaust Gas Monthly Average Temperature'
//     },
//     // subtitle: {
//     //     text: 'Source: ' +
//     //         '<a href="https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature" ' +
//     //         'target="_blank">Wikipedia.com</a>'
//     // },
//     xAxis: {
//         categories: this.formattedDates
//     },
//     yAxis: {
//         title: {
//             text: 'Exhaust Gas Temperature (°C)'
//         }
//     },
//     plotOptions: {
//         line: {
//             dataLabels: {
//                 enabled: true
//             },
//             enableMouseTracking: true
//         }
//     },
//     series:this.chart_data
//     //  [{
//     //     name: 'Reggane',
//     //     data: [16.0, 18.2, 23.1, 27.9, 32.2, 36.4, 39.8, 38.4, 35.5, 29.2,
//     //         22.0, 17.8]
//     // }, {
//     //     name: 'Tallinn',
//     //     data: [-2.9, -3.6, -0.6, 4.8, 10.2, 14.5, 17.6, 16.5, 12.0, 6.5,
//     //         2.0, -0.9]
//     // }]
// });

    this.api.displayPageloading(false);
    }, 500);

      });
  }
// END
  // GTTT chart 2
fromDate2: any;
toDate2: any;
fromFormat2(event) {

    this.fromDate2 = formatDate(event, 'dd-MM-yyy' ,this.locale);

  }


toFormat2(event) {

    this.toDate2 = formatDate(event, 'dd-MM-yyy' ,this.locale);

  }

  param2: any;
    searchForm2 = new FormGroup({
    trail_unit: new FormControl(""),
    satellite_unit: new FormControl(""),
    ship: new FormControl(""),
    section: new FormControl(""),
    equipment: new FormControl(""),
    from_date: new FormControl(""),
    to_date: new FormControl(""),
  })
  search2() {
    let type = this.searchForm2.value.trail_unit ? "trial_unit_id=" + this.searchForm2.value.trail_unit : "";
    type += this.searchForm2.value.satellite_unit ? "&satellite_unit_id=" + this.searchForm2.value.satellite_unit : "";
    type += this.searchForm2.value.section ? "&section_id=" + this.searchForm2.value.section : "";
    type += this.searchForm2.value.ship ? "&ship_id=" + this.searchForm2.value.ship : "";
    type += this.searchForm2.value.equipment ? "&equipment_id=" + this.searchForm2.value.equipment : "";
    type += this.searchForm2.value.equipment ? "&equipment_id=" + this.searchForm2.value.equipment : "";
    type += String(this.fromDate2) ? "&from_date=" + String(this.fromDate2) : "";
    type +=this.toDate2 ? "&to_date=" +this.toDate2 : "";
    this.param2 = type;
    this.get_gttt_graph()
  }
 clear2() {
   this.searchForm2.reset();
   this.fromDate2 = '';
   this.toDate2 = '';
   this.param2 = "";
   this.get_gttt_graph2();
  }
disableDate2(){
    return false;
  }

gtt_graph2: any;
  gtt_data2:any;
  chart_data2 = []
  formattedDates2= [];
  gtt_data_date2: any;
  gtt_date2: any;
  get_gttt_graph2() {
    this.api.displayPageloading(true);
    if (this.param2 == undefined) this.param2 = ""; else this.param2;
    this.api
      .getAPI(environment.API_URL + 'transaction/gttt-ex-temp-graph-data-2?'+this.param2)
      .subscribe((res) => {
        this.gtt_graph2 = res.data
        console.log("gtt_data",this.gtt_graph2);
        this.gtt_data2 =this.gtt_graph2.chart_data
        this.gtt_data_date2 = this.gtt_graph2.date
        console.log("gtt_data_date2",this.gtt_data_date2);
        this.chart_data2 = this.gtt_data2
        this.fromDate2 = '';
        this.toDate2 = '';
        this.formattedDates2 =[]
        this.gtt_data_date2.forEach(timestamp => {
              const formattedDate2 = moment(timestamp).format("MM-YYYY");
              this.formattedDates2.push(formattedDate2);
        });
         console.log("this.formattedDates2", this.formattedDates2);
          // this.gtt_date = this.formattedDates.filter(item => item !== '')
          // console.log(" this.gtt_date", this.gtt_date);

        setTimeout(() => {
//       Highcharts.chart('container',
//  {
//      chart: {
//         type: 'column'
//     },
//     title: {
//         text: 'GTTT Exhaust Gas Temperature',
//         align: 'left'
//     },
//     xAxis: {
//         categories: this.formattedDates
//     },
//     yAxis: {
//         min: 0,
//         title: {
//             text: 'Count Exhaust Gas Temperature'
//         },
//         stackLabels: {
//             enabled: true
//         }
//     },
//     // legend: {
//     //     align: 'left',
//     //     x: 70,
//     //     verticalAlign: 'top',
//     //     y: 70,
//     //     floating: true,
//     //     backgroundColor:
//     //         Highcharts.defaultOptions.legend.backgroundColor || 'white',
//     //     borderColor: '#CCC',
//     //     borderWidth: 1,
//     //     shadow: false
//     // },
//     tooltip: {
//         headerFormat: '<b>{point.x}</b><br/>',
//         pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
//     },
//     plotOptions: {
//         column: {
//             stacking: 'normal',
//             dataLabels: {
//                 enabled: true
//             }
//         }
//     },
//     series:this.chart_data
//     //   [{
//     //     name: 'BPL',
//     //     data: [3, 5, 1, 13]
//     // }, {
//     //     name: 'FA Cup',
//     //     data: [14, 8, 8, 12]
//     // }, {
//     //     name: 'CL',
//     //     data: [0, 2, 6, 3]
//     // }]

//         });
//     Highcharts.chart('container', {
//     data: {
//         table: 'datatable'
//     },
//     chart: {
//         type: 'column'
//     },
//     title: {
//         text: 'GTTT Exhaust Gas Temperature Month Base Average'
//     },
//     subtitle: {
//         text:
//             'Exhaust Gas Temperature'
//     },
//     xAxis: {
//         type: 'category'
//     },
//     yAxis: {
//         allowDecimals: false,
//         title: {
//             text: 'Count Exhaust Gas Temperature'
//         }
//     }
          // });]
         Highcharts.chart('container2', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'GTTT Exhaust Gas Monthly Average Temperature'
    },
    // subtitle: {
    //     text: 'Source: ' +
    //         '<a href="https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature" ' +
    //         'target="_blank">Wikipedia.com</a>'
    // },
    xAxis: {
        categories: this.formattedDates2
    },
    yAxis: {
        title: {
            text: 'Exhaust Gas Temperature (°C)'
        }
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: true
        }
    },
    series:this.chart_data2
    //  [{
    //     name: 'Reggane',
    //     data: [16.0, 18.2, 23.1, 27.9, 32.2, 36.4, 39.8, 38.4, 35.5, 29.2,
    //         22.0, 17.8]
    // }, {
    //     name: 'Tallinn',
    //     data: [-2.9, -3.6, -0.6, 4.8, 10.2, 14.5, 17.6, 16.5, 12.0, 6.5,
    //         2.0, -0.9]
    // }]
});

    this.api.displayPageloading(false);
    }, 500);

      });
  }
  //END

  // GTTT chart 3

fromDate3: any;
toDate3: any;
fromFormat3(event) {

    this.fromDate3 = formatDate(event, 'dd-MM-yyy' ,this.locale);

  }


toFormat3(event) {

    this.toDate3 = formatDate(event, 'dd-MM-yyy' ,this.locale);

  }

  param3: any;
    searchForm3 = new FormGroup({
    trail_unit: new FormControl(""),
    satellite_unit: new FormControl(""),
    ship: new FormControl(""),
    section: new FormControl(""),
    equipment: new FormControl(""),
    from_date: new FormControl(""),
    to_date: new FormControl(""),
  })
  search3() {
    let type = this.searchForm3.value.trail_unit ? "trial_unit_id=" + this.searchForm3.value.trail_unit : "";
    type += this.searchForm3.value.satellite_unit ? "&satellite_unit_id=" + this.searchForm3.value.satellite_unit : "";
    type += this.searchForm3.value.section ? "&section_id=" + this.searchForm3.value.section : "";
    type += this.searchForm3.value.ship ? "&ship_id=" + this.searchForm3.value.ship : "";
    type += this.searchForm3.value.equipment ? "&equipment_id=" + this.searchForm3.value.equipment : "";
    type += this.searchForm3.value.equipment ? "&equipment_id=" + this.searchForm3.value.equipment : "";
    type += String(this.fromDate3) ? "&from_date=" + String(this.fromDate3) : "";
    type +=this.toDate3 ? "&to_date=" +this.toDate3 : "";
    this.param3 = type;
    this.get_gttt_graph3()
  }
 clear3() {
   this.searchForm3.reset();
   this.fromDate3 = '';
   this.toDate3 = '';
   this.param3 = "";
   this.get_gttt_graph3();
  }
disableDate3(){
    return false;
  }


gtt_graph3: any;
  gtt_data3:any;
  chart_data3= []
  formattedDates3 = [];
  gtt_data_date3: any;
  gtt_date3: any;
  get_gttt_graph3() {
    this.api.displayPageloading(true);
    if (this.param3 == undefined) this.param3 = ""; else this.param3;
    this.api
      .getAPI(environment.API_URL + 'transaction/gttt-ex-temp-graph-data-3?'+this.param3)
      .subscribe((res) => {
        this.gtt_graph3 = res.data
        // console.log("gtt_data",this.gtt_graph3);
        // this.gtt_data3 =this.gtt_graph3.chart_data
        // console.log("gtt_data",this.gtt_data3);
        // this.gtt_data_date3 =  this.gtt_graph3.date
        // this.chart_data3 = this.gtt_data3
        // this.fromDate3 = '';
        // this.toDate3 = '';
        // this.formattedDates3 =[]
        // this.gtt_data_date3.forEach(timestamp => {
        //       const formattedDate3 = moment(timestamp).format("MM-YYYY");
        //       this.formattedDates3.push(formattedDate3);
        // });
        //  console.log("this.formattedDates", this.formattedDates3);
          // this.gtt_date = this.formattedDates.filter(item => item !== '')
          // console.log(" this.gtt_date", this.gtt_date);

        setTimeout(() => {
//       Highcharts.chart('container',
//  {
//      chart: {
//         type: 'column'
//     },
//     title: {
//         text: 'GTTT Exhaust Gas Temperature',
//         align: 'left'
//     },
//     xAxis: {
//         categories: this.formattedDates
//     },
//     yAxis: {
//         min: 0,
//         title: {
//             text: 'Count Exhaust Gas Temperature'
//         },
//         stackLabels: {
//             enabled: true
//         }
//     },
//     // legend: {
//     //     align: 'left',
//     //     x: 70,
//     //     verticalAlign: 'top',
//     //     y: 70,
//     //     floating: true,
//     //     backgroundColor:
//     //         Highcharts.defaultOptions.legend.backgroundColor || 'white',
//     //     borderColor: '#CCC',
//     //     borderWidth: 1,
//     //     shadow: false
//     // },
//     tooltip: {
//         headerFormat: '<b>{point.x}</b><br/>',
//         pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
//     },
//     plotOptions: {
//         column: {
//             stacking: 'normal',
//             dataLabels: {
//                 enabled: true
//             }
//         }
//     },
//     series:this.chart_data
//     //   [{
//     //     name: 'BPL',
//     //     data: [3, 5, 1, 13]
//     // }, {
//     //     name: 'FA Cup',
//     //     data: [14, 8, 8, 12]
//     // }, {
//     //     name: 'CL',
//     //     data: [0, 2, 6, 3]
//     // }]

//         });
    Highcharts.chart('container3', {
    data: {
        table: 'datatable'
    },
    chart: {
        type: 'column'
    },
    title: {
        text: 'GTTT Exhaust Gas Temperature Month Base Average'
    },
    subtitle: {
        text:
            'Exhaust Gas Temperature'
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        allowDecimals: false,
        title: {
            text: 'Count Exhaust Gas Temperature'
        }
    }
          });
//          Highcharts.chart('container', {
//     chart: {
//         type: 'line'
//     },
//     title: {
//         text: 'GTTT Exhaust Gas Monthly Average Temperature'
//     },
//     // subtitle: {
//     //     text: 'Source: ' +
//     //         '<a href="https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature" ' +
//     //         'target="_blank">Wikipedia.com</a>'
//     // },
//     xAxis: {
//         categories: this.formattedDates
//     },
//     yAxis: {
//         title: {
//             text: 'Exhaust Gas Temperature (°C)'
//         }
//     },
//     plotOptions: {
//         line: {
//             dataLabels: {
//                 enabled: true
//             },
//             enableMouseTracking: true
//         }
//     },
//     series:this.chart_data
//     //  [{
//     //     name: 'Reggane',
//     //     data: [16.0, 18.2, 23.1, 27.9, 32.2, 36.4, 39.8, 38.4, 35.5, 29.2,
//     //         22.0, 17.8]
//     // }, {
//     //     name: 'Tallinn',
//     //     data: [-2.9, -3.6, -0.6, 4.8, 10.2, 14.5, 17.6, 16.5, 12.0, 6.5,
//     //         2.0, -0.9]
//     // }]
// });

    this.api.displayPageloading(false);
    }, 500);

      });
  }
//END
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





  get_satellite_units() {
    this.api.displayPageloading(true);
    this.api
      .getAPI(environment.API_URL + 'master/satellite_units')
      .subscribe((res) => {
        this.satellite_units_length = res.data.length;
        this.api.displayPageloading(false);
      });
  }

  get_ships() {
    this.api.displayPageloading(true);
    this.api.getAPI(environment.API_URL + 'master/ships').subscribe((res) => {
      this.ship_length = res.data.length;
      this.api.displayPageloading(false);
    });
  }

  get_sections() {
    this.api.displayPageloading(true);
    this.api
      .getAPI(environment.API_URL + 'master/sections')
      .subscribe((res) => {
        this.sections_length = res.data.length;
        this.api.displayPageloading(false);
      });
  }

  get_equipments() {
    this.api.displayPageloading(true);
    this.api
      .getAPI(environment.API_URL + 'master/equipments')
      .subscribe((res) => {
        this.equipments_length = res.data.length;

        this.api.displayPageloading(false);
      });
  }

  get_transaction() {
    this.api.displayPageloading(true);
    this.api
      .getAPI(environment.API_URL + 'transaction/trials?count=true')
      .subscribe((res) => {
        this.transaction_length = res.total_length;
        this.api.displayPageloading(false);
      });
  }

  notificationsList = [];
  getNotifications() {
    this.api
      .postAPI(
        environment.API_URL +
          'notification/get-notifications?order_column=id&order_type=asc&limit_start=0&limit_end=5',
        {}
      )
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

  viewTrialRequest(trial: any, notification_id: any) {
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

  saveNotificationsLog(notification_id: any) {
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
  populate(country: any) {
    throw new Error('Method not implemented.');
  }

  // goToTrialForm() {
  //   this.router.navigateByUrl(country.trial_type.url);
  // }

  // showTrialForm(country={})
  //   {
  //     /*console.log(country)
  //     this.viewTrial=country;
  //     this.viewTrial['type']='view';
  //     console.log(this.viewTrial['type'])
  //     localStorage.setItem('trial_form',this.api.encryptData(this.viewTrial));
  //     this.goToTrialForm(this.viewTrial.trial_type.code);
  //     console.log(this.viewTrial);*/
  //     this.router.navigateByUrl('/transaction/trials');
  //   }

  showTrialForm(country) {
    // console.log(country);
    // console.log(country)
    // this.viewTrial=country;
    // this.viewTrial['type']='view';
    // //console.log(this.viewTrial['type'])
    // localStorage.setItem('trial_form',this.api.encryptData(this.viewTrial));
    // this.goToTrialForm(this.viewTrial.trial_type.code);
    //console.log(this.viewTrial);*/
    // this.router.navigateByUrl('/transaction/trials');
    this.router.navigateByUrl(country.trial_type.url);
  }

  getTrials() {
    this.api.displayPageloading(true);
    this.api
      .getAPI(
        environment.API_URL +
          'transaction/trials?approved_level=-1&limit_start=0&limit_end=5'
      )
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.api.displayPageloading(false);
        this.countryList = res.data;
        this.dataSource.paginator = this.pagination;
        //this.logger.log('country',this.countryList)
      });
  }

  get_recent_trials() {
    this.api.displayPageloading(true);
    this.api
      .getAPI(
        environment.API_URL + 'transaction/trials?limit_start=0&limit_end=5'
      )
      .subscribe((res) => {
        //console.log(res.data);
        this.api.displayPageloading(false);
        this.dataSource_recent = new MatTableDataSource(res.data);
        this.countryList = res.data;
        this.dataSource_recent.paginator = this.pagination;
      });
  }
  approvalHistory: any;
  openApprovalHistory(history = '') {
    this.approvalHistory = history;
    openModal('#approval-history');
  }

  public approvalForm = new FormGroup({
    approved_level: new FormControl(''),
    trial_id: new FormControl('', [Validators.required]),
    comments: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    trial_unit: new FormControl('', [Validators.required]),
    satellite_unit: new FormControl('', [Validators.required]),
    approved_role_id: new FormControl(this.api.userid.role_id, [
      Validators.required,
    ]),
  });
  ErrorApproval = (controlName: string, errorName: string) => {
    return this.approvalForm.controls[controlName].hasError(errorName);
  };

  trialPage: any;
  openApprovalForm(trial) {
    this.approvalForm.patchValue({
      trial_id: trial.id,
      approved_level: trial.approval.level ? trial.approval.level : '',
      trial_unit: trial.trial_unit.id,
      satellite_unit: trial.satellite_unit.id,
      approved_role_id: this.api.userid.role_id,
    });
    openModal('#approval-modal');
    this.trialPage = trial.trial_type.code;
    //console.log(trial.trial_type.code,'trial');
    // this.onView(trial.trial_type.codex);
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
    //console.log('onApprovalSubmit',this.approvalForm);
    if (this.approvalForm.valid) {
      //console.log(this.approvalForm.value);
      this.api
        .postAPI(
          environment.API_URL + 'transaction/trials/approval',
          this.approvalForm.value
        )
        .subscribe((res) => {
          closeModal('#approval-modal');
          this.approvalForm.patchValue({ comments: '' });
          if (res.status == environment.SUCCESS_CODE) {
            this.notification.success(res.message);
            this.get_recent_trials();
          } else if (res.status == environment.ERROR_CODE) {
            this.notification.displayMessage(res.message);
          } else {
            this.notification.displayMessage(
              language[environment.DEFAULT_LANG].unableSubmit
            );
          }
        });
    }
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
      case 'BABASTBD':
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
    window.open(
      environment.API_URL + trial.trial_type.report_url + trial.id,
      '_blank',
      'location=no,height=' +
        window.screen.height +
        ',width=' +
        window.screen.width +
        ',scrollbars=yes,status=yes'
    );
  }
  // onView() {
  //   closeModal('#approval-modal');

  //   //console.log(this.trialPage);
  //    switch(this.trialPage)
  //   {
  //     case 'HSC':
  //       this.router.navigateByUrl('/transaction/hs-converter');
  //     break;
  //     case 'HSRP':
  //       this.router.navigateByUrl('/transaction/hsr-proforma');
  //     break;
  //     case 'IPDA':
  //       this.router.navigateByUrl('/transaction/inhouse-proforma-da');
  //     break;
  //     case 'LTPDA':
  //       this.router.navigateByUrl('/transaction/load-trial-proforma-da');
  //     break;
  //     case 'IPGTG':
  //       this.router.navigateByUrl('/transaction/inhouse-proforma-gtg');
  //     break;
  //     case 'LTPGTG':
  //       this.router.navigateByUrl('/transaction/load-trial-proforma-gtg');
  //     break;
  //     case 'PRTT':
  //       this.router.navigateByUrl('/transaction/pre-refit-trial');
  //     break;
  //     case 'POTT':
  //       this.router.navigateByUrl('/transaction/post-refit-trial');
  //     break;
  //     case 'EHC':
  //       this.router.navigateByUrl('/transaction/eh-checks');
  //     break;
  //   }
  // }

  getAccess() {
    this.moduleAccess = this.api.getPageAction();
    if (this.moduleAccess) {
      let viewPermission = this.moduleAccess
        .filter(function (access) {
          if (access.code == 'VIW') {
            return access.status;
          }
        })
        .map(function (obj) {
          return obj.status;
        });
      let downloadPermission = this.moduleAccess
        .filter(function (access) {
          if (access.code == 'DOW') {
            return access.status;
          }
        })
        .map(function (obj) {
          return obj.status;
        });
      this.permission.view =
        viewPermission.length > 0 ? viewPermission[0] : false;
      this.permission.download =
        downloadPermission.length > 0 ? downloadPermission[0] : false;
    }

    //this.logger.log('this.permission',this.permission);
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if (this.filterValue) {
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.get_recent_trials();
    }
  }
}
