import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdownkms',
  templateUrl: './dropdownkms.component.html',
  styleUrls: ['./dropdownkms.component.scss']
})
export class DropdownkmsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  options: string[] = ['CBIU', 'ETMA', 'GTTT', 'MTU', 'DTTT'];

}
