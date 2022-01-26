import { Point } from "../point";
import { Rectangle } from "./rectangle";

export interface Shape {
  contains: (point: Point) => boolean;
  intersects: (range: Rectangle) => boolean;
}
