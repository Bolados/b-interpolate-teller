import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateModule, TranslateLoader,
  MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';

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
import { DialogsModule } from './components/dialogs';
import { MathjaxModule } from './components/mathjax';




// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
      return 'lang!';
  }
}

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
  ],
  imports: [
    BrowserModule,
    SharedModule,
    ChartsModule,
    DialogsModule,
    MathjaxModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      missingTranslationHandler: {provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler},
    })
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
