import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, AfterViewChecked {


  constructor(public translate: TranslateService) {
    const Languages = ['en', 'fr', 'ru'];
    const LanguagesReg = /en|fr|ru/;
    translate.addLangs(Languages);
    translate.setDefaultLang(Languages[0]);

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(LanguagesReg) ? browserLang : 'en');
  }
  ngOnInit() {
  }

  ngAfterViewChecked(): void {
  }


}
