import Pong from "../game/pong.js";
import { AGENTS_COUNT, AGENTS_RAND, BOT_AGENTS, MUTATION_RATE, TOP_AGENTS } from "../helpers/const.js";
import Results from "../helpers/results.js";

export default class Generation {

  ctx: CanvasRenderingContext2D;
  population: Pong[];
  generationCnt: number;
  results: Results;

  constructor(ctx: CanvasRenderingContext2D) {
    this.generationCnt = 1;
    this.ctx = ctx;
    this.results = new Results();

    this.population = [];
    for (let z = 0; z < AGENTS_COUNT; z++) {
      this.population.push(new Pong());
    }
  }

  createPool(): Pong[] {
    const pool: Pong[] = [];

    let sum = 0;
    this.population.forEach(a => sum += a.fitness);

    this.population.forEach(a => {
      a.fitness /= sum;
      a.fitness *= 100;
    });

    let cnt: number;
    for (let top = 0; top < TOP_AGENTS; top++) {
      const g = this.population[top];
      cnt = ~~(g.fitness + 1.5) * 5;
      for (let s = 0; s < cnt; s++) {
        pool.push(g);
      }
    }

    const idx = this.population.length - 1;
    for (let bot = 0; bot < BOT_AGENTS; bot++) {
      const g = this.population[idx - bot];
      cnt = ~~(g.fitness + 1.5) * 3;
      for (let s = 0; s < cnt; s++) {
        pool.push(g);
      }
    }

    pool.sort(() => { return Math.random() * 2 - 1 });

    return this.mating(pool);
  }

  mating(pool: Pong[]): Pong[] {
    const limit = AGENTS_COUNT - AGENTS_RAND;
    let p: Pong;
    const r: Pong[] = [];

    for (let x = 0; x < AGENTS_COUNT; x++) {
      p = new Pong();

      if (x < limit && pool.length >= limit) {
        const i1 = ~~(Math.random() * pool.length), i2 = ~~(Math.random() * pool.length);
        p.setDNA(this.crossOver(pool[i1], pool[i2]));
      }

      r.push(p);
    }

    return r;
  }

  crossOver(p1: Pong, p2: Pong): number[] {
    const vc: number[] = [],
      va = p1.getDNA(), vb = p2.getDNA();

    for (let x = 0; x < va.length; x++) {
      if (Math.random() < .5) {
        vc.push(va[x]);
      } else {
        vc.push(vb[x]);
      }
    }

    return this.mutate(vc);
  }

  mutate(vc: number[]): number[] {
    for (let x = 0; x < vc.length; x++) {
      if (Math.random() < MUTATION_RATE) {
        vc[x] = Math.random() * 2 - 1;
      }
    }
    return vc;
  }

  update(dt: number): void {
    const pongs = this.population.filter(p => p.alive);
    if (pongs.length < 1) {

      this.population.sort((a, b) => { return b.fitness - a.fitness });
      this.calcStats();

      this.generationCnt++;
      this.population = [...this.createPool()];
      return;
    }
    pongs.forEach(p => p.update(dt));
  }

  draw(): void {
    this.population.forEach(p => p.draw(this.ctx));
    this.ctx.fillStyle = "white";
    this.ctx.font = "3px Arial";
    this.ctx.shadowColor = "black";
    this.ctx.shadowOffsetX = this.ctx.shadowOffsetY = 2;
    this.ctx.fillText(`Generation: ${this.generationCnt}`, 1, 3);
    this.ctx.shadowColor = "#00000000";
  }

  calcStats(): void {
    let mid = 0;
    this.population.forEach(p => mid += p.fitness);
    mid /= this.population.length;

    this.results.saveResults(this.population[0], this.generationCnt, mid);

    this.results.displayResults();
  }
}