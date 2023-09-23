import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-permissiondenied',
  templateUrl: './permissiondenied.component.html',
  styleUrls: ['./permissiondenied.component.scss']
})
export class PermissiondeniedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  goPreviousPage()
  {
    window.history.back();
  }

}
