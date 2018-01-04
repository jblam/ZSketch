namespace Geometry {

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
        }
        let output = parse();
        if (!output) {
            throw new Error(`Could not parse defintion of kind ${def.kind}`);
        }
        map[output.id] = output;
        return output;
    }


}