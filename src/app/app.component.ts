import {Component} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'b-interpolate-teller';

  constructor(public translate: TranslateService) {
    const Languages = ['en', 'fr', 'ru'];
    const LanguagesReg = /en|fr|ru/;
    this.translate.addLangs(Languages);
    let index = 2;
    const browserLang = translate.getBrowserLang();
    if (browserLang.match(LanguagesReg)) {
      index = Languages.indexOf(browserLang);
    }
    this.translate.setDefaultLang(Languages[index]);
    this.translate.use(Languages[index]);
  }

}
