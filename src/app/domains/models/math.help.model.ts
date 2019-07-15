
import { MathService } from 'src/app/services/math/math.service';


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
      private mathService: MathService,

  ) {
    if (id && func) {
      this.expressionFull = id + ' = ' + func;
      this.parse = this.mathService.math.parse(func);
      this.eval = this.mathService.math.evaluate(this.expressionFull, scope);
      this.format = this.mathService.math.format(this.eval);
      this.expression = this.parse.toString();
      this.simplify = this.mathService.math.simplify(this.expression, scope, { exactFractions: false} )  ;
    }

  }
}

export interface TellerFunction {
  format: string;
  expression: string;
  expressionMathjax: string;
  scope;
  scopeMathjax;
}


