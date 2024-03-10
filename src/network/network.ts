import Layer from "./layer.js";

export default class Network {

  layers: Layer[];

  constructor(inputsCnt: number, layersCnt: number, neuronsCnt: number, outputsCnt: number) {

    this.layers = [];

    this.layers.push(new Layer(inputsCnt));

    for (let i = 0; i < layersCnt; i++) {
      this.layers.push(new Layer(neuronsCnt));
    }

    this.layers.push(new Layer(outputsCnt));

    for (let i = 1; i < this.layers.length; i++) {
      this.connectLayers(this.layers[i - 1], this.layers[i]);
    }
  }

  connectLayers(l0: Layer, l1: Layer): void {
    for (let i = 0; i < l0.neuronCount; i++) {
      for (let j = 0; j < l1.neuronCount; j++) {
        l0.neurons[i].createLink(l1.neurons[j]);
      }
    }
  }

  sendInputs(inputs: number[]): number[] {
    this.layers.forEach(l => l.reset());

    inputs.forEach((i, c) => this.layers[0].neurons[c].add(i));

    this.layers.forEach(l => l.forward());

    const ret: number[] = []
    this.layers[this.layers.length - 1].neurons.forEach(n => ret.push(n.input));

    return ret;
  }
}