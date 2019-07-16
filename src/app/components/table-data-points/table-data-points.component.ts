import { Component, ViewChild, AfterViewInit, ViewChildren, QueryList,
  Input, ElementRef, OnInit, Output , EventEmitter} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog} from '@angular/material';
import { ChartService, INDEX_TX_DRAW, INDEX_EPSILON_TX_DRAW} from 'src/app/services/chart/chart.service';
import {Point} from '../../domains/models/point.model';
import {TellerParam} from '../../domains/models/teller.param.model';
import {StorageService} from '../../services/storage/storage.service';
import { TellerFunction } from 'src/app/domains/models/math.help.model';
import { FunctionSettingsComponent } from '../function-settings/function-settings.component';
import { Overlay } from '@angular/cdk/overlay';
import { TellerFormuleDialogComponent } from '../dialogs';
import { MathjaxComponent } from '../mathjax';
import { MathService } from 'src/app/services/math/math.service';


@Component({
  selector: 'app-table-data-points',
  templateUrl: './table-data-points.component.html',
  styleUrls: ['./table-data-points.component.scss']
})
export class TableDataPointsComponent implements OnInit, AfterViewInit {

  @Output() paginatorPageSizeChanged: EventEmitter<number> = new EventEmitter();

  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  @ViewChild('matSort', {static: false}) matSort: MatSort;
  @ViewChildren('mathjaxs') mathjaxs: QueryList<MathjaxComponent>;

  dataSource: MatTableDataSource<PointsData>;
  liveReload: boolean;


  @Input()
  paramOnly = false;
  @Input()
  coordinateOnly = false;
  @Input()
  functionSettingComponent: FunctionSettingsComponent;
  @Input()
  paginatorPageSize: number = 1;


  public seeTellerExpression(element: PointsData) {
    if (this.functionSettingComponent.funcFormGroup.valid) {
      const index: number = +element.id - 1;
      const xIndex: number = +element.x;
      const func: string = this.functionSettingComponent.funcFormGroup.value.func;
      const beta: number[] = [];
      element.beta.forEach(value => {
        beta.push(+value);
      });
      const tellerFunction: TellerFunction = this.mathService.TellerExpression(index, xIndex, func, beta );
      if (tellerFunction) {
        const format = 'T_{x_' + index + '}(x)';
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.elementRef.nativeElement.getBoundingClientRect();
        const top = elemRect.top - 150 ;
        const right = bodyRect.right - elemRect.right;
        const dialogRef = this.dialog.open(TellerFormuleDialogComponent, {
          panelClass: 'dialog',
          width: '75%',
          // height,
          position: { right: right + 'px', top: top + 'px' },
          data: { tellerFunction, format  },
          // hasBackdrop: false,
          scrollStrategy: this.overlay.scrollStrategies.noop(),
        });
      }
    }
  }

  public resetStore() {
    this.chartService.forceReload = true;
    this.chartService.onResetStore();
    this.storageService.reset();
    this.chartService.forceReload = false;
  }

  disable() {
    return !this.functionSettingComponent.funcFormGroup.valid;
  }

  disableClear() {
    return this.disable() || !this.chartService.chartData[INDEX_TX_DRAW].active;
  }

  disableResetStore() {
    return !(this.storageService.store.length > 0);
  }


  public draw(element) {
    const tellerPointID: number = +element.id - 1;
    this.chartService.chartData[INDEX_TX_DRAW].tellerPoint = tellerPointID;
    this.chartService.changeChartData(INDEX_TX_DRAW, 'active', true);
  }

  public drawEpsilon(element) {
    const tellerPointID: number = +element.id - 1;
    this.chartService.chartData[INDEX_EPSILON_TX_DRAW].tellerPoint = tellerPointID;
    this.chartService.changeChartData(INDEX_EPSILON_TX_DRAW, 'active', true);
  }

  public clear(element) {
    const tellerPointID: number = +element.id - 1;
    this.chartService.chartData[INDEX_TX_DRAW].tellerPoint = tellerPointID;
    this.chartService.changeChartData(INDEX_TX_DRAW, 'active', false);
    this.clearEpsilon(element);
  }

  public clearEpsilon(element) {
    const tellerPointID: number = +element.id - 1;
    this.chartService.chartData[INDEX_EPSILON_TX_DRAW].tellerPoint = tellerPointID;
    this.chartService.changeChartData(INDEX_EPSILON_TX_DRAW, 'active', false);
  }


  private getPointsDataFromStore(): PointsData[] {
    const pointsData: PointsData[] = [];
    const store: TellerParam[] = this.storageService.store;

    store.forEach( (value, index) => {
      const betaValues: string[] = [];
      value.beta.forEach( (betaVal) => {
        betaValues.push(betaVal.toString());
      });
      const data = {
        id: (index + 1).toString(),
        x: value.point.x.toString(),
        y: value.point.y.toString(),
        alpha: value.alpha.toString(),
        beta: betaValues,
      };
      pointsData.push(data);
    });
    return pointsData;
  }


  isParam(columnDef) {
    return (columnDef === 'alpha') || (columnDef.includes('beta-'));
  }

  isSticky(columnDef) {
    return !this.isParam(columnDef) && !(columnDef === 'y');
  }

  getColumns() {
    const paramsColumns: any[] = [
      { columnDef: 'alpha',   header: '$$\\alpha$$', cell: (element: any) => `${element.alpha}`}
    ];
    for (let i = 1; i <= this.storageService.betaMax; i++) {
      paramsColumns.push(
        {
          columnDef: 'beta-' + i.toString(),
          header: '$$\\beta_' + i.toString() + '$$',
          cell: (element: any) => `${element.beta[i - 1]}`
        }
      );
    }
    const columns = [
      { columnDef: 'x',     header: '$$x$$',   cell: (element: any) => `${element.x}`     },
      { columnDef: 'y',   header: '$$y$$', cell: (element: any) => `${element.y}`   }
    ];
    if (this.paramOnly) { return paramsColumns; }
    if (this.coordinateOnly) { return columns; }
    return columns.concat(paramsColumns);
  }

  getDisplayedColumns() {
    if (this.paramOnly) { return this.getColumns().map(c => c.columnDef); }
    const columns = ['id', 'draw', 'actions'];
    return columns.concat(this.getColumns().map(c => c.columnDef));
  }

  delete(item) {
    this.clear(item);
    this.chartService.forceReload = true;
    this.storageService.delete(new Point(+item.x, +item.y));
    this.chartService.forceReload = false;
  }

  private changeParamValue(item, header: string, value: number) {
    item.id = +item.id;
    item.x = +item.x;
    item.y = +item.y;
    item.alpha = +item.alpha;
    for (let i = 0; i < this.storageService.store[item.id - 1].beta.length; i++) {
      item.beta[i] = +item.beta[i];
    }

    if ( header === 'alpha') {
      item.alpha = +value;
    } else {
      const index = header.substring(header.length - 1, header.length);
      item.beta[+index - 1] = +value;
    }
    this.storageService.update(new Point(item.x, item.y), item.alpha, item.beta);

  }

  liveReloadOnChangeParamValue(item, header: string, value: number) {
    if (this.liveReload) {
      this.changeParamValue (item, header, value);
    }
  }

  forceReloadOnChangeParamValue(item, header: string, value: number) {
    this.chartService.forceReload = true;
    this.changeParamValue (item, header, value);
    this.chartService.forceReload = false;
  }

  onPaginateChange(event) {
    this.paginatorPageSize = event.pageIndex;
    this.paginatorPageSizeChanged.emit(event.pageSize);
  }

  constructor(
    private storageService: StorageService,
    private chartService: ChartService,
    private mathService: MathService,
    private elementRef: ElementRef,
    private overlay: Overlay,
    private dialog: MatDialog,
    ) {
    this.dataSource = new MatTableDataSource(this.getPointsDataFromStore());
    this.liveReload = this.chartService.liveReload;
  }

  private onStorageChanged() {
    this.dataSource.data = this.getPointsDataFromStore();
    this.mathjaxs.forEach(value => {
      if (value) {
        value.renderMath();
      }
    });
  }

  ngOnInit() {
    this.storageService.storageChanged.subscribe(state => {
        this.onStorageChanged();
    });
    this.chartService.liveReloadChanged.subscribe(state => {
      this.liveReload = state;
    });

  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}



export interface PointsData {
  id: string;
  x: string;
  y: string;
  alpha: string;
  beta: string [];
}
