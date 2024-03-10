import { HEIGHT, TWO_HALF_PI, WIDTH } from "../helpers/const.js";
import Network from "../network/network.js";
import Ball from "./ball.js";
import Bricks from "./bricks.js";
import Player from "./player.js";

export default class Pong {

  player: Player;
  ball: Ball;
  alive: boolean;
  bricksCnt: number;
  hits: number;
  score: number;
  color: string;
  fitness: number;
  bricks: Bricks;
  network: Network;

  constructor() {
    this.ball = new Ball();
    this.player = new Player();
    this.alive = true;
    this.bricksCnt = this.hits = this.score = this.fitness = 0;
    this.color = `hsl(${Math.random() * 360}, ${Math.random() * 40 + 60}%, ${Math.random() * 40 + 20}%)`;

    this.bricks = new Bricks();

    this.network = new Network(4, 2, 2, 2);
  }

  get distance() {
    const d = Math.abs(this.ball.pos.x - this.player.pos.x);
    return d < 0.001 ? 0.001 : d; // avoid division by zero
  }

  collidePlayer(): boolean {
    if (this.ball.pos.y >= (this.player.pos.y - 1)) {
      const dist = this.distance, distFactor = dist / this.player.halfWid;

      if (dist < this.player.halfWid + 1) {
        const relativeIntersectX = (Math.sign(this.ball.pos.x - this.player.pos.x) * distFactor);
        const a = TWO_HALF_PI + 1.0821 * relativeIntersectX;//FOURTH_PI

        this.ball.pos.y = this.player.pos.y - 2;
        this.ball.dir.set(Math.cos(a), Math.sin(a));
        const noise = .1 * (Math.random() * 2 - 1);
        this.ball.dir.x += noise;

        this.ball.dir.normalize();

        this.hits++;
        this.fitness += (1 / distFactor) * .75;
      }
    }
    return this.ball.pos.y < HEIGHT;
  }


  ballCorrection(): void {
    if (this.ball.pos.x + 2 >= WIDTH || this.ball.pos.x - 1 <= 0) {
      if (this.ball.dir.x > 0) this.ball.pos.x = WIDTH - 2;
      else this.ball.pos.x = 1;
      this.ball.dir.x = -this.ball.dir.x;
    }

    if (this.ball.pos.y - 1 <= 0) {
      this.ball.pos.y = 1;
      this.ball.dir.y = -this.ball.dir.y;

      /*this.ball.dir.x = -this.ball.dir.x;
      const noise = .1 * (Math.random() * 2 - 1);
      this.ball.dir.x += noise;
      this.ball.dir.normalize();*/
    }

    if (!this.collidePlayer() || this.hits > 75) {
      this.alive = false;
      this.fitness += this.hits * 100 + this.score;
      if (this.bricksCnt > 34) this.fitness += 200;
    }
  }

  update(dt: number): void {
    this.ball.update(dt);

    const obj = this.bricks.check(this.ball);

    if (obj !== null) {
      this.ball.dir.x = obj.dx;
      this.ball.dir.y = obj.dy;

      //this.ball.pos.y = obj.y + BRICK_HEI + 2;

      this.score += obj.pts;
      this.bricksCnt++;
    }

    this.ballCorrection();

    // inputs: ball X pos, bat X pos, ball X speed, dist from ball center to bat center
    // outputs: pad move direction, pad move speed
    const r = this.network.sendInputs([this.ball.pos.x, this.player.pos.x, this.ball.dir.x * this.ball.spd, this.distance]);

    this.player.update(dt, r);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.alive) return;

    this.bricks.draw(ctx);

    ctx.fillStyle = this.color;
    this.ball.draw(ctx);
    this.player.draw(ctx);
  }

  getDNA(): number[] {
    const dna: number[] = [];
    this.network.layers.forEach(l => {
      l.neurons.forEach(n => {
        n.links.forEach(k => {
          dna.push(k.weight);
        });
      });
    });

    return dna;
  }

  setDNA(dna: number[]): void {
    let u: number = 0;
    this.network.layers.forEach(l => {
      l.neurons.forEach(n => {
        n.links.forEach(k => {
          k.weight = dna[u++];
        });
      });
    });
  }
}