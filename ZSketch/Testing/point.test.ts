namespace Geometry.Tests {
    function isPointAt(el: SketchElement, x: number, y: number): Testing.TestOutcome {
        if (isValid(el) && IsPoint(el)) {
            if (el.x != x) {
                return { outcome: "fail", reason: `X coordinate was ${x}; found ${el.x}` };
            }
            if (el.y != y) {
                return { outcome: "fail", reason: `Y coordinate was ${y}; found ${el.y}` };
            }
            return "pass";
        }
        return { outcome: "fail", reason: `Element "${el.id}" of type "${el.kind}" is not a valid point` };
    }
    function al(n: any, a: number, b: number, c: number): LineDefinition {
        return { id: `line${n}`, kind: "line", method: "algebra", a, b, c };
    }
    Testing.addTest(
        new GeomTest({
            geometry: [
                al(1, 0, 1, 0),
                al(2, 1, 0, 0),
                {
                    id: "p",
                    kind: "point",
                    method: "intersection",
                    line1: "line1",
                    line2: "line2"
                }
            ]
        },
            sk => isPointAt(sk.map["p"], 0, 0),
            "Intersection of axes"),
        new GeomTest({
            geometry: [
                al(1, 1, 0, 0),
                al(2, 0, 1, 0),
                {
                    id: "p",
                    kind: "point",
                    method: "intersection",
                    line1: "line1",
                    line2: "line2"
                }
            ]
        },
            sk => isPointAt(sk.map["p"], 0, 0),
            "Intersection of inverse axes"),
        new GeomTest({
            geometry: [
                al(1, 1, 1, 0),
                al(2, 1, -1, 0),
                {
                    id: "p",
                    kind: "point",
                    method: "intersection",
                    line1: "line1",
                    line2: "line2"
                }
            ]
        },
            sk => isPointAt(sk.map["p"], 0, 0),
            "Intersection on diagonals"),
        new GeomTest({
            geometry: [
                al(1, 1, 0, 1),
                al(2, 0, 1, 1),
                {
                    id: "p",
                    kind: "point",
                    method: "intersection",
                    line1: "line1",
                    line2: "line2"
                }
            ]
        }, sk => isPointAt(sk.map["p"], 1, 1), "Intersection at offset")
    );
}