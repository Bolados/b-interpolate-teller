import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {

  constructor() { }

  public math = this.nativeGlobal()['mathjs'] ;

  nativeGlobal() { return window }

}
