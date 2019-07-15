import {EventEmitter, Injectable, Output, OnInit} from '@angular/core';
import {TellerParam, TellerFormParam} from '../../domains/models/teller.param.model';
import {Point} from '../../domains/models/point.model';
import { MathService } from '../math/math.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  @Output() storageChanged: EventEmitter<Array<TellerParam>> = new EventEmitter();
  // @Output() betaMaxChanged: EventEmitter<number> = new EventEmitter();
  // @Output() betaInitChanged: EventEmitter<number> = new EventEmitter();


  public store: TellerParam[] = [];
  public betaMax = 2;
  public betaInit = 0;
  public step = 0.1;
  public deltaX = 0.5;

  constructor(private mathService: MathService) {
    this.initStore();
  }

  reset() {
    this.initStore();
    this.storageChanged.emit();
  }


  private initStore() {
    this.store = [];
    // this.addTellerPoint(new TellerParam(new Point(-5, 3)));
    // this.addTellerPoint(new TellerParam(new Point(-2, -2)));
    // this.addTellerPoint(new TellerParam(new Point(1, 1)));
    // this.addTellerPoint(new TellerParam(new Point(4, 3)));
    // this.addTellerPoint(new TellerParam(new Point(5, -3)));
  }


  getStoreCoordinates() {
    const data: any[] = [];
    this.store.forEach(value => {
      data.push(
        {
          x: value.point.x,
          y: value.point.y
        }
      );
    });
    return data;
  }

  private sort() {
    this.store.sort((a, b) =>  0 - (a.point.x > b.point.x ? -1 : 1));
  }

  exists(point: Point): boolean {
    return this.store.filter((value: TellerParam) => (value.point.x === point.x)).length > 0;
  }


  addTellerPoint(param: TellerParam, fx: string) {
    if ( (param === null) || (this.exists(param.point))) {
      return;
    }
    if (param.beta.length !== this.betaMax) {
      this.updatedBetaMax(param.beta.length);
    }
    param.point.y = this.mathService.evalFx(fx, param.point.x);
    if (param.point.y === undefined) {
      param.point.y = 0;
    }
    this.store.push(param);
    this.sort();
    this.storageChanged.emit(this.store);
  }


  updateBetaInit(betaInit: number) {
    this.betaInit = betaInit;
  }

  updateStep(value: number) {
    this.step = value;
    this.storageChanged.emit(this.store);
  }

  updateDeltaX(value: number) {
    this.deltaX = value;
    this.storageChanged.emit(this.store);
  }


  updatedBetaMax(betaMax: number) {
    betaMax = +betaMax;
    this.store.forEach(value => {
      if (this.betaMax > betaMax) {
        value.beta.splice(betaMax - 1, this.betaMax - betaMax);
      }
      if (this.betaMax <= betaMax) {
        for (let i = this.betaMax ; i < betaMax  ; i++) {
          value.beta.push(this.betaInit);
        }
      }
    });
    this.betaMax = betaMax;
    this.storageChanged.emit(this.store);
  }


  update(point: Point, alpha: number = 1, beta: number[] = []) {
    const index = this.findIndex(point);
    if (index !== -1) {
      this.store[index].alpha = +alpha;
      this.store[index].beta = beta;
      this.sort();
      this.storageChanged.emit(this.store);
    }
  }


  delete(point: Point) {
    const index = this.findIndex(point);
    if (index === -1) {
      return;
    }
    this.store.splice(index, 1);
    this.sort();
    this.storageChanged.emit(this.store);
  }


  findIndex(point: Point): number {
    for (let index = 0; index < this.store.length; index++) {
      const value = this.store[index];
      if ( (value.point.x === point.x) && (value.point.y === point.y)) {
        return index;
      }
    }
    return -1;
  }
}
