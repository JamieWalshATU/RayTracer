class Vector{
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    scale(scalar) {
    return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  add(otherVector) {
    return new Vector(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
  }

  subtract(otherVector) {
    return new Vector(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
  }

  dot(otherVector) {
    return this.x * otherVector.x + this.y * otherVector.y + this.z * otherVector.z;
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