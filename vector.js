class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get magnitude() {
        return Math.sqrt(this.dot(this));
    }

    add(v) {
        if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y);
        else return new Vector(this.x + v, this.y + v);
    }

    subtract(v) {
        if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y);
        else return new Vector(this.x - v, this.y - v);
    }

    multiply(v) {
        if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y);
        else return new Vector(this.x * v, this.y * v)
    }

    divide(v) {
        if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
        else return new Vector(this.x / v, this.y / v, this.z / v);
    }

    equals(v) {
        if (v instanceof Vector) return this.x == v.x && this.y == v.y;
        else return false;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    toArray() {
        return [this.x, this.y];
    }

    static midpoint(a, b) {
        if (a instanceof Vector && b instanceof Vector) {
            return a.add(b).divide(2)
        }
    }
}

export { Vector };