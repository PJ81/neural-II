export default class Point {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.set(x, y);
  }

  add(x: number = 0, y: number = 0): Point {
    return new Point(this.x + x, this.y + y);
  }

  sub(x: number = 0, y: number = 0): Point {
    return new Point(this.x - x, this.y - y);
  }

  addPt(p: Point): Point {
    return new Point(this.x + p.x, this.y + p.y);
  }

  subPt(p: Point): Point {
    return new Point(this.x - p.x, this.y - p.y);
  }

  mul(m: number): Point {
    return new Point(this.x * m, this.y * m);
  }

  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  setPt(pt: Point): void {
    this.set(pt.x, pt.y);
  }

  equals(pt: Point): boolean {
    return pt.x === this.x && pt.y === this.y;
  }

  lenSqrt(): number {
    return this.x * this.x + this.y * this.y;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const len = this.length();
    if (len > 0) {
      this.x /= len;
      this.y /= len;
    }
  }

  rotate(a: number) {
    const cos = Math.cos(a),
      sin = Math.sin(a);
    this.set(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  clamp(min: number, max: number) {
    this.x = Math.min(Math.max(this.x, min), max);
    this.y = Math.min(Math.max(this.y, min), max);
  }

  dist(pt: Point): number {
    return Math.hypot(pt.x - this.x, pt.y - this.y);
  }

  distSqr(pt: Point): number {
    let a = pt.x - this.x,
      b = pt.y - this.y;
    return (a * a + b * b);
  }

  copy(): Point {
    return new Point(this.x, this.y);
  }

  heading(pt: Point): Point {
    const h = new Point(pt.x - this.x, pt.y - this.y);
    h.normalize();
    return h;
  }

  angle(pt: Point): number {
    let a = Math.atan2(pt.y - this.y, pt.x - this.x);
    if (a < 0) a += Math.PI;
    return a;
  }
}