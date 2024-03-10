import Pong from "../game/pong.js";

class Result {
  gen: number;
  hits: number;
  fitness: number;
  mid: number;
  bestOverall: number;
  dna: number[];


  constructor(pong: Pong, gen: number, mid: number, best: number) {
    this.gen = gen;
    this.hits = pong.hits;
    this.fitness = pong.fitness;
    this.mid = mid;
    this.bestOverall = best;
    //r.dna = pong.getDNA();
  }
}

export default class Results {

  results: Result[];
  bestOverall: number;

  constructor() {
    this.results = [];
    this.bestOverall = 0;
  }

  saveResults(pong: Pong, gen: number, mid: number): void {
    if (this.bestOverall < pong.fitness) {
      this.bestOverall = pong.fitness;
      //this.downloadData(pong.getDNA(), `bestGen_${gen}`);
    }

    this.results.push(new Result(pong, gen, mid, this.bestOverall));
  }

  displayResults(): void {
    console.table(this.results);
  }

  downloadData(exportObj: number[], exportName: string) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

}

