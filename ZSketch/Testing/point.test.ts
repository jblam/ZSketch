namespace Geometry.Tests {
    function isPointAt(el: SketchElement, x: number, y: number): Testing.TestResult {
        if (isValid(el) && IsPoint(el)) {
            if (el.x != x) {
                return Testing.fail(`X coordinate was ${x}; found ${el.x}`, el);
            }
            if (el.y != y) {
                return Testing.fail(`Y coordinate was ${y}; found ${el.y}`, el);
            }
            return Testing.pass(el);
        }
        return Testing.fail(`Element "${el.id}" of type "${el.kind}" is not a valid point`, el);
    }
    function al(n: any, ex: number, ey: number, c: number): LineDefinition {
        return { id: `line${n}`, kind: "line", method: "vector", ex, ey, c };
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