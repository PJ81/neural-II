import { HEIGHT, PAD_W, SPEED, TILE_SIZE, WIDTH } from "../helpers/const.js";
import Point from "../helpers/point.js";

export default class Player {

  pos: Point;
  dx: number;
  halfWid: number;

  constructor() {
    this.halfWid = (PAD_W >> 1);
    this.pos = new Point((WIDTH >> 1), HEIGHT - TILE_SIZE);
    this.dx = 0;
  }

  update(dt: number, r: number[]): void {

    this.pos.x += dt * r[0] * Math.abs(r[1] * SPEED);

    if (this.pos.x >= WIDTH - this.halfWid - 1) {
      this.pos.x = WIDTH - this.halfWid - 1;
    } else if (this.pos.x < this.halfWid) {
      this.pos.x = this.halfWid;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(this.pos.x - this.halfWid, this.pos.y, PAD_W, TILE_SIZE);
  }
}