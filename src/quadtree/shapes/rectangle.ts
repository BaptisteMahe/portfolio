import { Point } from "../point";
import { Shape } from "./shape";

export class Rectangle implements Shape {

  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point: Point) {
    return point.x >= this.x - this.w
        && point.x <= this.x + this.w
        && point.y >= this.y - this.h
        && point.y <= this.y + this.h;
  }

  intersects(range: Rectangle) {
    return !(range.x - range.w > this.x + this.w
        || range.x + range.w < this.x - this.w
        || range.y - range.h > this.y + this.h
        || range.y + range.h < this.y - this.h);
  }
}
