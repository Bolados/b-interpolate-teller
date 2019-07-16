import { Injectable} from '@angular/core';
import { GlobalService } from '../global/global.service';
import { FuncParseEval, TellerFunction } from 'src/app/domains/models/math.help.model';
import { TellerParam } from 'src/app/domains';

import * as mathjs from 'mathjs';


@Injectable({
  providedIn: 'root'
})
export class MathService {

  public math = this.getMaths();

  getMaths() {
    if (this.gs.math !== undefined) {
      return this.gs.math;
    }
    if (mathjs !== undefined) {
      return mathjs;
    }
    return null;
  }


  evalFx( fx: string, x: number): number | any {
    if (fx) {
      try {
        return this.math.round(
          this.math.evaluate(fx.toLowerCase(), {x}), 4);
      } catch (error) {
        return undefined;
      }
    }
    return undefined;
  }


  SumBuilder(elements: string[], scope): FuncParseEval[] {
      const result: FuncParseEval[] = [];
      elements.forEach((value, index) => {
        const id = 'e_' + index + '(x)';
        const b: FuncParseEval = new FuncParseEval( id, value, scope, this.math);
        result.push(b);
      });
      return result;
    }

  SumEval(elements: FuncParseEval[], xVal: number) {

      const sumArray = [];
      elements.forEach(value => {
        sumArray.push(value.eval(xVal));
      });
      return this.math.sum(sumArray);
    }

  SumExpression(elements: FuncParseEval[]) {
      const sumExprArray = [];
      elements.forEach(value => {
        sumExprArray.push(value.expression);
      });
      return sumExprArray.join('+');
    }

  TellerExpression(index: number, xIndex: number, func: string, beta: number[]): TellerFunction {
      if ( !func ) {return null; }
      const scope = {};
      const scopeMathjax = {};
      const elements = [];
      const elementsMathjax = [];
      const funcReplace = func.replace(/exp/g, 'z').replace(/x/g, 'x_' + index).replace(/z/g, 'exp');
      elements.push(funcReplace);
      elementsMathjax.push(funcReplace);
      for ( let j = 0; j < beta.length; j++) {
        const i = j + 1;
        const expr = '(b_' + i + '*(x-x_' + index + ')^k_' + i + ')';
        elements.push(expr);
        scope['b_' + i] = beta[j];
        scope['x_' + index] = xIndex;
        scope['k_' + i ] = i;
        const exprMathjax: string = '\\bigl(\\beta_' + i + '*(x-x_' + index + ')^{k_' + i + '}\\bigr)';
        elementsMathjax.push(exprMathjax);
        scopeMathjax['\\beta_' + i] = scope['b_' + i];
        scopeMathjax['x_' + index] = scope['x_' + index];
        scopeMathjax['{k_' + i + '}' ] = scope['k_' + i ];
      }
      const sumBuilder = this.SumBuilder(elements, scope);
      const sumExpr = this.SumExpression(sumBuilder);
      return {
        format: 'T(x)',
        expression: sumExpr,
        expressionMathjax: elementsMathjax.join('+'),
        scope,
        scopeMathjax,
      };
    }

  GTellerExpression(store: TellerParam[], func: string): TellerFunction {
      if ( !func ) {return null; }
      let scope = {};
      let scopeMathjax = {};
      const elements = [];
      const elementsMathjax = [];
      for (let i = 0; i < store.length; i++) {
        const tellerFunction: TellerFunction = this.TellerExpression(i, store[i].point.x,
          func, store[i].beta);
        if (tellerFunction) {
          const id = 't' + i + '()';
          const expr = '(a_' + i + '*(' + tellerFunction.expression + '))';
          elements.push(expr);
          const exprMathjax = '\\biggl(\\alpha_' + i + '\\star\\Bigl(' + tellerFunction.expressionMathjax + '\\Bigr)\\biggr)';
          elementsMathjax.push(exprMathjax);
          scope['a_' + i] = store[i].alpha;
          scope = {...scope, ...tellerFunction.scope};
          scopeMathjax['\\alpha_' + i] = scope['a_' + i];
          scopeMathjax = {...scopeMathjax, ...tellerFunction.scopeMathjax};
        }

      }
      const sumBuilder = this.SumBuilder(elements, scope);
      const sumExpr = this.SumExpression(sumBuilder);
      return {
        format: 'GT(x)',
        expression: sumExpr,
        expressionMathjax: elementsMathjax.join('+'),
        scope,
        scopeMathjax,
      };
    }

  constructor(
    private gs: GlobalService,
  ) {
  }
}


