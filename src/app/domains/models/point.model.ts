export class Point {
  public x: number;
  public y: number;

  constructor(x: number,
              y: number,
  ) {
    this.x = x;
    this.y = y;
  }

  getX(){
    return this.x;
  }

  getY(){
    return this.y;
  }

  equals(point: Point): boolean {
    return (this.x === point.x) && (this.y === point.y)
  }
}
