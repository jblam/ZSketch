namespace Geometry {
    // TODO: contextual tolerance depending on the precision of definitions
    /** defines the numerical tolerance within which two floating-point values are considered equal */
    export const tolerance = 1e-6;
    export interface Definition {
        id: string;
        kind: string;
    }
    export interface SketchElement {
        readonly definition: Definition;
        readonly id: string;
        readonly kind: string;
        readonly dependencies: ReadonlyArray<SketchElement>;
    }
    export abstract class BaseSketchElement<TDefinition extends Definition> implements SketchElement {
        constructor(definition: TDefinition) {
            this.definition = definition;
            this.id = definition.id;
            this.kind = definition.kind;
        }
        readonly definition: TDefinition;
        readonly id: string;
        readonly kind: string;
        abstract readonly dependencies: ReadonlyArray<SketchElement>;
    }

    export class Invalid extends BaseSketchElement<Definition> {
        constructor(def: Definition, ...dependencies: SketchElement[]) {
            super(def);
            this.dependencies = dependencies;
        }
        dependencies: ReadonlyArray<SketchElement>;
    }
    export function createInvalidReference(id: string) {
        return new Invalid({ id, kind: "invalid" });
    }
    export function isValid(el: SketchElement) { return !(el instanceof Invalid); }

    // TODO: can Typescript auto-generate input validation?
    // TODO: the Invalid Definition geometry
    // TODO: the Invalid Reference geometry

    // TODO: can you reflect on Typescript types?

    export interface Parser<TDefinition extends Definition, TElement extends SketchElement> {
        matches: (geom: Definition) => boolean;
        inflate: (geom: TDefinition, map: GeometryMap) => TElement;
    }
    
    export type Reference = string;
    
    export interface SketchDefinition {
        geometry: Definition[];
    }
    export type GeometryMap = { readonly [id: string]: SketchElement };
    type MutableGeometryMap = { [id: string]: SketchElement };
    interface Sketch {
        def: SketchDefinition;
        arr: SketchElement[]
        map: GeometryMap;
    }

    export function InflateSketch(def: SketchDefinition) {
        const map: GeometryMap = {};
        const arr = def.geometry.map(el => InflateGeometry(el, map));
        return {
            def,
            arr,
            map
        };
    }

    export const parsers: Parser<Definition, SketchElement>[] = [];
    export function addParser(parser: Parser<Definition, SketchElement>) {
        parsers.push(parser);
    }
    function InflateGeometry(def: Definition, map: MutableGeometryMap): SketchElement {
        function parse() {
            for (let parser of parsers) {
                if (parser.matches(def)) {
                    return parser.inflate(def, map);
                }
            }
            return new Invalid(def);
        }
        let output = parse();
        map[output.id] = output;
        return output;
    }


}