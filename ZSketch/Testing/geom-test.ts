namespace Geometry.Tests {
    //interface Dummy1 : GeometryBase





    type GeometryElement = Point.Element | Line.Element;
    type GeometryDefinition = Point.Definition | Line.Definition;
    var geometry: GeometryDefinition[] = [
        {
            id: "zsk-1",
            kind: "point",
            x: 1,
            y: 1,
        },
        {
            id: "zsk-2",
            kind: "point",
            x: 2,
            y: 2
        },
        {
            id: "zsk-3",
            kind: "line",
            point1: "zsk-1",
            point2: "zsk-2"
        },
    ];

    type TestPredicate = (sk: { def: SketchDefinition, arr: Element[], map: GeometryMap }) => Testing.TestOutcome;
    class GeomTest extends Testing.Test {
        
        constructor(def: SketchDefinition, predicate: TestPredicate) {
            super();
            this.def = def;
            this.predicate = predicate;
            this.title = "Sketch inflation";
        }
        def: SketchDefinition;
        predicate: TestPredicate;
        runTest(): Testing.TestOutcome {
            return this.predicate(InflateSketch(this.def));
        }
        title: "Sketch inflation";

    }


    Testing.addTest(new GeomTest({ geometry }, sk => sk.arr.length > 0 ? "pass" : { outcome: "fail", reason: "No geometry emitted" }));
}