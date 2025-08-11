class Color{
    constructor(r,g,b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    add(other) {
      return new Color(this.r + other.r, this.g + other.g, this.b + other.b);
    }

    multiply(other) {
      return new Color(this.r * other.r, this.g * other.g, this.b * other.b);
    }

    scale(s) {
      return new Color(this.r * s, this.g * s, this.b * s);
    }

    toString() {
      return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
}