namespace Geometry.Tests {
    function isLineAnd(el: SketchElement, f: ((l: Line) => Testing.TestResult)): Testing.TestResult {
        if (!el) return { outcome: "fail", reason: "Expected element was not found", context: el };
        return isValid(el) && isLine(el)
            ? f(el)
            : { outcome: "fail", reason: `Element "${el.id}" was expected to be a line, but was "${el.kind}"`, context: el };
    }
    Testing.addTest(
        new GeomTest(
            {
                geometry: [
                    {
                        id: "l1",
                        kind: "line",
                        method: "algebra",
                        a: 0,
                        b: 1,
                        c: 0
                    }
                ]
            },
            sk => IsTAnd(sk.map["l1"], isLine, Testing.pass),
            "Parse line from algebra"
        ),
        new GeomTest({
            geometry: [{
                id: "l1",
                kind: "line",
                method: "algebra",
                a: 0,
                b: 2,
                c: 0
            }]
        },
            sk => isLineOf(sk.map["l1"], 0, 1, 0, -Infinity, Infinity),
            "Parse line from non-normalised algebra"
        ),
        new GeomTest({ geometry: [
            {
                id: "l1",
                kind: "line",
                method: "algebra",
                a: 0, b: 1, c: 0
            },
            {
                id: "l2",
                kind: "line",
                method: "offset",
                line: "l1",
                offset: 1
            }
        ]
        },
            sk => isLineOf(sk.map["l2"], 0, 1, 1, -Infinity, Infinity),
            "Line from offset"
        )
    );
}