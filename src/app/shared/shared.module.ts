import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from './material.module';
import {library} from '@fortawesome/fontawesome-svg-core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  faAsterisk,
  faBars,
  faBook,
  faCaretDown,
  faCaretUp,
  faCheck,
  faCog,
  faEdit,
  faExclamationTriangle,
  faFilter,
  faLanguage,
  faLightbulb,
  faPaintBrush,
  faPlayCircle,
  faPlus,
  faPowerOff,
  faRocket,
  faSquare,
  faStream,
  faTasks,
  faTimes,
  faTrash,
  faUserCircle,
  faWindowMaximize
} from '@fortawesome/free-solid-svg-icons';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

library.add(
  faAsterisk,
  faBars,
  faUserCircle,
  faPowerOff,
  faCog,
  faRocket,
  faPlayCircle,
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faCaretUp,
  faCaretDown,
  faExclamationTriangle,
  faFilter,
  faTasks,
  faCheck,
  faSquare,
  faLanguage,
  faPaintBrush,
  faLightbulb,
  faWindowMaximize,
  faStream,
  faBook
);

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations: [
    // ControlMessagesComponent,
    // LoaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FontAwesomeModule,
    RouterModule,
    PerfectScrollbarModule,
    BrowserAnimationsModule,

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    // NgbModule,

  ],
  exports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FontAwesomeModule,
    RouterModule,
    PerfectScrollbarModule,
    BrowserAnimationsModule,



    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule
    // NgbModule,
    // NgxMasonryModule,

    // ControlMessagesComponent,
    // LoaderComponent

  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule {
}
