namespace Geometry.Tests {
    function isLineAnd(el: SketchElement, f: ((l: Line) => Testing.TestOutcome)): Testing.TestOutcome {
        if (!el) return { outcome: "fail", reason: "Expected element was not found" };
        return isValid(el) && isLine(el)
            ? f(el)
            : { outcome: "fail", reason: `Element "${el.id}" was expected to be a line, but was "${el.kind}"` };
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
            sk => isLineAnd(sk.map["l1"], l => "pass"),
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
            sk => isLineAnd(sk.map["l1"], l => "pass"),
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
            sk => isLineAnd(sk.map["l2"], l => [l.a, l.b, l.c].every((u, i) => u == [0, 1, 1][i])
                ? "pass"
                : { outcome: "fail", reason: `Expected [0, 1, 1], found [${[l.a, l.b, l.c]}]` }),
            "Line from offset"
        )
    );
}