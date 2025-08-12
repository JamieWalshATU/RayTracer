class Color{
    constructor(red, green, blue) {
        this.r = red;
        this.g = green;
        this.b = blue;
    }

    add(otherColor) {
      return new Color(this.r + otherColor.r, this.g + otherColor.g, this.b + otherColor.b);
    }

    multiply(otherColor) {
      return new Color(this.r * otherColor.r, this.g * otherColor.g, this.b * otherColor.b);
    }

    scale(scalar) {
      return new Color(this.r * scalar, this.g * scalar, this.b * scalar);
    }

    toString() {
      return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
}