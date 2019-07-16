import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, AfterViewChecked {

  selectedLang: string = this.translate.currentLang;

  translateTo() {
    this.translate.use(this.selectedLang);
  }


  constructor(public translate: TranslateService) {
  }
  ngOnInit() {
  }

  ngAfterViewChecked(): void {
  }


}
