import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {


  @Input() name: string = "B-INTERPOLATE-";
  @Input() sub: string = "TELLER";
  @Input() link: string = "/";

  highlight: boolean = false;
  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
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
