import P5 from "p5";

import { Rectangle } from "./shapes/rectangle";
import { Point } from "./point";
import { Shape } from "./shapes/shape";

export class QuadTree {

  points: Point[];

  northwest: QuadTree;
  northeast: QuadTree;
  southwest: QuadTree;
  southeast: QuadTree;
  divided: boolean;

  constructor(private boundary: Rectangle,
              private readonly capacity: number) {
    this.points = [];
    this.divided = false;
  }

  subdivide() {
    let nw = new Rectangle(this.boundary.x - this.boundary.w / 2,
        this.boundary.y + this.boundary.h / 2,
        this.boundary.w / 2, this.boundary.h /2);
    this.northwest = new QuadTree(nw, this.capacity);

    let ne = new Rectangle(this.boundary.x + this.boundary.w / 2,
        this.boundary.y + this.boundary.h / 2,
        this.boundary.w / 2, this.boundary.h /2);
    this.northeast = new QuadTree(ne, this.capacity);

    let sw = new Rectangle(this.boundary.x - this.boundary.w / 2,
        this.boundary.y - this.boundary.h / 2,
        this.boundary.w / 2, this.boundary.h /2);
    this.southwest = new QuadTree(sw, this.capacity);

    let se = new Rectangle(this.boundary.x + this.boundary.w / 2,
        this.boundary.y - this.boundary.h / 2,
        this.boundary.w / 2, this.boundary.h /2);
    this.southeast = new QuadTree(se, this.capacity);

    this.divided = true;
  }

  insert(point: Point): boolean {
    if (!this.boundary.contains(point)) return false;

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    } else {
      if (!this.divided) this.subdivide();

      if (this.northwest.insert(point)) return true;
      else if (this.northeast.insert(point)) return true;
      else if (this.southwest.insert(point)) return true;
      else if (this.southeast.insert(point)) return true;
    }
  }

  query(range: Shape, found?: Point[]): Point[] {
    if (!found) found = [];
    if (!range.intersects(this.boundary)) return;
    else {
      for (let point of this.points) if (range.contains(point)) found.push(point);

      if (this.divided) {
        this.northwest.query(range, found);
        this.northeast.query(range, found);
        this.southwest.query(range, found);
        this.southeast.query(range, found);
      }
    }
    return found;
  }

  resize(boundary: Rectangle) {
    this.boundary = boundary;
  }

  clear() {
    this.points = [];

    this.northwest = null;
    this.northeast = null;
    this.southwest = null;
    this.southeast = null;

    this.divided = false;
  }

  show(p5: P5) {
    p5.stroke(255);
    p5.noFill();
    p5.strokeWeight(1);
    p5.rectMode(p5.CENTER);
    p5.rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
    if (this.divided) {
      this.northwest.show(p5);
      this.northeast.show(p5);
      this.southwest.show(p5);
      this.southeast.show(p5);
    }
  }
}
