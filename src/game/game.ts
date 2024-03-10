import { HEIGHT, SCALE, WIDTH } from "../helpers/const.js";

export default class Game {

  loop: (time?: number) => void;

  draw() {
    throw new Error("Method not implemented.");
  }

  update(dt: number) {
    throw new Error("Method not implemented.");
  }

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  lastTime: number;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = "main";
    this.canvas.style.imageRendering = "pixelated";
    this.canvas.width = WIDTH * SCALE;
    this.canvas.height = HEIGHT * SCALE;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(SCALE, SCALE);
    this.ctx.imageSmoothingEnabled = false;

    document.body.appendChild(this.canvas);

    this.lastTime = 0;

    this.loop = (time = 0) => {
      this.update(Math.min((time - this.lastTime) / 1000, .25));
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.draw();
      this.lastTime = time;
      requestAnimationFrame(this.loop);
    }
  }
}