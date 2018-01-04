namespace Geometry {
    interface LineBase extends Geometry.Definition {
        kind: "line";
    }
    /** defines a line as ax + by = c */
    export class Line extends BaseSketchElement<LineDefinition> {
        dependencies: ReadonlyArray<SketchElement>;
        /** the x-coefficient */
        a: number;
        /** the y-coefficient */
        b: number;
        /** the constant */
        c: number;
        /** the start point of the line, or -Infitnity if the line has no start point */
        start: number;
        /** the end point of the line, or Infinity if the line has no end point */
        end: number;
    }
    interface LineFromPoints extends LineBase {
        point1: Reference;
        point2: Reference;
    }
    interface LineFromOffset extends LineBase {
        line: Reference;
        offset: number;
    }
    export type LineDefinition = LineFromOffset | LineFromPoints;
    export function IsLine(def: Definition): def is Definition {
        return def.kind == "line";
    }
    function Inflate(def: Definition, map: GeometryMap): SketchElement {
        throw new Error("Not implemented");
    }

    const parser: Parser<Definition, SketchElement> = { matches: IsLine, inflate: Inflate };
    addParser(parser);
}
