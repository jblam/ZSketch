namespace Geometry.Tests {
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
            sk => (sk.map["l1"].kind == "line" ? "pass" : { outcome: "fail", reason: "line not parsed" }),
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
            sk => (sk.map["l1"].kind == "line" ? "pass" : { outcome: "fail", reason: "line not parsed" }),
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
            sk => sk.map["l2"].kind == "line" && Geometry.isValid(sk.map["l2"]) ? "pass" : { outcome: "fail", reason: "Offset line not generated" },
            "Line from offset"
        )
    );
}