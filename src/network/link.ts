import Neuron from "./neuron.js";

export default class Link {

  weight: number;
  neronTo: Neuron;

  constructor(to: Neuron) {
    this.neronTo = to;
    this.weight = Math.random() * 2 - 1;
  }
}