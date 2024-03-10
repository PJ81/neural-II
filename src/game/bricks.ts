import { BRICK_HEI, BRICK_WID, WIDTH } from "../helpers/const.js";
import Point from "../helpers/point.js";
import Ball from "./ball.js";

class Brick {
  points: number;
  color: string;
  pos: Point;
  alive: boolean;

  constructor(x: number, y: number, pts: number, clr: string) {
    this.pos = new Point(x, y);
    this.color = clr;
    this.points = pts;
    this.alive = true;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.alive) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.pos.x, this.pos.y, BRICK_WID, BRICK_HEI);
      ctx.rect(this.pos.x, this.pos.y, BRICK_WID, BRICK_HEI);
    }
  }
}

export default class Bricks {

  bricks: Brick[];

  constructor() {
    this.bricks = [];
    const clrs = ["yellow", "green", "orange", "purple", "blue"];
    const cnt = WIDTH / BRICK_WID;
    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < cnt; i++) {
        const br = new Brick(i * BRICK_WID, j * BRICK_HEI, 100 - j * 15, clrs[j]);
        this.bricks.push(br);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    this.bricks.forEach(b => b.draw(ctx));
    ctx.stroke();
  }

  collide(x1: number, x2: number, y1: number, y2: number, pos: Point): boolean {
    return !(((y2 < pos.y) || (y1 > pos.y + BRICK_HEI) || (x2 < pos.x) || (x1 > pos.x + BRICK_WID)));
  }

  check(ball: Ball): any {
    const x1 = ball.pos.x - 1, x2 = ball.pos.x + 1, y1 = ball.pos.y - 1, y2 = ball.pos.y + 1;

    const brks = this.bricks.filter(f => f.alive);

    for (const brick of brks) {
      if (!this.collide(x1, x2, y1, y2, brick.pos)) continue;
      brick.alive = false;
      const dir = this.traceBack(ball, brick);
      return { pts: brick.points, y: brick.pos.y, dx: dir.x, dy: dir.y };
    }
    return null;
  }

  traceBack(ball: Ball, brk: Brick): Point {
    const bd = new Point(-ball.dir.x, -ball.dir.y);
    bd.normalize();

    let x1: number, x2: number, y1: number, y2: number;

    do {
      ball.pos.x += bd.x;
      ball.pos.y += bd.y;
      x1 = ball.pos.x - 1, x2 = ball.pos.x + 1, y1 = ball.pos.y - 1, y2 = ball.pos.y + 1;
    } while (this.collide(x1, x2, y1, y2, brk.pos))

    const ret = new Point(ball.dir.x, ball.dir.y);

    if (ball.pos.x < brk.pos.x || ball.pos.x >= brk.pos.x + BRICK_WID) {
      ret.x = -ret.x;
    }
    if (ball.pos.y < brk.pos.y || ball.pos.y >= brk.pos.y + BRICK_HEI) {
      ret.y = -ret.y;
    }

    ret.normalize();
    return ret;
  }
}