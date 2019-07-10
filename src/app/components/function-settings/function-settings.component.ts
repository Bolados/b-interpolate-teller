import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { FuncParam } from 'src/app/domains';
import { FormGroup, FormControl, FormBuilder, AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartComponent } from '../chart/chart.component';
import { ChartService, INDEX_FX_DRAW } from 'src/app/services/chart/chart.service';
import { MatDialog } from '@angular/material';
import { FunctionTableDataPointsDialogComponent } from '../dialogs';
import { Overlay } from '@angular/cdk/overlay';
import { PointsSettingsComponent } from '../points-settings/points-settings.component';

@Component({
  selector: 'app-function-settings',
  templateUrl: './function-settings.component.html',
  styleUrls: ['./function-settings.component.scss']
})
export class FunctionSettingsComponent implements OnInit {

  private xAxisMin = -5;
  private xAxisMax = 5;

  public fxParam: FuncParam = new FuncParam('sin(x)', this.xAxisMin, this. xAxisMax);

  funcFormGroup: FormGroup = this.buildFuncForm(this.fxParam);



  validateRange(kind: string, param: FuncParam): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        let error = false;

        if (control.value !== undefined && !isNaN(control.value)) {
          if (kind === 'min') {
            error = (control.value >= param.xMax);
          }
          if (kind === 'max') {
            error = (control.value <= param.xMin);
          }
        }
        if (error) { return { range : true }; }
        return null;
    };
  }

  buildFuncForm(fxParam: FuncParam = new FuncParam()): FormGroup {
    const funcPattern = '(?:[0-9-+*/^()x]|abs|e\^x|ln|log|a?(?:sin|cos|tan)h?)+';
    const reg: RegExp = new RegExp(funcPattern);
    return this.formBuilder.group({
      xMin: new FormControl(fxParam.xMin, [Validators.required, this.validateRange('min', fxParam)]),
      xMax: new FormControl(fxParam.xMax, [Validators.required, this.validateRange('max', fxParam)]),
      step: new FormControl(fxParam.step, Validators.required),
      deltaX: new FormControl(fxParam.deltaX, [Validators.required]),
      func: new FormControl(fxParam.func, [Validators.required, Validators.pattern(reg)]),
    });
  }

  get name() {
    return this.funcFormGroup.get('name') as FormControl;
  }

  private getError(el) {
    switch (el) {
      case 'xMin':
        if (this.funcFormGroup.get('xMin').hasError('required')) {
          return 'required';
        }
        if (this.funcFormGroup.get('xMin').hasError('range')) {
          return 'A greater B';
        }
        break;
      case 'xMax':
        if (this.funcFormGroup.get('xMax').hasError('required')) {
          return 'required';
        }
        if (this.funcFormGroup.get('xMax').hasError('range')) {
          return 'B least A';
        }
        break;

      case 'step':
        if (this.funcFormGroup.get('step').hasError('required')) {
          return 'required';
        }
        break;
      case 'deltaX':
          if (this.funcFormGroup.get('deltaX').hasError('required')) {
            return 'required';
          }
          break;
      case 'func':
        if (this.funcFormGroup.get('func').hasError('required')) {
          return 'required';
        }
        if (this.funcFormGroup.get('func').hasError('pattern')) {
          return 'Invalid maths function';
        }
        break;
      default:
        return '';
    }
  }

  public onSubmit(post: FuncParam) {
    this.chartService.fxParam = post;
    this.chartService.changeChartData(INDEX_FX_DRAW, 'active' , true);
  }

  public clear() {
    this.chartService.changeChartData(INDEX_FX_DRAW, 'active' , false);
  }

  public reset() {
    this.chartService.fxParam = new FuncParam('', this.xAxisMin, this. xAxisMax);
    this.funcFormGroup = this.buildFuncForm(this.chartService.fxParam);
    this.clear();
  }

  disable() {
    return !this.funcFormGroup.valid;
  }

  disableClear() {
    return this.disable() || !this.chartService.chartData[INDEX_FX_DRAW].active;
  }

  openFunctionTableDataPointsDialog(): void {
    if (this.funcFormGroup.valid) {
      const bodyRect = document.body.getBoundingClientRect();
      const elemRect = this.elementRef.nativeElement.getBoundingClientRect();
      const width = elemRect.width + 30  ;
      const top = elemRect.top - 35 ;
      const left = elemRect.left - 15;
      const dialogRef = this.dialog.open(FunctionTableDataPointsDialogComponent, {
        panelClass: 'dialog',
        width: width + 'px',
        position: { left: left + 'px', top: top + 'px' },
        data: { param: this.funcFormGroup.value},
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        // hasBackdrop: false,
      });
    }

  }


  constructor(
    private formBuilder: FormBuilder,
    private chartService: ChartService,
    private dialog: MatDialog,
    public elementRef: ElementRef,
    private overlay: Overlay,
  ) { }

  ngOnInit() {
  }

}
