import { HEIGHT, TILE_SIZE, WIDTH } from "../helpers/const.js";
import Point from "../helpers/point.js";

export default class Ball {

  pos: Point;
  dir: Point;
  spd: number;

  constructor() {
    this.pos = new Point(WIDTH >> 1, HEIGHT >> 1);

    const ang = 1.57079632679 - Math.random() * 1.04719755119,
      vx = Math.random() < .5 ? Math.cos(ang) : -Math.cos(ang),
      vy = Math.sin(ang);

    this.dir = new Point(vx, vy);
    this.spd = Math.random() * 71 + 30;
  }

  update(dt: number): void {
    this.pos.x += this.dir.x * dt * this.spd;
    this.pos.y += this.dir.y * dt * this.spd;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(this.pos.x - 1, this.pos.y - 1, TILE_SIZE, TILE_SIZE);
  }
}