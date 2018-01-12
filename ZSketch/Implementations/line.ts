namespace Geometry {
    interface LineBase extends Geometry.Definition {
        kind: "line";
    }
    /** defines a line as ax + by = c */
    export class Line extends BaseSketchElement<LineDefinition> {
        constructor(def: LineDefinition, dependencies: ReadonlyArray<SketchElement>, a: number, b: number, c: number, start?: number, end?: number) {
            super(def);

            // assert that we're normalised
            if (Math.abs(a * a + b * b - 1) > Geometry.tolerance) {
                throw new Error(`Line ${def.id} was not normalised`);
            }

            this.a = a;
            this.b = b;
            this.c = c;
            this.start = start === undefined ? -Infinity : start;
            this.end = end === undefined ? Infinity : end;
            this.dependencies = dependencies;
        }

        dependencies: ReadonlyArray<SketchElement>;
        /** the normalised x-coefficient */
        a: number;
        /** the normalised y-coefficient */
        b: number;
        /** the constant */
        c: number;
        /** the start point of the line, or -Infitnity if the line has no start point */
        start: number;
        /** the end point of the line, or Infinity if the line has no end point */
        end: number;

        public static areParallel(l1: Line, l2: Line) {
            return Math.abs(Math.abs(l1.a) - Math.abs(l2.a)) < Geometry.tolerance;
        }
    }
    interface LineFromAlgebra extends LineBase {
        method: "algebra",
        a: number,
        b: number,
        c: number,
        start?: number,
        end?: number
    }
    interface LineFromPoints extends LineBase {
        method: "points";
        point1: Reference;
        point2: Reference;
    }
    interface LineFromOffset extends LineBase {
        method: "offset";
        line: Reference;
        offset: number;
    }
    export type LineDefinition = LineFromOffset
        | LineFromPoints
        | LineFromAlgebra;
    export function IsLineDefinition(def: Definition): def is LineBase {
        return def.kind == "line";
    }
    export function isLine(el: SketchElement): el is Line {
        return el.kind == "line";
    }
    function Inflate(def: LineDefinition, map: GeometryMap): SketchElement {
        if (def.method == "algebra") {
            let factor = def.a * def.a + def.b * def.b;
            if (Math.abs(factor - 1) > Geometry.tolerance) {
                factor = 1 / Math.sqrt(factor);
            }
            return new Line(def, [], def.a * factor, def.b * factor, def.c, def.start, def.end);
        }
        if (def.method == "offset") {
            let basis = map[def.line];
            if (isLine(basis)) {
                return new Line(def, [basis], basis.a, basis.b, basis.c + def.offset, basis.start, basis.end);
            }
            else {
                return new Invalid(def, basis);
            }
        }
        return new Invalid(def);
    }

    const parser: Parser<Definition, SketchElement> = { matches: IsLineDefinition, inflate: Inflate };
    addParser(parser);
}
