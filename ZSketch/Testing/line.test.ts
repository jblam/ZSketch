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
                        method: "vector",
                        ex: 0,
                        ey: 1,
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
                method: "vector",
                ex: 0,
                ey: 2,
                c: 0
            }]
        },
            sk => isLineAnd(sk.map["l1"], l => Testing.Assert.sequenceEqual(l.e, [0, 1], true) || { outcome: "pass", context: l }),
            "Parse line from non-normalised algebra"
        ),
    );
}