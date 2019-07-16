import { Component, OnInit, Input } from '@angular/core';
import { Point, TellerParam, TellerFormParam, FuncParam } from 'src/app/domains';
import { StorageService } from 'src/app/services';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ChartService } from 'src/app/services/chart/chart.service';
import { FunctionSettingsComponent } from '../function-settings/function-settings.component';


@Component({
  selector: 'app-points-settings',
  templateUrl: './points-settings.component.html',
  styleUrls: ['./points-settings.component.scss']
})
export class PointsSettingsComponent implements OnInit {

  @Input()
  functionSettingComponent: FunctionSettingsComponent;

  private liveReload: boolean;

  public tellerFormParam: TellerFormParam = new TellerFormParam(
      new Point(0, 0),
      0,
      this.storageService.betaMax,
      this.storageService.betaInit,
      this.storageService.deltaX,
      this.storageService.step,
    );

  public tellerFormGroup: FormGroup = this.buildTellerForm(this.tellerFormParam);

  public onSubmit(post) {
    let fx: string = null;
    if ( this.functionSettingComponent
      && this.functionSettingComponent.funcFormGroup.valid
      )
    {
      fx = this.functionSettingComponent.funcFormGroup.value.func;
    }
    const point = new Point(post.x, post.y);
    this.tellerFormParam = new TellerFormParam(point, post.alpha, post.maxBeta, post.initBeta, post.deltaX, post.step);
    this.chartService.forceReload = true;
    this.storageService.addTellerPoint(this.tellerFormParam.toParam(), fx);
    this.chartService.forceReload = false;
    this.resetFormAddPoint();
  }

  public resetFormAddPoint() {
    this.tellerFormGroup = this.buildTellerForm(this.tellerFormParam);
  }

  public onXChange(value) {
    // value = + value;
    // this.tellerFormParam.point.y  = this.fx (value);
  }

  public onLiveXChange(value: number) {
    if (this.liveReload) {
      this.onXChange( value );
    }
  }

  public onMaxBetaChange(value: number) {
    this.storageService.updatedBetaMax(+value);
  }

  public onLiveMaxBetaChange(value: number) {
    if (this.liveReload) {
      this.storageService.updatedBetaMax(+value);
    }
  }

  public onInitBetaChange(value: number) {
    this.storageService.updateBetaInit(+value);
  }

  public onLiveInitBetaChange(value: number) {
    if (this.liveReload) {
      this.storageService.updateBetaInit(+value);
    }
  }

  public onStepChange(value: number) {
    this.storageService.updateStep(+value);
  }

  public onLiveStepChange(value: number) {
    if (this.liveReload) {
      this.storageService.updateStep(+value);
    }
  }

  public onDeltaXChange(value: number) {
    this.storageService.updateDeltaX(+value);
  }

  public onLiveDeltaXChange(value: number) {
    if (this.liveReload) {
      this.storageService.updateDeltaX(+value);
    }
  }


  validatePoint(kind: string, param: TellerFormParam): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        let error = false;

        if (control.value !== undefined && !isNaN(control.value)) {
          if (kind === 'x') {
            error = this.storageService.exists(new Point(control.value, 0));
          }
          if (kind === 'y') {
            // error = this.storageService.exists(new Point(param.point.x,control.value));
          }
        }
        if (error) { return { point : true }; }
        return null;
    };
  }


  buildTellerForm(tellerFormParam: TellerFormParam): FormGroup {
    return this.formBuilder.group({
      x: new FormControl(tellerFormParam.point.x, [Validators.required, this.validatePoint('x', tellerFormParam)]),
      y: new FormControl(tellerFormParam.point.y, [Validators.required]),
      alpha: new FormControl(tellerFormParam.alpha, [Validators.required]),
      deltaX: new FormControl(tellerFormParam.deltaX, [Validators.required]),
      maxBeta: new FormControl(tellerFormParam.maxBeta, Validators.required),
      initBeta: new FormControl(tellerFormParam.initBeta, [Validators.required]),
      step: new FormControl(tellerFormParam.step, [Validators.required]),
    });
  }

  get name() {
    return this.tellerFormGroup.get('name') as FormControl;
  }

  private getError(el) {
    switch (el) {
      case 'x':
        if (this.tellerFormGroup.get('x').hasError('required')) {
          return 'required';
        }
        if (this.tellerFormGroup.get('x').hasError('point')) {
          return 'point';
        }
        break;
      case 'y':
        if (this.tellerFormGroup.get('y').hasError('required')) {
          return 'required';
        }
        if (this.tellerFormGroup.get('y').hasError('point')) {
          return 'point';
        }
        break;
      case 'step':
        if (this.tellerFormGroup.get('step').hasError('required')) {
          return 'required';
        }
        break;
      case 'alpha':
        if (this.tellerFormGroup.get('alpha').hasError('required')) {
          return 'required';
        }
        break;
      case 'deltaX':
          if (this.tellerFormGroup.get('deltaX').hasError('required')) {
            return 'required';
          }
          break;
      case 'maxBeta':
          if (this.tellerFormGroup.get('maxBeta').hasError('required')) {
            return 'required';
          }
          break;

      case 'initBeta':
            if (this.tellerFormGroup.get('initBeta').hasError('required')) {
              return 'required';
            }
            break;
      default:
        return '';
    }
  }


  constructor(
    private storageService: StorageService,
    private chartService: ChartService,
    private formBuilder: FormBuilder,
  ) {
    this.liveReload = this.chartService.liveReload;
  }

  ngOnInit() {
    this.chartService.liveReloadChanged.subscribe( state => {
      this.liveReload = state;
    });
    this.storageService.storageChanged.subscribe( store => {
      this.resetFormAddPoint();
    });
  }

}
