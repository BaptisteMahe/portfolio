import P5 from "p5";

import { Circle } from "../quadtree/shapes/circle";
import { QuadTree } from "../quadtree/quadtree";
import { Point } from "../quadtree/point";
import { FlockOptions } from "./flock";
import {
  DEFAULT_ALIGN_COEFFICIENT,
  DEFAULT_ALIGN_RADIUS,
  DEFAULT_COHESION_COEFFICIENT, DEFAULT_COHESION_RADIUS,
  DEFAULT_MAX_FORCE,
  DEFAULT_MAX_SPEED,
  DEFAULT_SEPARATION_COEFFICIENT, DEFAULT_SEPARATION_RADIUS
} from "./constant";

export class Boid {

  position: P5.Vector;
  velocity: P5.Vector;
  acceleration: P5.Vector;

  alignRadius: number;
  cohesionRadius: number;
  separationRadius: number;

  alignCoefficient: number;
  cohesionCoefficient: number;
  separationCoefficient: number;

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

    this.alignRadius = DEFAULT_ALIGN_RADIUS;
    this.cohesionRadius = DEFAULT_COHESION_RADIUS;
    this.separationRadius = DEFAULT_SEPARATION_RADIUS;

    this.alignCoefficient = DEFAULT_ALIGN_COEFFICIENT;
    this.cohesionCoefficient = DEFAULT_COHESION_COEFFICIENT;
    this.separationCoefficient = DEFAULT_SEPARATION_COEFFICIENT;

    this.maxSpeed = DEFAULT_MAX_SPEED;
    this.maxForce = DEFAULT_MAX_FORCE;

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

  flock(quadtree: QuadTree, options: FlockOptions) {

    this.maxSpeed = options.maxSpeed;
    this.maxForce = options.maxForce;

    this.alignRadius = options.alignRadius;
    let alignment = this.align(quadtree);
    alignment.mult(options.alignCoefficient);
    this.acceleration.add(alignment);

    this.cohesionRadius = options.cohesionRadius;
    let cohesion = this.cohesion(quadtree);
    cohesion.mult(options.cohesionCoefficient);
    this.acceleration.add(cohesion);

    this.separationRadius = options.separationRadius;
    let separation = this.separation(quadtree);
    separation.mult(options.separationCoefficient);
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
