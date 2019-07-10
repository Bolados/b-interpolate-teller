import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { StorageService } from 'src/app/services';
import { FormBuilder, FormGroup, ValidatorFn, AbstractControl, FormControl, Validators } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets, ChartLegendOptions, ChartScales } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';

import {
  create, all
} from 'mathjs';
import { FuncParam, TellerParam } from 'src/app/domains';
import { TellerFunction, TellerExpression, FuncParseEval, GTellerExpression } from 'src/app/domains/models/math.help.model';
import { ChartService, IChart } from 'src/app/services/chart/chart.service';



@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input()
  public liveReload: boolean;

  @Input()
  fxParam: FuncParam;

  public chart: IChart;

  @ViewChild('baseChart', {static: true})
  public baseChartDirective: BaseChartDirective;


  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    // console.log(event, active);
  }

  private onStorageChanged(state: boolean) {
    if (this.chartService.forceReload || this.liveReload) {
      this.chartService.reloadChart();
    }
  }

  constructor(
    private storageService: StorageService,
    private chartService: ChartService,
  ) {
    this.chart = this.chartService.chart;
  }

  ngOnInit() {

    this.chartService.initService(this.baseChartDirective, this.fxParam);
    this.storageService.storageChanged.subscribe(state => {
        this.onStorageChanged(state);
    });
  }

}
