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
    export function IsPoint(def: Definition): def is Definition {
        return def.kind == "point";
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

    function Inflate(def: PointDefinition, map: GeometryMap): SketchElement {
        if (def.method == "coordinates") {
            return new CoordinatesPoint(def);
        } else if (def.method == "intersection") {
            throw new Error("Intersection not implemented");
        }
        return new Invalid(def);
    }

    const parser: Parser<Definition, SketchElement> = { matches: IsPoint, inflate: Inflate };
    addParser(parser);
}