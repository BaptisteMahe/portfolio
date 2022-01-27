import P5 from "p5";

import { Boid } from "./boid";
import { QuadTree } from "../quadtree/quadtree";
import { Rectangle } from "../quadtree/shapes/rectangle";

export class Flock {

  boids: Boid[];

  quadtree: QuadTree;

  constructor(private readonly p5: P5,
              private readonly startSize: number,
              private readonly maxSize: number) {
    this.boids = [];
    for (let index = 0; index < this.startSize; index++)
      this.boids.push(new Boid(p5, { x: p5.random(p5.width), y: p5.random(p5.height) }));

    this.quadtree = new QuadTree(new Rectangle(p5.width / 2, p5.height / 2, p5.width / 2, p5.height / 2), 5);
  }

  update() {
    this.quadtree.clear();
    for (let boid of this.boids) this.quadtree.insert({ x: boid.position.x, y: boid.position.y, data: boid });

    for (let boid of this.boids) {
      boid.edges();
      boid.flock(this.quadtree);
      boid.update();
      boid.show();
    }
  }

  add(boid: Boid) {
    if (this.boids.length == this.maxSize) this.boids.shift();
    this.boids.push(boid);
  }

  resizeTank(width: number, height: number) {
    this.quadtree.resize(new Rectangle(width / 2,
        height / 2,
        width / 2,
        height / 2));
  }

  size() {
    return this.boids.length;
  }
}
