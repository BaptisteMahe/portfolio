import { Point } from "../point";
import { Rectangle } from "./rectangle";
import { Shape } from "./shape";

export class Circle implements Shape {

  x: number;
  y: number;
  r: number;
  rSquared: number;

  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.rSquared = this.r * this.r;
  }

  contains(point: Point): boolean {
    let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
    return d <= this.rSquared;
  }

  intersects(range: Rectangle): boolean {
    let xDist = Math.abs(range.x - this.x);
    let yDist = Math.abs(range.y - this.y);

    let edges = Math.pow(xDist - range.w, 2) + Math.pow(yDist - range.h, 2);

    if (xDist > this.r + range.w || yDist > this.r + range.h) return false;
    if (xDist <= range.w || yDist <= range.h) return true;
    return edges <= this.rSquared;
  }
}
