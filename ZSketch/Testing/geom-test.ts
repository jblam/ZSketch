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
    type TestPredicate = (sk: { def: SketchDefinition, arr: SketchElement[], map: GeometryMap }) => Testing.TestResult;

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
        runTest(): Testing.TestResult {
            if (this.debugOnRun) debugger;
            return this.predicate(InflateSketch(this.def));
        }
        title: string;
        debugOnRun: boolean;
    }

    export function pass(sk: SketchElement) { return Testing.pass(sk); }

    export function IsTAnd<T extends SketchElement>(
        el: SketchElement,
        matches: (el: SketchElement) => el is T,
        predicate: (t: T) => Testing.TestResult): Testing.TestResult {
        if (!isValid(el)) return Testing.fail(`Element "${el.id}" expected to be valid, but was not`, el);
        if (!matches(el)) return Testing.fail(`Element "${el.id}" was of unexpected type "${el.kind}"`, el);
        return predicate(el);
    }
    export function IsT<T extends SketchElement>(
        el: SketchElement,
        matches: (el: SketchElement) => el is T): Testing.TestResult {
        if (!isValid(el)) return Testing.fail(`Element "${el.id}" expected to be valid, but was not`, el);
        if (!matches(el)) return Testing.fail(`Element "${el.id}" was of unexpected type "${el.kind}"`, el);
        return Testing.pass(el);
    }
    
    Testing.addTest(
        new GeomTest(
            { geometry: [] },
            sk => sk.arr.length == 0 ? Testing.pass(sk) : Testing.fail("Unexpected geometry emitted", sk),
            "Empty geometry"),
        new GeomTest(
            {
                geometry: [
                    { kind: "invalid", id: "invalid-refernece" }
                ]
            },
            sk => !isValid(sk.arr[0]) ? Testing.pass(sk) : Testing.fail("Bad definition unexpectedly valid", sk),
            "Invalid definition"
        )
    );
}