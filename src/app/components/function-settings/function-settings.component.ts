import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FuncParam } from 'src/app/domains';
import { FormGroup, FormControl, FormBuilder, AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { ChartService, INDEX_FX_DRAW } from 'src/app/services/chart/chart.service';
import { MatDialog, MatSelect } from '@angular/material';
import { FunctionTableDataPointsDialogComponent } from '../dialogs';
import { Overlay } from '@angular/cdk/overlay';
import { ReplaySubject, Subject, Observable } from 'rxjs';
import { takeUntil, take, startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-function-settings',
  templateUrl: './function-settings.component.html',
  styleUrls: ['./function-settings.component.scss']
})
export class FunctionSettingsComponent implements OnInit {

  private xAxisMin = -1;
  private xAxisMax = 1;

  public funcs: string[] = [
    'exp(x)', 'cos(x)', 'sin(x)', 'x^2'
  ];
  filteredFuncs: string[] = this.funcs;

  public fxParam: FuncParam = new FuncParam('', this.xAxisMin, this.xAxisMax, 0.1, 0);

  funcFormGroup: FormGroup = this.buildFuncForm(this.fxParam);


  private isNewFunc(func): boolean {
    this.funcs.forEach(value => {
      if (value === func) {
        return false;
      }
    });
    return true;
  }


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

  validateFunction(control: AbstractControl): { [key: string]: boolean } | null {
    const InvalidFunctions = ['arc', 'cot', 'ln', 'csc'];
    if ( (control.value !== undefined) && !isNaN(control.value)) {
      for (const fn of InvalidFunctions) {
        if (control.value.toLowerCase().includes(fn)) {
          return { pattern : true };
        }
      }
    }
    return null;
  }

  buildFuncForm(fxParam: FuncParam = new FuncParam()): FormGroup {
    const funcPattern = '(?:[0-9-+*/^()x]|abs|e\^x|log|sec|sqrt|sign|exp|a?(?:sin|cos|tan)h?)+';
    const reg: RegExp = new RegExp(funcPattern);

    const funcCtrl: FormControl = new FormControl(fxParam.func, {
      validators: [Validators.required, Validators.pattern(reg), this.validateFunction]
    });
    funcCtrl.valueChanges.subscribe( (value: string) =>
      this.filteredFuncs = this._filter(value)
    );
    return this.formBuilder.group({
      xMin: new FormControl(fxParam.xMin, [Validators.required, this.validateRange('min', fxParam)]),
      xMax: new FormControl(fxParam.xMax, [Validators.required, this.validateRange('max', fxParam)]),
      step: new FormControl(fxParam.step, Validators.required),
      deltaX: new FormControl(fxParam.deltaX, [Validators.required]),
      func: funcCtrl
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.funcs.sort((one, two) => (one > two ? 1 : -1));
    if (value !== null || value !== '') {
      return this.funcs.filter(option => option.toLowerCase().includes(filterValue));
    }
    return this.funcs;
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
          return 'range';
        }
        break;
      case 'xMax':
        if (this.funcFormGroup.get('xMax').hasError('required')) {
          return 'required';
        }
        if (this.funcFormGroup.get('xMax').hasError('range')) {
          return 'range';
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
          return 'Ipattern';
        }
        break;
      default:
        return '';
    }
  }

  public onSubmit(post: FuncParam) {
    this.clear();
    this.chartService.changeFxParam(post);
    this.chartService.changeChartData(INDEX_FX_DRAW, 'active' , true);
    if (this.isNewFunc(post.func)) {
      this.funcs = [...this.funcs, post.func];
    }
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
