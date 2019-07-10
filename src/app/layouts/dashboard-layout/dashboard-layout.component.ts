import {Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';


import {FuncParam} from '../../domains/models/func.param.model';
import { ChartComponent } from 'src/app/components/chart/chart.component';
import { FunctionSettingsComponent } from 'src/app/components/function-settings/function-settings.component';
import { StorageService } from 'src/app/services';
import { ChartService } from 'src/app/services/chart/chart.service';




@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit, AfterViewInit {
  themeClass = 'blur-mint-theme';

  public pannedzoomed: boolean = false;
  public liveReload: boolean = this.chartService.liveReload;

  public resetStore() {
    this.chartService.forceReload = true;
    this.storageService.reset();
    this.chartService.forceReload = false;
  }

  public resetPanZoom() {
    this.chartService.resetPanZoom();
    this.pannedzoomed = false;
  }

  public reloadChart() {
    this.chartService.reloadChart();
  }

  constructor(
    private storageService: StorageService,
    private chartService: ChartService,
  ) {
  }

  ngOnInit() {
    this.chartService.panedzoomedStateChanged.subscribe( (state: boolean ) => {
      this.pannedzoomed = true;
    });
    this.chartService.liveReloadChanged.subscribe( (state: boolean ) => {
      this.liveReload = state;
    });
  }

  ngAfterViewInit(): void {
  }


}
