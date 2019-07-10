
import {TellerParam} from './teller.param.model';


import {
  create, all
} from 'mathjs';
const math = create(all, {});


export class FuncParseEval {

  public parse;
  public eval;
  public format;
  public expression;
  public expressionFull;
  public simplify;

  constructor(
      private id: string,
      private func: string,
      public scope,

  ) {
    if (id && func) {
      this.expressionFull = id + ' = ' + func;
      this.parse = math.parse(func);
      this.eval = math.evaluate(this.expressionFull, scope);
      this.format = math.format(this.eval);
      this.expression = this.parse.toString();
      this.simplify = math.simplify(this.expression, scope, { exactFractions: false} )  ;
    }

  }
}

export function evalFx( fx: string, x: number): number | any {
  if (fx) {
    try {
      return math.round(
        math.evaluate(fx.toLowerCase(), {x}), 4);
    } catch (error) {
      return undefined;
    }
  }
  return undefined;
}


export function SumBuilder(elements: string[], scope): FuncParseEval[] {
    const result: FuncParseEval[] = [];
    elements.forEach((value, index) => {
      const id = 'e_' + index + '(x)';
      const b: FuncParseEval = new FuncParseEval( id, value, scope);
      result.push(b);
    });
    return result;
  }

export function SumEval(elements: FuncParseEval[], xVal: number) {

    const sumArray = [];
    elements.forEach(value => {
      sumArray.push(value.eval(xVal));
    });
    return math.sum(sumArray);
  }

export function SumExpression(elements: FuncParseEval[]) {
    const sumExprArray = [];
    elements.forEach(value => {
      sumExprArray.push(value.expression);
    });
    return sumExprArray.join('+');
  }

export function TellerExpression(index: number, xIndex: number, func: string, beta: number[]): TellerFunction {
    if ( !func ) {return null; }
    const scope = {};
    const scopeMathjax = {};
    const elements = [];
    const elementsMathjax = [];
    const funcReplace = func.replace(/x/g, 'x_' + index);
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
    const sumBuilder = SumBuilder(elements, scope);
    const sumExpr = SumExpression(sumBuilder);
    return {
      format: 'T(x)',
      expression: sumExpr,
      expressionMathjax: elementsMathjax.join('+'),
      scope,
      scopeMathjax,
    };
  }

export function GTellerExpression(store: TellerParam[], func: string): TellerFunction {
    if ( !func ) {return null; }
    let scope = {};
    let scopeMathjax = {};
    const elements = [];
    const elementsMathjax = [];
    for (let i = 0; i < store.length; i++) {
      const tellerFunction: TellerFunction = TellerExpression(i, store[i].point.x,
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
    const sumBuilder = SumBuilder(elements,scope);
    const sumExpr = SumExpression(sumBuilder);
    return {
      format: 'GT(x)',
      expression: sumExpr,
      expressionMathjax: elementsMathjax.join('+'),
      scope,
      scopeMathjax,
    };
  }


export interface TellerFunction {
  format: string;
  expression: string;
  expressionMathjax: string;
  scope;
  scopeMathjax;
}


