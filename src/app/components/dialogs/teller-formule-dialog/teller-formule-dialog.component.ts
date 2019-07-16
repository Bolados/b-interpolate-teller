import { Component, OnInit, Inject, ViewChildren, QueryList,
  ViewContainerRef, ViewChild, TemplateRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TellerFunction, FuncParseEval } from 'src/app/domains/models/math.help.model';
import { MathjaxComponent } from '../../mathjax';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Subscription, fromEvent } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { take, filter } from 'rxjs/operators';
import { MathService } from 'src/app/services/math/math.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

interface ITab {
  id: number;
  name: string;
  mathjax: string;
  function: string;
  expression: string;
}

const Tabs: ITab[] = [
  {
    name: 'Simplify',
    id: 1,
    mathjax: '',
    function: '',
    expression: '',
  },
  {
    name: 'Expression',
    id: 2,
    mathjax: '',
    function: '',
    expression: '',
  },
  {
    name: 'Scope',
    id: 3,
    mathjax: '',
    function: '',
    expression: '',
  }
];

@Component({
  selector: 'app-teller-formule-dialog',
  templateUrl: './teller-formule-dialog.component.html',
  styleUrls: ['./teller-formule-dialog.component.scss']
})
export class TellerFormuleDialogComponent implements OnInit, OnDestroy {

  private date = new Date();
  private subscription : Subscription;
  private sub : Subscription;
  @ViewChildren('mathjaxs') mathjaxs: QueryList<MathjaxComponent>;

  @ViewChild('tabMenu', {static: true}) tabMenu: TemplateRef<any>;

  overlayRef: OverlayRef | null;

  public tellerFunction: TellerFunction;
  public showSimplify: boolean = false;
  private displayFormat: string;

  public tabs = Tabs;

  public currentTabIndex = 0;
  public currentTab: ITab = this.tabs[this.currentTabIndex];

  private addTabContents() {
    const builder = this.buildTeller();
    this.tabs[0].mathjax = builder.mathjax.simplify;
    this.tabs[1].mathjax = builder.mathjax.expression;
    this.tabs[2].mathjax = builder.mathjax.scope;
    this.tabs[0].expression = builder.expression.simplify;
    this.tabs[1].expression = builder.expression.expression;
    this.tabs[2].expression = builder.expression.scope;
    this.tabs[0].function = builder.function.simplify;
    this.tabs[1].function = builder.function.expression;
    this.tabs[2].function = builder.function.scope;
  }

  public buildTeller() {
    const teller = new FuncParseEval(this.tellerFunction.format,
      this.tellerFunction.expression, this.tellerFunction.scope, this.mathService.math);
    const simplify =  this.displayFormat + '=' + teller.simplify;
    const expression = this.displayFormat + '=' + this.tellerFunction.expressionMathjax;
    const scopeAlpha = [];
    const scopeBeta = [];
    const scopeK = [];
    const scopeX = [];
    const scopeAlphaMathjax = [];
    const scopeBetaMathjax = [];
    const scopeKMathjax = [];
    const scopeXMathjax = [];
    for (const key in this.tellerFunction.scopeMathjax) {
      if ( this.tellerFunction.scopeMathjax.hasOwnProperty(key) ) {
        if ( key.startsWith('\\alpha_') ) {
          scopeAlphaMathjax.push(key + '=' + this.tellerFunction.scopeMathjax[key]);
        }
        if ( key.startsWith('\\beta_') ) {
          scopeBetaMathjax.push(key + '=' + this.tellerFunction.scopeMathjax[key]);
        }
        if ( key.startsWith('{k_') ) {
          scopeKMathjax.push(key + '=' + this.tellerFunction.scopeMathjax[key]);
        }
        if ( key.startsWith('x_') ) {
          scopeXMathjax.push(key + '=' + this.tellerFunction.scopeMathjax[key]);
        }
      }
    }
    for (const key in this.tellerFunction.scope) {
      if ( this.tellerFunction.scope.hasOwnProperty(key) ) {
        if ( key.startsWith('a_') ) {
          scopeAlpha.push(key + '=' + this.tellerFunction.scope[key]);
        }
        if ( key.startsWith('b_') ) {
          scopeBeta.push(key + '=' + this.tellerFunction.scope[key]);
        }
        if ( key.startsWith('k_') ) {
          scopeK.push(key + '=' + this.tellerFunction.scope[key]);
        }
        if ( key.startsWith('x_') ) {
          scopeX.push(key + '=' + this.tellerFunction.scope[key]);
        }
      }
    }
    const scopeMathjax = scopeAlphaMathjax.concat(scopeXMathjax).concat(scopeBetaMathjax).concat(scopeKMathjax);
    const scope = scopeAlpha.concat(scopeX).concat(scopeBeta).concat(scopeK);
    return {
      mathjax: {
        simplify: this.buildMathjax(simplify) ,
        expression: this.buildMathjax(expression) ,
        scope: this.buildMathjax(scopeMathjax.join(';')),
      },
      expression: {
        simplify: teller.simplify ,
        expression: this.tellerFunction.expression,
        scope: scope.join(';'),
      },
      function: {
        simplify ,
        expression ,
        scope: scope.join(';'),
      }
    };

  }

  selectionChange(event) {
    this.currentTabIndex = event.index;
    this.currentTab = this.tabs[event.index];
    this.mathjaxs.forEach((value, index) => {
      if (value) {
        value.renderMath();
      }
    });
  }

  setCurrentTab(tab) {
    this.currentTab = tab;
  }

  trackByFunction(index, item) {
    return item ? item.id : undefined;
  }

  private buildMathjax(value: string) {
    return '$$ ' + value + '$$';
  }

  open({ x, y }: MouseEvent, tab) {
    this.close();
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    this.overlayRef.attach(new TemplatePortal(this.tabMenu, this.viewContainerRef, {
      $implicit: tab
    }));

    this.sub = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => {
          const clickTarget = event.target as HTMLElement;
          return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget);
        }),
        take(1)
      ).subscribe(() => this.close());

  }

  copy(tabProperty = null) {
    console.log(this.currentTab);
    if (!tabProperty) {
      tabProperty = 'function';
    }
    this.copyText(this.currentTab[tabProperty]);
    this.close();
  }

  close() {
    if ( this.sub) {
      this.sub.unsubscribe();
    }
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }


  /* To copy Text from Textbox */
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  /* To copy any Text */
  copyText(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  constructor(
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef,
    public mathService: MathService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    if ( data ) {
      this.tellerFunction = data.tellerFunction;
      this.displayFormat = data.format;
      this.addTabContents();
    }
  }

  ngOnInit() {
    this.subscription = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.date = new Date();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}
