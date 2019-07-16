import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {


  @Input() link = '/';

  public highlight = false;

  constructor(translateService: TranslateService) {
  }

  open() {

  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.highlight = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.highlight = false;
  }

  ngOnInit() {
  }

}
