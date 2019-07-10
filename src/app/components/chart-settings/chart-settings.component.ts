import { Component, OnInit, Input, AfterViewInit, ElementRef } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { FunctionSettingsComponent } from '../function-settings/function-settings.component';
import { FuncParam } from 'src/app/domains';
import { ChartService, INDEX_FX_DRAW, INDEX_POINT_DRAW,
  INDEX_VX_DRAW, INDEX_TX_DRAW, INDEX_GTX_DRAW, INDEX_EPSILON_GTX_DRAW,
  INDEX_EPSILON_TX_DRAW } from 'src/app/services/chart/chart.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Overlay } from '@angular/cdk/overlay';
import { FunctionTableDataPointsDialogComponent } from '../dialogs';
import { PointsSettingsComponent } from '../points-settings/points-settings.component';

@Component({
  selector: 'app-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.scss']
})
export class ChartSettingsComponent implements OnInit, AfterViewInit {



  displayDatastore: boolean = this.chartService.chartData[INDEX_POINT_DRAW].active;
  displayPointRadius: boolean = this.chartService.chartData[INDEX_FX_DRAW].displayPoint;
  liveReload: boolean = this.chartService.liveReload;

  activatedFx: boolean = this.activatedF() ;

  @Input()
  functionSettingsComponent: FunctionSettingsComponent;

  public vxParam: FuncParam = new FuncParam();
  vFormGroup: FormGroup ;

  get name() {
    return this.vFormGroup.get('name') as FormControl;
  }

  private getError(el) {
    switch (el) {
      case 'func':
        if (this.vFormGroup.get('func').hasError('required')) {
          return 'required';
        }
        if (this.vFormGroup.get('func').hasError('pattern')) {
          return 'Invalid maths function';
        }
        break;
      default:
        return '';
    }
  }

  public onSubmit(post) {
    this.chartService.vxParam = new FuncParam(
      post.func,
      this.functionSettingsComponent.funcFormGroup.value.xMin,
      this.functionSettingsComponent.funcFormGroup.value.xMax,
      this.functionSettingsComponent.funcFormGroup.value.step,
      this.functionSettingsComponent.funcFormGroup.value.deltaX,
      );
    this.chartService.changeChartData(INDEX_VX_DRAW, 'active' , true);
  }

  public clear() {
    this.chartService.vxParam = new FuncParam('');
    this.vFormGroup = this.functionSettingsComponent.buildFuncForm(this.vxParam);
    this.chartService.changeChartData(INDEX_VX_DRAW, 'active' , false);
  }

  disable() {
    return !this.vFormGroup.valid;
  }

  disableClear() {
    return this.disable() || !this.chartService.chartData[INDEX_VX_DRAW].active;
  }

  openFunctionTableDataPointsDialog(): void {
    if (this.vFormGroup.valid) {
      const bodyRect = document.body.getBoundingClientRect();
      const elemRect = this.functionSettingsComponent.elementRef.nativeElement.getBoundingClientRect();
      const width = elemRect.width + 30  ;
      const top = elemRect.top - 35 ;
      const left = elemRect.left - 15;
      const dialogRef = this.dialog.open(FunctionTableDataPointsDialogComponent, {
        panelClass: 'dialog',
        width: width + 'px',
        position: { left: left + 'px', top: top + 'px' },
        data: { param: this.vFormGroup.value},
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        // hasBackdrop: false,
      });
    }

  }


  onDisplayPointChange(event) {
    this.chartService.chartData[INDEX_TX_DRAW].displayPoint = this.displayPointRadius;
    this.chartService.chartData[INDEX_GTX_DRAW].displayPoint = this.displayPointRadius;
    this.chartService.chartData[INDEX_VX_DRAW].displayPoint = this.displayPointRadius;
    this.chartService.chartData[INDEX_EPSILON_GTX_DRAW].displayPoint = this.displayPointRadius;
    this.chartService.chartData[INDEX_EPSILON_TX_DRAW].displayPoint = this.displayPointRadius;
    this.chartService.changeChartData(INDEX_FX_DRAW, 'displayPoint', this.displayPointRadius);
  }

  onDisplayDatastoreChange(event) {
    this.chartService.changeChartData(INDEX_POINT_DRAW, 'active', this.displayDatastore);
  }

  onLiveReloadChange(event){
    this.chartService.changeLiveReload(this.liveReload);
  }

  activatedF() {
    return this.chartService.chartData[INDEX_FX_DRAW].active ||
    this.chartService.chartData[INDEX_TX_DRAW].active ||
    this.chartService.chartData[INDEX_GTX_DRAW].active ||
    this.chartService.chartData[INDEX_VX_DRAW].active ||
    this.chartService.chartData[INDEX_EPSILON_GTX_DRAW].active ||
    this.chartService.chartData[INDEX_EPSILON_TX_DRAW].active;
  }


  constructor(
    private chartService: ChartService,
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private overlay: Overlay,
  ) { }

  ngOnInit() {
    this.chartService.chartDataStateChanged.subscribe( state => {
      this.activatedFx = this.activatedF();
    });
    this.vFormGroup = this.functionSettingsComponent.buildFuncForm(this.vxParam);
  }

  ngAfterViewInit() {

  }

}
