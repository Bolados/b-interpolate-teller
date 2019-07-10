import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';
import { FunctionTableDataPointsDialogComponent } from './function-table-data-points-dialog/function-table-data-points-dialog.component';
import { TellerFormuleDialogComponent } from './teller-formule-dialog/teller-formule-dialog.component';
import { MathjaxModule } from '../mathjax';

@NgModule({
  declarations: [
    TellerFormuleDialogComponent,
    FunctionTableDataPointsDialogComponent
  ],
  entryComponents: [
    TellerFormuleDialogComponent,
    FunctionTableDataPointsDialogComponent,
  ],
  imports: [
    FormsModule,
    SharedModule,
    MathjaxModule,
  ],
})
export class DialogsModule {}
