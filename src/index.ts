import Game from "./game/game.js";
import Generation from "./generation/generation.js";

export default class Env extends Game {

  generation: Generation;

  constructor() {
    super();
    this.generation = new Generation(this.ctx);

    this.loop();
  }

  update(dt: number): void {
    this.generation.update(dt);
  }

  draw(): void {
    this.generation.draw();
  }
}

const env = new Env();