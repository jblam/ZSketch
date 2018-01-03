namespace Geometry.Point {
    const kind = "point";
    interface PointBase extends Geometry.Definition {
        kind: "point";
    }
    export interface Element extends PointBase {
        definition: Definition;
        x: number;
        y: number;
    }
    interface PointFromCoordinates extends PointBase {
        x: number;
        y: number;
    }
    interface PointFromIntersection extends PointBase {
        line1: Reference;
        line2: Reference;
    }
    export type Definition = PointFromCoordinates | PointFromIntersection;
    export function IsPoint(def: Definition): def is Definition {
        return def.kind == "point";
    }
    export function Inflate(def: Definition, map: GeometryMap): Element {
        throw new Error("Not implemented");
    }

    export const parser: Parser<Definition, Element> = { matches: IsPoint, inflate: Inflate };

    addParser(parser);
}
