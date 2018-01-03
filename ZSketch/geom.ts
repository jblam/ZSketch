namespace Geometry {

    export interface Definition {
        id: string;
        kind: string;
    }
    export interface Element {
        id: string;
        kind: string;
    }

    export interface Parser<TDefinition extends Definition, TElement extends Element> {
        matches: (geom: Definition) => boolean;
        inflate: (geom: TDefinition, map: GeometryMap) => TElement;
    }
    
    export type Reference = string;
    
    export interface SketchDefinition {
        geometry: Definition[];
    }
    export type GeometryMap = { readonly [id: string]: Element };
    type MutableGeometryMap = { [id: string]: Element };
    interface Sketch {
        def: SketchDefinition;
        arr: Element[]
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

    const parsers: Parser<Definition, Element>[] = [];
    export function addParser(parser: Parser<Definition, Element>) {
        parsers.push(parser);
    }
    function InflateGeometry(def: Definition, map: MutableGeometryMap): Element {
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