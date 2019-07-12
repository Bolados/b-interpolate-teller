import {Component, OnInit, AfterViewInit} from '@angular/core';




@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit, AfterViewInit {
  themeClass = 'blur-mint-theme';

  constructor(

  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }


}
