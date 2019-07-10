import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LogoComponent, ToolbarComponent} from './components';
import {DashboardLayoutComponent} from './layouts/dashboard-layout/dashboard-layout.component';
import {SharedModule} from './shared';
import { ChartsModule } from 'ng2-charts';
import { TableDataPointsComponent } from './components/table-data-points/table-data-points.component';
import { FunctionSettingsComponent } from './components/function-settings/function-settings.component';
import { PointsSettingsComponent } from './components/points-settings/points-settings.component';
import { GTellerSettingsComponent } from './components/g-teller-settings/g-teller-settings.component';
import { GlobalSettingsComponent } from './components/global-settings/global-settings.component';
import { ChartComponent } from './components/chart/chart.component';
import { ChartSettingsComponent } from './components/chart-settings/chart-settings.component';
import { GlobalService } from './services/global/global.service';
import { MathjaxComponent } from './components/mathjax/mathjax.component';
import { FunctionTableDataPointsDialogComponent, TellerFormuleDialogComponent, DialogsModule } from './components/dialogs';
import { MathjaxModule } from './components/mathjax';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LogoComponent,
    DashboardLayoutComponent,
    TableDataPointsComponent,
    FunctionSettingsComponent,
    PointsSettingsComponent,
    GTellerSettingsComponent,
    GlobalSettingsComponent,
    ChartComponent,
    ChartSettingsComponent,
    // MathjaxComponent,
    // FunctionTableDataPointsDialogComponent,
    // TellerFormuleDialogComponent,
  ],
  // entryComponents: [
  //   TellerFormuleDialogComponent,
  //   FunctionTableDataPointsDialogComponent,
  // ],
  imports: [
    BrowserModule,
    SharedModule,
    ChartsModule,
    DialogsModule,
    MathjaxModule,
    AppRoutingModule
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
