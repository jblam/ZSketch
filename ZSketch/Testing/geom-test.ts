namespace Geometry.Tests {
    type GeometryElement = Point | Line;
    interface ExplicitInvalidDef {
        id: string,
        kind: "invalid"
    }
    export type GeometryDefinition = PointDefinition | LineDefinition | ExplicitInvalidDef;
    var geometry: GeometryDefinition[] = [
        {
            id: "zsk-1",
            kind: "point",
            method: "coordinates",
            x: 1,
            y: 1,
        },
        {
            id: "zsk-2",
            kind: "point",
            method: "coordinates",
            x: 2,
            y: 2
        },
        //{
        //    id: "zsk-3",
        //    kind: "line",
        //    point1: "zsk-1",
        //    point2: "zsk-2"
        //},
    ];
    interface ExplicitSketchDefinition {
        geometry: GeometryDefinition[]
    }
    type TestPredicate = (sk: { def: SketchDefinition, arr: SketchElement[], map: GeometryMap }) => Testing.TestOutcome;
    export class GeomTest extends Testing.Test {

        constructor(def: ExplicitSketchDefinition, predicate: TestPredicate, title: string, debugOnRun?: boolean) {
            super();
            this.def = def;
            this.predicate = predicate;
            this.title = title;
            this.debugOnRun = !!debugOnRun;
        }
        def: SketchDefinition;
        predicate: TestPredicate;
        runTest(): Testing.TestOutcome {
            if (this.debugOnRun) debugger;
            return this.predicate(InflateSketch(this.def));
        }
        title: string;
        debugOnRun: boolean;
    }


    Testing.addTest(
        new GeomTest(
            { geometry: [] },
            sk => sk.arr.length == 0 ? "pass" : { outcome: "fail", reason: "Unexpected geometry emitted" },
            "Empty geometry"),
        new GeomTest(
            {
                geometry: [
                    { kind: "invalid", id: "invalid-refernece" }
                ]
            },
            sk => !isValid(sk.arr[0]) ? "pass" : { outcome: "fail", reason: "Bad definition unexpectedly valid" },
            "Invalid definition"
        )
    );
}