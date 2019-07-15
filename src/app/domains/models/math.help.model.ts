
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
      private math,

  ) {
    if (id && func) {
      this.expressionFull = id + ' = ' + func;
      this.parse = this.math.parse(func);
      this.eval = this.math.evaluate(this.expressionFull, scope);
      this.format = this.math.format(this.eval);
      this.expression = this.parse.toString();
      this.simplify = this.math.simplify(this.expression, scope, { exactFractions: false} )  ;
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


