import { Component, OnInit, Input, ElementRef } from '@angular/core';
import {Overlay} from '@angular/cdk/overlay';
import { ChartComponent } from '../chart/chart.component';
import { StorageService } from 'src/app/services';
import { FunctionSettingsComponent } from '../function-settings/function-settings.component';
import { ChartService, INDEX_GTX_DRAW, INDEX_EPSILON_GTX_DRAW } from 'src/app/services/chart/chart.service';
import { TellerFormuleDialogComponent } from '../dialogs';
import { MatDialog } from '@angular/material';
import { TellerFunction} from 'src/app/domains/models/math.help.model';
import { MathService } from 'src/app/services/math/math.service';

const FormuleGTeller = `$$ GT(x) = \\sum_{i=0}^n \\alpha_i * T_i(x_i)$$`
const FormuleTeller = `$$ T_i(x) = F(x_i) + \\sum_{k=1}^{\\beta_{max}} \\beta_k * (x-x_i)^k$$`

@Component({
  selector: 'app-g-teller-settings',
  templateUrl: './g-teller-settings.component.html',
  styleUrls: ['./g-teller-settings.component.scss']
})
export class GTellerSettingsComponent implements OnInit {

  formuleGTeller = FormuleGTeller;
  formuleTeller = FormuleTeller;

  @Input()
  functionSettingComponent: FunctionSettingsComponent;

  public seeGTellerExpression() {
    if (this.functionSettingComponent.funcFormGroup.valid) {
      const gTellerFunction: TellerFunction = this.mathService.GTellerExpression(this.storageService.store,
        this.functionSettingComponent.funcFormGroup.value.func);
      if (gTellerFunction) {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.elementRef.nativeElement.getBoundingClientRect();
        const top = bodyRect.top + 70 ;
        const right = bodyRect.right - elemRect.right;
        const dialogRef = this.dialog.open(TellerFormuleDialogComponent, {
          panelClass: 'dialog',
          width: '75%',
          // height,
          position: { right: right + 'px', top: top + 'px' },
          data: {
            tellerFunction: gTellerFunction,
            format: gTellerFunction.format,
          },
          // hasBackdrop: false,
          scrollStrategy: this.overlay.scrollStrategies.noop(),
        });
      }
    }
  }

  public draw() {
    this.chartService.changeChartData(INDEX_GTX_DRAW, 'active', true);
  }

  public drawEpsilon(){
    this.chartService.changeChartData(INDEX_EPSILON_GTX_DRAW, 'active', true);
  }

  public clear() {
    this.chartService.changeChartData(INDEX_GTX_DRAW, 'active', false);
    this.clearEpsilon();
  }

  public clearEpsilon() {
    this.chartService.changeChartData(INDEX_EPSILON_GTX_DRAW, 'active', false);
  }


  public disable() {
    return !(this.storageService.store.length > 0) ||  !this.functionSettingComponent.funcFormGroup.valid;
  }

  disableClear() {
    return this.disable() || !this.chartService.chartData[INDEX_GTX_DRAW].active;
  }

  constructor(
    private storageService: StorageService,
    private chartService: ChartService,
    private mathService: MathService,
    private elementRef: ElementRef,
    private overlay: Overlay,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

}
