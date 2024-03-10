import Link from "./link.js";

export default class Neuron {

  links: Link[];
  input: number;
  bias: number;

  constructor() {
    this.links = [];
    this.bias = Math.random() * 2 - 1;
  }

  createLink(to: Neuron): void {
    this.links.push(new Link(to));
  }

  reset(): void {
    this.input = 0;
  }

  add(i: number): void {
    this.input += i;
  }

}