class Vector{
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    scale(s) {
    return new Vector(this.x * s, this.y * s, this.z * s);
  }

  add(other) {
    return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  subtract(other) {
    return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }
  
  magnitude() {
    return Math.sqrt(this.dot(this));
  }

  normalize() {
    const mag = this.magnitude();

    if (mag === 0) {
      return new Vector(0, 0, 0);
    }
    return new Vector(this.x / mag, this.y / mag, this.z / mag);
  }
}