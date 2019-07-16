import {Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ChartService } from 'src/app/services/chart/chart.service';
import { TableDataPointsComponent } from 'src/app/components/table-data-points/table-data-points.component';




@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit, AfterViewInit {
  themeClass = 'blur-mint-theme';
  date = new Date();
  @ViewChild('appTableDataPoints', {static: false}) tableDataPointsComponent: TableDataPointsComponent;
  paginatorPageSize = 1;


  constructor(
    private cdr: ChangeDetectorRef,
    public translateService: TranslateService,
    public chartService: ChartService,

  ) {
  }

  ngOnInit() {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.date = new Date();
      this.cdr.detectChanges();
      this.chartService.reloadChart();
    });
  }

  ngAfterViewInit(): void {
    this.tableDataPointsComponent.paginatorPageSizeChanged.subscribe( value => (this.paginatorPageSize = value));
  }


}
