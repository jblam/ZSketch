namespace Geometry {
    interface PointBase extends Geometry.Definition {
        kind: "point";
        method: string;
    }
    interface PointFromCoordinates extends PointBase {
        method: "coordinates";
        x: number;
        y: number;
    }
    interface PointFromIntersection extends PointBase {
        method: "intersection";
        line1: Reference;
        line2: Reference;
    }
    export type PointDefinition = PointFromCoordinates | PointFromIntersection;
    export function IsPointDefinition(def: Definition): def is Definition {
        return def.kind == "point";
    }
    export function IsPoint(el: SketchElement): el is Point {
        return el.kind == "point";
    }

    export abstract class Point extends BaseSketchElement<PointDefinition> {
        constructor(def: PointDefinition, x: number, y: number) {
            super(def);
            this.x = x;
            this.y = y;
        }
        x: number;
        y: number;
    }
    class CoordinatesPoint extends Point {
        constructor(def: PointFromCoordinates) {
            super(def, def.x, def.y);
            this.dependencies = [];
        }
        dependencies: ReadonlyArray<SketchElement>;
    }
    class IntersectionPoint extends Point {
        dependencies: ReadonlyArray<SketchElement>;
        constructor(def: PointFromIntersection, line1: Line, line2: Line) {
            
            let lineU: Line, lineV: Line;
            if (Math.abs(line1.e[0]) > Math.abs(line2.e[0])) {
                [lineU, lineV] = [line2, line1];
            } else {
                [lineU, lineV] = [line1, line2]
            }

            // a1x + b1y = c1  __1
            // a2x + b2y = c2
            // a2.(a1/a2)x + b2(a1/a2)y = c2(a1/a2)  __2 ----- a2 != 0
            // (1 - 2) -> y(b1 - b2.a1/a2) = c1 - c2.a1/a2
            // y(a2.b1 - b2.a1) = c1.a2 - c2.a1
            // y = (c1.a2 - c2.a1) / (a2.b1 - b2.a1) ----- b1 != b2(a1/a2) ; b1/a1 != b2/a2 ; non-parallel
            //
            // x = c2 / a2 - (c1 - c2.a1/a2) / (a2.b1 - b2.a1) -- OR
            // x = (c2 - b2.y) / a2

            let y = (lineU.c * lineV.e[0] - lineV.c * lineU.e[0]) / (lineV.e[0] * lineU.e[1] - lineV.e[1] * lineU.e[0]);
            let x = (lineV.c - lineV.e[1] * y) / lineV.e[0];
            
            super(def, x, y);
            this.dependencies = [line1, line2];
        }
    }

    function Inflate(def: PointDefinition, map: GeometryMap): SketchElement {
        if (def.method == "coordinates") {
            return new CoordinatesPoint(def);
        } else if (def.method == "intersection") {
            let [l1, l2] = [def.line1, def.line2].map(l => map[l]);
            function isValidLine(l: SketchElement): l is Line { return isValid(l) && isLine(l); }
            if (isValidLine(l1) && isValidLine(l2)) {
                return new IntersectionPoint(def, l1, l2);
            }
            return new Invalid(def, l1, l2);
        }
        return new Invalid(def);
    }

    const parser: Parser<Definition, SketchElement> = { matches: IsPointDefinition, inflate: Inflate };
    addParser(parser);
}