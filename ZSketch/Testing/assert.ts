namespace Testing.Assert {
    export function areEqual(expected: any, actual: any): TestResult | null {
        if (expected !== actual) {
            return { outcome: "fail", reason: `Expected ${JSON.stringify(expected)}, found ${JSON.stringify(actual)}`, context: actual };
        }
        return null;
    }

    function* pair<TFirst, TSecond>(first: Iterable<TFirst>, second: Iterable<TSecond>): IterableIterator<[TFirst, TSecond, number]> {
        let it1 = first[Symbol.iterator](), it2 = second[Symbol.iterator]();
        let index = 0;
        while (true) {
            let r1 = it1.next(), r2 = it2.next();
            if (r1.done || r2.done) {
                return;
            }
            else {
                yield [r1.value, r2.value, index];
                index += 1;
            }
        }
    }

    export function sequenceEqual<T>(expected: T[], actual: T[], ignoreMissingElements?: boolean): TestResult | null {
        if (expected && !actual) {
            return { outcome: "fail", reason: "Expected array, but found nothing", context: actual };
        }
        for (let x of pair(expected, actual)) {
            if (x[0] !== x[1]) {
                return { outcome: "fail", reason: `Expected '${x[0]}' at index ${x[2]}; found '${x[1]}'`, context: actual };
            }
        }
        if (!ignoreMissingElements && expected.length != actual.length) {
            return { outcome: "fail", reason: `Expected ${expected.length} elements, found ${actual.length}`, context: actual };
        }
    }

    console.log(sequenceEqual([1, 2, 3], [1, 2, 4]));
    console.log(sequenceEqual([1, 2], [1, 2, 4]));
    console.log(sequenceEqual([1, 2, 3], undefined));
    console.log(sequenceEqual([1, 2, 3], [1, 2], true));
    console.log(areEqual(1, { value: "1" }));
}