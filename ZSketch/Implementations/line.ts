namespace Geometry {
    interface LineBase extends Geometry.Definition {
        kind: "line";
    }
    /** defines a line as ax + by = c */
    export class Line extends BaseSketchElement<LineDefinition> {
        constructor(def: LineDefinition, dependencies: ReadonlyArray<SketchElement>, e: vec, c: number, start?: number, end?: number) {
            super(def);

            // assert that we're normalised
            if (Math.abs(e[0] * e[0] + e[1] * e[1] - 1) > Geometry.tolerance) {
                throw new Error(`Line ${def.id} was not normalised`);
            }

            this.e = e;
            this.c = c;
            this.start = start === undefined ? -Infinity : start;
            this.end = end === undefined ? Infinity : end;
            this.dependencies = dependencies;
        }

        dependencies: ReadonlyArray<SketchElement>;
        /** the normalised unit vector */
        e: vec;
        /** the constant */
        c: number;
        /** the start point of the line, or -Infitnity if the line has no start point */
        start: number;
        /** the end point of the line, or Infinity if the line has no end point */
        end: number;

        public static areParallel(l1: Line, l2: Line) {
            return Math.abs(Math.abs(l1.e[0]) - Math.abs(l2.e[0])) < Geometry.tolerance;
        }
    }
    interface Vector extends LineBase {
        method: "vector",
        ex: number,
        ey: number,
        c: number,
        start?: number,
        end?: number
    }
    interface VectorThroughPoint extends LineBase {
        method: "vector-point",
        ex: number,
        ey: number,
        through: Reference,
        start?: number,
        forward?: number
    }
    interface LineFromPoints extends LineBase {
        method: "points";
        point1: Reference;
        point2: Reference;
    }
    export type LineDefinition = Vector
        | LineFromPoints;

    export function IsLineDefinition(def: Definition): def is LineBase {
        return def.kind == "line";
    }
    export function isLine(el: SketchElement): el is Line {
        return el.kind == "line";
    }

    type vec = [number, number];
    type vec_len = [number, number, number];
    function unit(v: vec): vec_len {
        let l2 = v[0] * v[0] + v[1] * v[1];
        if (l2 < Geometry.tolerance) {
            throw new Error("Tried to normalise a zero-length vector");
        }
        let l = (Math.abs(l2 - 1) > Geometry.tolerance) ? Math.sqrt(l2) : l2;
        return [v[0] / l, v[1] / l, l];
    }
    function normal(v: vec): vec {
        return [-v[1], v[0]];
    }
    function dot(v1: vec, v2: vec) {
        return v1[0] * v2[0] + v1[1] * v2[1];
    }
    function zero(v: vec) {
        const uu = unit(v);
        return dot(uu, normal(uu));
    }
    zero([1, 2]);

    function Inflate(def: LineDefinition, map: GeometryMap): SketchElement {
        switch (def.method) {
            case "vector": {
                let vec = unit([def.ex, def.ey]);
                return new Line(def, [], vec, def.c, def.start, def.end);
            }
            case "points": {
                let [p1, p2] = [def.point1, def.point2].map(el => <Point>map[el]);
                let vec = unit([p2.x - p1.x, p2.y - p1.y]);
                let n = normal(vec);
                let c = dot(vec, n);
                let start = dot([p1.x, p1.y], vec);
                let end = dot([p2.x, p2.y], vec);
                return new Line(def, [p1, p2], vec, c, start, end);
            }
            default:
                return new Invalid(def);
        }
    }

    const parser: Parser<Definition, SketchElement> = { matches: IsLineDefinition, inflate: Inflate };
    addParser(parser);
}
