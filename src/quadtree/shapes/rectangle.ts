import { Point } from "../point";
import { Shape } from "./shape";

export class Rectangle implements Shape {

  constructor(public readonly x: number,
              public readonly y: number,
              public readonly w: number,
              public readonly h: number) { }

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
