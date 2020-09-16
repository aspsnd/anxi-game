export var ShapeType = {
    Point: 0,
    Line: 1,
    Polygon: 2,
    Circle: 3
}
export class Shape {
    /**
     * @type {number}
     */
    type
    /**
     * @return {Boolean}
     * @param {Shape} shape 
     */
    hit(shape) {
        throw new Error('unimplemented!');
    }
}
export class Polygon extends Shape {
    type = ShapeType.Polygon
    constructor(...points) {
        super();
        this.points = points;
    }
    /**
     * @type {Line[]}
     */
    lines = []
    initLines() {
        if (this.points.length == 2) {
            this.lines = [new Line(this.points)];
        } else {
            this.lines = [];
            let len = this.points.length;
            for (let i = 0; i < len - 1; i++) {
                this.lines.push(new Line(this.points[i], this.points[i + 1]));
            }
            this.lines.push(new Line(this.points[len - 1], this.points[0]));
        }
    }
    /**
    * @type {Line[]}
    */
    innerLines = []
    initInnerLines() {
        if (this.points.length == 2) {
            this.innerLines = [new Line(this.points)];
        } else {
            this.innerLines = [];
            let len = this.points.length;
            for (let i = 0; i < len; i++) {
                for (let j = i + 1; j < len; j++) {
                    this.innerLines.push(new Line(this.points[i], this.points[j]));
                }
            }
        }
    }

    /**
     * @param {Polygon} polygon 
     */
    hitPolygon(polygon) {
        if (this.innerLines.length == 0) this.initInnerLines();
        if (polygon.innerLines.length == 0) polygon.initInnerLines();
        let len2 = polygon.innerLines.length;
        for (let i = 0; i < len2; i++) {
            if (this.hitLine(polygon.innerLines[i])) return true;
        }
        return false;
    }
    /**
     * @param {Circle} circle 
     */
    hitCircle(circle) {
        if (this.innerLines.length == 0) this.initInnerLines();
        let len = this.innerLines.length;
        for (let i = 0; i < len; i++) {
            if (this.innerLines[i].hitCircle(circle)) return true;
        }
        return false;
    }

    /**
     * @param {Line} line 
     */
    hitLine(line) {
        if (this.innerLines.length == 0) this.initInnerLines();
        let len = this.innerLines.length;
        for (let i = 0; i < len; i++) {
            if (this.innerLines[i].hitLine(line)) return true;
        }
        return false;
    }

    /**
     * @param {Polygon | Line | Circle} shape 
     */
    hit(shape) {
        let type = shape.type;
        if (type == ShapeType.Polygon) {
            return this.hitPolygon(shape);
        }
        if (type == ShapeType.Circle) {
            return this.hitCircle(shape);
        }
        if (type == ShapeType.Line) {
            return this.hitLine(shape);
        }
    }
}
export class Line extends Shape {

    type = ShapeType.Line

    /**
     * 
     * @param {Point} point1 
     * @param {Point} point2 
     */
    constructor(point1, point2) {
        super();
        this.point1 = point1;
        this.point2 = point2;
    }
    a
    b
    c
    /**
     * @param {Circle} circle 
     */
    // hitCircle(circle) {
    //     if (circle.include(this.point1) || circle.include(this.point2)) return true;
    //     if (!this.a) this.computeExpression();
    //     let abpow = Math.pow(this.a ** 2 + this.b ** 2, 0.5);
    //     let distance = Math.abs(this.a * circle.x + this.b * circle.y + this.c) / abpow;
    //     if (distance > circle.rad) return false;
    //     let jx = circle.x + distance * this.a / abpow;
    //     return ((this.point1.x - jx) * (this.point2.x - jx)) < 0;
    // }
    /**
     * @param {Circle} circle 
     */
    hitCircle(circle) {
        var x1 = this.point1.x;
        var x2 = this.point2.x;
        var y2 = this.point2.y;
        var y1 = this.point1.y;
        var vx1 = circle.x - this.point1.x;
        var vy1 = circle.y - this.point1.y;
        var vx2 = this.point2.x - this.point1.x;
        var vy2 = this.point2.y - this.point1.y;
        var len = (vx2 ** 2 + vy2 ** 2) ** 0.5;
        vx2 /= len;
        vy2 /= len;
        var u = vx2 * vx1 + vy1 * vy2;
        var x0 = 0;
        var y0 = 0;
        if (u <= 0) {
            x0 = x1;
            y0 = y1;
        } else if (u >= len) {
            x0 = x2;
            y0 = y2;
        } else {
            x0 = x1 + vx2 * u;
            y0 = y1 + vy2 * u;
        }
        return (circle.x - x0) ** 2 + (circle.y - y0) ** 2 <= circle.rad ** 2;
    }
    computeExpression() {
        if (this.point1.x == this.point2.x) {
            this.b = 0;
            this.a = 1;
            this.c = -this.point1.x;
            return;
        }
        if (this.point1.y == this.point2.y) {
            this.a = 0;
            this.b = 1;
            this.c = -this.point1.y;
            return;
        }
        this.b = 1;
        this.a = (this.point1.y - this.point2.y) / (this.point2.x - this.point1.x);
        this.c = -this.a * this.point1.x - this.point1.y;
    }
    /**
     * 
     * @param {Line} line 
     */
    hitLine(line) {
        if (!this.a) this.computeExpression();
        if (!line.a) line.computeExpression();
        if (this.a == line.a) return false;
        let jx = ((line.c * this.b) - (line.b * this.c)) / ((this.a * line.b) - (this.b * line.a));
        return (((this.point1.x - jx) ^ (this.point2.x - jx)) < 0) && (((line.point1.x - jx) ^ (line.point2.x - jx)) < 0);
    }

    /** 
     * @param {Polygon|Line|Circle} shape 
     */
    hit(shape) {
        let type = shape.type;
        if (type == ShapeType.Polygon) {
            return shape.hitLine(this);
        }
        if (type == ShapeType.Circle) {
            return this.hitCircle(shape);
        }
        if (type == ShapeType.Line) {
            return this.hitLine(shape);
        }
    }
}
export class Point extends Shape {
    type = ShapeType.Point
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }
}

export class Circle extends Shape {
    type = ShapeType.Circle
    constructor(x, y, rad) {
        super();
        this.x = x;
        this.y = y;
        this.rad = rad;
    }
    /**
     * @return {Boolean}
     * @param {Point} point 
     */
    include(point) {
        return (point.x - this.x) ** 2 + (point.y - this.y) ** 2 <= this.rad ** 2;
    }
    /**
    * @param {Polygon | Line | Circle} shape 
    */
    hit(shape) {
        let type = shape.type;
        if (type == ShapeType.Polygon) {
            return shape.hitCircle(this);
        }
        if (type == ShapeType.Circle) {
            return this.hitCircle(shape);
        }
        if (type == ShapeType.Line) {
            return shape.hitCircle(this);
        }
    }
    /**
    * @param {Circle} circle 
    */
    hitCircle(circle) {
        return (this.rad + circle.rad) ** 2 > (this.x - circle.x) ** 2 + (this.y - circle.y) ** 2;
    }
}
window.Polygon = Polygon;
window.Circle = Circle;
window.Line = Line;
window.Point = Point;