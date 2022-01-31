import P5 from "p5";

import { Circle } from "../quadtree/shapes/circle";
import { QuadTree } from "../quadtree/quadtree";
import { Point } from "../quadtree/point";

export class Boid {

  position: P5.Vector;
  velocity: P5.Vector;
  acceleration: P5.Vector;

  alignRadius: number;
  cohesionRadius: number;
  separationRadius: number;

  alignCoef: number;
  cohesionCoef: number;
  separationCoef: number;

  maxSpeed: number;
  maxForce: number;
  size: number;

  color: {
    stroke: number[],
    fill: number[]
  }

  constructor(private p5: P5,
              position: { x: number, y: number }) {
    this.position =  this.p5.createVector(position.x, position.y);
    this.velocity = P5.Vector.random2D();
    this.velocity.setMag(this.p5.random(2, 4));
    this.acceleration = this.p5.createVector();

    this.alignRadius = 100;
    this.cohesionRadius = 50;
    this.separationRadius = 30;

    this.alignCoef = 1;
    this.cohesionCoef = 1;
    this.separationCoef = 1.5;

    this.maxSpeed = 2;
    this.maxForce = 0.05;

    this.size = 15;

    this.color = {
      stroke: [100],
      fill: [50]
    };
  }

  edges() {
    if (this.position.x > this.p5.width) this.position.x = 0;
    else if (this.position.x < 0) this.position.x = this.p5.width;

    if (this.position.y > this.p5.height) this.position.y = 0;
    else if (this.position.y < 0) this.position.y = this.p5.height;
  }

  baseSteeringCompute(quadtree: QuadTree, radius: number,
                      onOtherFound: (other: Point, steering: P5.Vector) => void,
                      onAfterCompute?: (steering: P5.Vector) => void): P5.Vector {
    let steering = this.p5.createVector();
    let flockMates = quadtree.query(new Circle(this.position.x, this.position.y, radius)) || [];

    for (let other of flockMates) {
      if (other.data === this) continue;
      onOtherFound(other, steering);
    }

    if (flockMates?.length - 1 > 0) {
      steering.div(flockMates.length - 1);
      if (onAfterCompute) onAfterCompute(steering);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }

    return steering;
  }

  align(quadtree: QuadTree): P5.Vector {
    return this.baseSteeringCompute(quadtree, this.alignRadius,
        (other, steering) => steering.add(other.data.velocity));
  }

  cohesion(quadtree: QuadTree): P5.Vector {
    return this.baseSteeringCompute(quadtree, this.cohesionRadius,
        (other, steering) => steering.add(other.data.position),
        (steering) => steering.sub(this.position));
  }

  separation(quadtree: QuadTree): P5.Vector {
    return this.baseSteeringCompute(quadtree, this.separationRadius,
        (other, steering) => {
          let distance = this.p5.dist(this.position.x,
              this.position.y,
              other.data.position.x,
              other.data.position.y);
          let diff = P5.Vector.sub(this.position, other.data.position);
          diff.div(distance);
          steering.add(diff);
        });
  }

  flock(quadtree: QuadTree,
        alignCoef = this.alignCoef,
        cohesionCoef = this.cohesionCoef,
        separationCoef = this.separationCoef,
        alignRadius = this.alignRadius,
        cohesionRadius = this.cohesionRadius,
        separationRadius = this.separationRadius,
        maxSpeed = this.maxSpeed,
        maxForce =  this.maxForce) {

    this.alignRadius = alignRadius;
    this.cohesionRadius = cohesionRadius;
    this.separationRadius = separationRadius;
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;

    let alignment = this.align(quadtree);
    let cohesion = this.cohesion(quadtree);
    let separation = this.separation(quadtree);

    alignment.mult(alignCoef);
    cohesion.mult(cohesionCoef);
    separation.mult(separationCoef);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show(showRadius = false) {
    const forward = this.velocity.copy();
    forward.setMag(this.size);
    const left = forward.copy().rotate(2 * this.p5.PI / 3);
    left.setMag(this.size / 2);
    const right = forward.copy().rotate(- 2 * this.p5.PI / 3);
    right.setMag(this.size / 2);

    this.p5.strokeWeight(2);
    this.p5.stroke(this.color.stroke);
    this.p5.fill(this.color.fill);
    this.p5.triangle(this.position.x + forward.x,
        this.position.y + forward.y,
        this.position.x + left.x,
        this.position.y + left.y,
        this.position.x + right.x,
        this.position.y + right.y);

    if (showRadius) {
      this.p5.strokeWeight(1);
      this.p5.stroke(0, 0, 255);
      this.p5.noFill();
      this.p5.circle(this.position.x, this.position.y, this.alignRadius);
      this.p5.stroke(0, 255, 0);
      this.p5.circle(this.position.x, this.position.y, this.cohesionRadius);
      this.p5.stroke(255, 0, 0);
      this.p5.circle(this.position.x, this.position.y, this.separationRadius);
    }
  }
}
