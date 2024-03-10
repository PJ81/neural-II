import Neuron from "./neuron.js";

export default class Layer {

  neurons: Neuron[];

  constructor(neuronsCnt: number) {
    this.neurons = [];

    for (let i = 0; i < neuronsCnt; i++) {
      this.neurons.push(new Neuron());
    }
  }

  get neuronCount(): number {
    return this.neurons.length;
  }

  reset(): void {
    this.neurons.forEach(n => n.reset());
  }

  forward(): void {
    this.neurons.forEach(n => {
      n.links.forEach(l => {
        //const o = 1 / (1 + Math.E ** -(n.input * l.weight));
        const o = Math.tanh(n.input * l.weight);
        l.neronTo.add(o);
      });
    });
  }
}