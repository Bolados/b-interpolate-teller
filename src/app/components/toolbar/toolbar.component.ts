import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, AfterViewChecked {


  private lastExcecution = new Date();
  // @ViewChild(MatToolbar) private matToolbar: MatToolbar;
  // @ViewChild(LogoComponent) private logoComponent?: LogoComponent;

  constructor(private el: ElementRef,
              private changeDetectorRef: ChangeDetectorRef) {
  }


  // getBoundary() {
  //     return this.matToolbar._elementRef.nativeElement.getBoundingClientRect();
  // }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    this.lastExcecution = new Date();
    this.changeDetectorRef.detectChanges();
  }


}
