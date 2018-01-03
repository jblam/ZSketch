namespace Geometry.Line {
    interface LineBase extends Geometry.Definition {
        kind: "line";
    }
    /** defines a line as ax + by = c */
    export interface Element extends LineBase {
        definition: Definition;
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
    export type Definition = LineFromOffset | LineFromPoints;
    export function IsLine(def: Definition): def is Definition {
        return def.kind == "line";
    }
    export function Inflate(def: Definition, map: GeometryMap): Element {
        throw new Error("Not implemented");
    }

    export const parser: Parser<Definition, Element> = { matches: IsLine, inflate: Inflate };
    addParser(parser);
}
