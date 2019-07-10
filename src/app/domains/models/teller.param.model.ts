import {Point} from "./point.model";

export class TellerParam {
  public point: Point;
  public alpha: number = 1;
  public beta: number[] = [];

  constructor(point: Point = null,
              alpha: number = 1,
              beta: number[] = []
  ) {
    this.point = point;
    this.alpha = alpha;
    this.beta = beta;
  }

  from(param: TellerFormParam) {
    this.point = param.point;
    this.alpha =  param.alpha;
    this.beta = new Array<number>();
    for( let i= 0; i< param.maxBeta; i++){
      this.beta.push(param.initBeta);
    }
    return this;
  }

  toForm() {
    let param: TellerFormParam;
    param.point = this.point;
    param.alpha =  this.alpha;
    param.maxBeta = this.beta.length;
    param.initBeta = 0;
    return param;
  }

}

export class TellerFormParam {

  constructor(
    public point: Point = null,
    public alpha: number = 0,
    public maxBeta: number = 0,
    public initBeta: number = 0,
    public deltaX: number = 0.5,
    public step: number = 0.1,
  ) {
  }

  from(param: TellerParam): TellerFormParam {
    this.point = param.point;
    this.alpha =  param.alpha;
    this.maxBeta = param.beta.length;
    this.initBeta = 0;
    return this;
  }

  toParam(): TellerParam{
    const param: TellerParam = new TellerParam(new Point(0, 0));
    param.point = this.point;
    param.alpha =  this.alpha;
    param.beta = new Array<number>();
    for( let i= 0; i < this.maxBeta; i++){
      param.beta.push(this.initBeta);
    }
    return param;
  }

}

