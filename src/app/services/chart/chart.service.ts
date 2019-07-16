import { Injectable, EventEmitter, Output } from '@angular/core';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { ChartOptions, ChartType, ChartDataSets, ChartPluginsOptions } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { FuncParam, TellerParam } from 'src/app/domains';
import * as zoomPlugin from 'chartjs-plugin-zoom';


import { TellerFunction, FuncParseEval} from 'src/app/domains/models/math.help.model';
import { StorageService } from '../storage';

import { GlobalService } from '../global/global.service';
import { MathService } from '../math/math.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';


function buildPlugins(panedzoomedStateChange: EventEmitter<boolean> ): ChartPluginsOptions {
  return  {
    zoom: {
        // Container for pan options
        pan: {
            // Boolean to enable panning
            enabled: true,

            // Panning directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow panning in the y direction
            mode: 'xy',

            rangeMin: {
                // Format of min pan range depends on scale type
                x: null,
                y: null
            },
            rangeMax: {
                // Format of max pan range depends on scale type
                x: null,
                y: null
            },
            speed: 10,
            threshold: 10,

            // Function called while the user is panning
            onPan({chart}) {  },
            // Function called once panning is completed
            onPanComplete({chart}) { panedzoomedStateChange.emit(true); } ,
        },

        // Container for zoom options
        zoom: {
            // Boolean to enable zooming
            enabled: true,

            // Enable drag-to-zoom behavior
            drag: false,

            // Drag-to-zoom rectangle style can be customized
            // drag: {
            // 	 borderColor: 'rgba(225,225,225,0.3)'
            // 	 borderWidth: 5,
            // 	 backgroundColor: 'rgb(225,225,225)'
            // },

            // Zooming directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow zooming in the y direction
            mode: 'xy',

            rangeMin: {
                // Format of min zoom range depends on scale type
                x: null,
                y: null
            },
            rangeMax: {
                // Format of max zoom range depends on scale type
                x: null,
                y: null
            },

            // Speed of zoom via mouse wheel
            // (percentage of zoom on a wheel event)
            speed: 0.1,
            limits: {
              max: 10,
              min: 0.5
            },

            // Function called while the user is zooming
            onZoom({chart}) { },
            // Function called once zooming is completed
            onZoomComplete({chart}) {panedzoomedStateChange.emit(true); },
        }
    }
  };
}


const ChartOpts: ChartOptions  = {
  responsive: true,
  // title: {
  //   display: true,
  //   text: "Chart"
  // },
  elements: {
          line: {
              tension: 0 // disables bezier curves
          }
      },
  scales : {
    yAxes: [{
      display: true,
      scaleLabel: {
        display: false,
        labelString: 'y'
      },
      ticks: {
        stepSize: 1,
      }
    }],
    xAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'x'
      },
      ticks: {
        stepSize: 1,
      }
    }],
  },

  plugins: {},

  animation: {
    duration: 0, // general animation time
  },
  hover: {
    // mode: 'nearest',
    // intersect: false,
    animationDuration: 0, // duration of animations when hovering an item
  },
  responsiveAnimationDuration: 0, // animation duration after a resize

  // tooltips: {
  //   mode: 'nearest',
  //   intersect: false,
  // },
};


export const INDEX_POINT_DRAW = 0;
export const INDEX_FX_DRAW = 1;
export const INDEX_TX_DRAW = 2;
export const INDEX_GTX_DRAW = 3;
export const INDEX_VX_DRAW = 4;
export const INDEX_EPSILON_TX_DRAW = 5;
export const INDEX_EPSILON_GTX_DRAW = 6;


const ChartData: IChartData[] = [
  {
    ID: 'POINTS',
    label: 'Points',
    type: 'scatter',
    active: true,
    dataSets: [],
    displayPoint: true,
    tellerPoint: null,
    fill: false,
    showLine: false,
    borderWidth: 3,
  },
  {
    ID: 'FX',
    label: 'F(x)',
    type: 'line',
    active: false,
    dataSets: [],
    displayPoint: false,
    tellerPoint: null,
    fill: false,
    showLine: true,
    borderWidth: 3,
  },
  {
    ID: 'TX',
    label: 'Ti(x)',
    type: 'line',
    active: false,
    dataSets: [],
    displayPoint: false,
    tellerPoint: 0,
    fill: false,
    showLine: true,
    borderWidth: 3,
  },
  {
    ID: 'GTX',
    label: 'GT(x)',
    type: 'line',
    active: false,
    dataSets: [],
    displayPoint: false,
    tellerPoint: null,
    fill: false,
    showLine: true,
    borderWidth: 3,
  },
  {
    ID: 'VX',
    label: 'V(x)',
    type: 'line',
    active: false,
    dataSets: [],
    displayPoint: false,
    tellerPoint: null,
    fill: false,
    showLine: true,
    borderWidth: 6,
  },
  {
    ID: 'EPSILON-TX',
    label: 'Epsilon T(x)',
    type: 'line',
    active: false,
    dataSets: [],
    displayPoint: false,
    tellerPoint: null,
    fill: true,
    showLine: true,
    borderWidth: 3,
  },
  {
    ID: 'EPSILON-GTX',
    label: 'Epsilon GT(x)',
    type: 'line',
    active: false,
    dataSets: [],
    displayPoint: false,
    tellerPoint: null,
    fill: true,
    showLine: true,
    borderWidth: 3,
  },
];

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  @Output() chartDataStateChanged: EventEmitter<void> = new EventEmitter();
  @Output() liveReloadChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() panedzoomedStateChanged: EventEmitter<boolean> = new EventEmitter();

  public chartData: IChartData[] = ChartData;

  public baseChartDirective: BaseChartDirective;
  public fxParam: FuncParam;
  public vxParam: FuncParam;

  public chart: IChart = this.buildChart();

  public liveReload = false;
  public forceReload = false;




  private buildChart(): IChart {
    const options: ChartOptions = ChartOpts;
    options.plugins = buildPlugins(this.panedzoomedStateChanged);
    return {
      options,
      labels: [],
      legend: true,
      plugins: [zoomPlugin],
      type: 'scatter',
      colors: [],
      datasets: []
    };
  }


  private builderChartPoint(data: IChartData, callbackDatasets: IDataSet[], color: string = 'black'): BuilderChartData {
    return {
      colors: {
        borderColor: color,
        backgroundColor: color,
        pointHoverBackgroundColor: 'gray',
        pointHoverBorderColor: 'gray'
      },
      datasets: {
        data: data.active ? callbackDatasets : [],
        label: data.label,
        pointRadius: this.displayPointRadius(data.displayPoint),
      }
    };
  }

  private builderChartLine(data: IChartData, callbackDatasets: IDataSet[], color: string = 'black'): BuilderChartData {
    return {
      colors: {
        borderColor: color,
        backgroundColor: color,
      },
      datasets: {
        data: data.active ? callbackDatasets : [],
        label: data.label,
        type: data.type,
        pointRadius: this.displayPointRadius(data.displayPoint),
        showLine: data.showLine,
        fill: data.fill,
        borderWidth: data.borderWidth,
      },
    };
  }

  private builderChart(index: number, value: IChartData): BuilderChartData {
    switch (index) {
      case 0:
        return this.builderChartPoint(value, this.storageService.getStoreCoordinates());
      case 1:
        return this.builderChartLine(value, this.evaluateFuncData(this.fxParam).data, 'green');
      case 2:
        return this.builderChartLine(value,
          this.evaluateTellerData(
            this.fxParam, this.storageService.store, value.tellerPoint,
            this.storageService.step, this.storageService.deltaX
          ).data, 'indigo');
      case 3:
        return this.builderChartLine(value,
          this.evaluateGTellerData(this.fxParam, this.storageService.store).data,
          'blue');
      case 4:
        return this.builderChartLine(value, this.evaluateFuncData(this.vxParam).data, 'yellow');
      case 5:
        return this.builderChartLine(value,
          this.evaluateTellerData(
            this.fxParam, this.storageService.store, value.tellerPoint,
            this.storageService.step, this.storageService.deltaX
          ).epsilon, 'pink');
      case 6:
        return this.builderChartLine(value,
          this.evaluateGTellerData(this.fxParam, this.storageService.store).epsilon, 'red');
      default:
        break;
    }
    return {
      colors: {},
      datasets: {}
    };
  }

  private packChart() {
    const datasets: ChartDataSets [] = [];
    const colors: Color[] = [];
    this.chartData.forEach( (value, index) => {
      if (value.active) {
        const builder: BuilderChartData = this.builderChart(index, value);
        datasets.push(builder.datasets);
        colors.push(builder.colors);
      }
    });
    this.chart.colors = colors;
    this.chart.datasets = datasets;
    return this.chart;
  }

  private drawChart() {
    this.initLangService();
    this.chart = this.packChart();
    this.baseChartDirective.datasets = this.chart.datasets;
    this.baseChartDirective.colors = this.chart.colors;
  }

  public redrawChart() {
    if (this.baseChartDirective !== undefined) {
      this.baseChartDirective.chart.destroy();
      this.drawChart();
      this.baseChartDirective.ngOnInit();
    }
  }

  public reloadChart() {
    if (this.baseChartDirective !== undefined) {
      this.drawChart();
      this.baseChartDirective.ngOnChanges({
        datasets: {
            currentValue: this.baseChartDirective.datasets,
            previousValue: null,
            firstChange: false,
            isFirstChange: () => false
        }
    });
    }
  }

  public resetChart() {
    this.chartData.forEach( (value, index) => {
      value.active = false;
    });
    this.redrawChart();
  }

  public resetPanZoom() {
    this.redrawChart();
  }

  private initLangService() {
    this.chartData.forEach( (value, index) => {
      this.translateService.get('CHART.LEGEND.' + value.ID.toUpperCase(), {value: value.tellerPoint}).subscribe((res: string) => {
        value.label = res;
      });
    });
  }
  public initService(baseChartDirective: BaseChartDirective, fxParam: FuncParam) {
    this.baseChartDirective = baseChartDirective;
    this.fxParam = fxParam;
    this.drawChart();
  }

  private validate(index: number, min: number = 0, max: number = this.chartData.length) {
    return !((index < min) || (index > max));
  }

  public changeChartData(index: number, key: string, value: any, reload: boolean = true) {
    if (!this.validate(index)) {
      return;
    }
    if (this.chartData[index][key] !== value) {
      this.chartData[index][key] = value;
      if (reload) {
        this.reloadChart();
      }
      this.chartDataStateChanged.emit();
    }
  }

  public onResetStore(){
    this.chartData[INDEX_EPSILON_TX_DRAW].active = false;
    this.chartData[INDEX_TX_DRAW].active = false;
    this.chartData[INDEX_EPSILON_GTX_DRAW].active = false;
    this.chartData[INDEX_GTX_DRAW].active = false;
    this.reloadChart();
  }

  public changeLiveReload(value: boolean) {
    if (this.liveReload !== value) {
      this.liveReload = value;
      this.liveReloadChanged.emit(value);
    }
  }

  public changeForceLiveReload(value: boolean) {
    if (this.forceReload !== value) {
      this.forceReload = value;
    }
  }


  private haveDataSets(datasets) {
    return datasets.length > 0;
  }

  private displayPointRadius(checked: boolean = false, value: number = 5) {
    return checked ? value : 0 ;
  }

  private epsilon(datasets1: IDataSet[], datasets2: IDataSet[]): IDataSet[] {
    console.log(datasets1, datasets2);
    const values: IDataSet[] = [];
    if (datasets1.length === datasets2.length) {
      const xValues1 = datasets1.map(v => v.x);
      const xValues2 = datasets2.map(v => v.x);
      if (JSON.stringify(xValues1.sort()) === JSON.stringify(xValues2.sort())) {
        const xValues = xValues1;
        xValues.forEach((x, index) => {
          const xValue1 = datasets1.filter(v => v.x === x );
          const xValue2 = datasets2.filter(v => v.x === x );
          const y = Math.abs(xValue1[xValue1.length - 1].y - xValue2[ xValue1.length - 1].y);
          const value: IDataSet = { x, y };
          values.push(value);
        });
      }
    }
    return values;
  }

  private builderX(min: number, max: number, step: number = 0.1, delta: number = 0): Array<number> {
    let xValues = [min - delta, min, max, max + delta];
    let x: number | any = min - delta;
    while (x < max + delta) {
      x = this.mathService.math.round(x, 4);
      xValues.push(x);
      x += step;
    }
    xValues = xValues.filter((item, index) => xValues.indexOf(item) === index);
    return xValues.sort((a, b) => 0 - (a > b ? -1 : 1));
  }

  public evaluateFuncData(param: FuncParam): IEvaluateData {
    const evalData = {
      data: [],
      epsilon: [],
    };
    let occuredError = false;
    if (param && param.func) {
      const builderX = this.builderX(param.xMin, param.xMax, param.step, param.deltaX);
      builderX.forEach(x => {
        try {
          const y = this.mathService.math.evaluate(param.func.toString(), {x});
          const value: IDataSet = {
              x,
              y: ( y !== Infinity) ? this.mathService.math.round(y, 4) : null,
            };
          evalData.data.push(value);
        } catch (error) {
          occuredError = true;
          console.log('Error in process evaluation : ', x, param);
          console.log('error : ', error);
        }
      });
    }
    return occuredError ? {data: [], epsilon: []} : evalData;
  }



  public evaluateTellerData(param: FuncParam, store: TellerParam[], index: number, step: number, deltaX: number ): IEvaluateData {
    const evalData = {
      data: [],
      epsilon: [],
    };
    let occuredError = false;
    if (param && param.func && this.validate(index, 0, store.length - 1)) {
      const tellerFunction: TellerFunction = this.mathService.TellerExpression(index, store[index].point.x,
          param.func, store[index].beta);
      if (!tellerFunction) {return evalData; }
      const teller: FuncParseEval = new FuncParseEval('t(x)', tellerFunction.expression, tellerFunction.scope, this.mathService.math);
      const builderX = this.builderX(store[index].point.x,
        store[index].point.x, step, deltaX
      );

      builderX.forEach(x => {
        try {
          const yTeller = teller.eval(x);
          const yFx = this.mathService.math.evaluate(param.func.toLowerCase(), {x});
          evalData.data.push(
            {
              x,
              y: (yTeller !== Infinity) ? yTeller : null,
            }
          );
          evalData.epsilon.push(
            {
              x,
              y: ( (yTeller !== Infinity) && (yFx !== Infinity)) ? Math.abs(yTeller - yFx) : null,
            }
          );
        } catch (error) {
          occuredError = true;
          console.log('Error in process evaluation : x = ', x, ' param = ', param, ' index = ', index);
        }
      });
    }
    return occuredError ? {data: [], epsilon: []} : evalData;
  }

  private evaluateGTellerData(param: FuncParam, store: TellerParam[]): IEvaluateData {
    const evalData = {
      data: [],
      epsilon: [],
    };
    let occuredError = false;
    if (param && param.func && (store.length > 0)) {
      const gTellerFunction: TellerFunction = this.mathService.GTellerExpression(store, param.func);
      if (!gTellerFunction) {return evalData; }
      const gTeller: FuncParseEval = new FuncParseEval('t(x)', gTellerFunction.expression, gTellerFunction.scope, this.mathService.math);

      store.forEach(value => {
        const x = value.point.x;
        try {
          const yTeller = gTeller.eval(x);
          const yFx = this.mathService.math.evaluate(param.func.toLowerCase(), {x});
          evalData.data.push(
            {
              x,
              y: (yTeller !== Infinity) ? yTeller : null,
            }
          );
          evalData.epsilon.push(
            {
              x,
              y: ( (yTeller !== Infinity) && (yFx !== Infinity)) ? Math.abs(yTeller - yFx) : null,
            }
          );
        } catch (error) {
          occuredError = true;
          console.log('Error in process evaluation : x = ', x, ' param = ', param);
        }
      });
    }
    return occuredError ? {data: [], epsilon: []} : evalData;
  }

  constructor(
    private storageService: StorageService,
    private mathService: MathService,
    private translateService: TranslateService,
  ) { }
}



export interface IEvaluateData {
  data: IDataSet[];
  epsilon: IDataSet[];
}

export interface IDataSet {
  x: number | any ;
  y: number | any;
}

export interface IChartData {
  ID : string;
  active: boolean;
  dataSets: IDataSet[];
  label: string;
  type: ChartType;
  displayPoint: boolean;
  tellerPoint: number;
  fill: boolean;
  showLine: boolean;
  borderWidth: number;
}

export interface IChart {
  options: ChartOptions ;
  labels: Label[];
  legend: boolean;
  type: ChartType;
  colors: Color[];
  datasets: ChartDataSets[];
  plugins: any[];
}

export interface BuilderChartData {
  datasets: ChartDataSets;
  colors: Color;
}

