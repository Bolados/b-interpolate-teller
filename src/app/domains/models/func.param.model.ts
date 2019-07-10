import {Point} from "./point.model";

export class FuncParam {
 

  constructor( 
      public func: string = "",
      public xMin: number = -1,
      public xMax: number = 1,
      public step: number = 0.1,
      public deltaX: number = 0.5,
      
  ) {  }

  
}