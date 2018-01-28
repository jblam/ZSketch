namespace Testing {
    export abstract class Test {
        public getResult(): TestOutput {
            const startTime = performance.now();
            let outcome: TestResult | Error;
            try {
                outcome = this.runTest();
            }
            catch (e) {
                console.error(e);
                outcome = e;
            }
            return { title: this.title, outcome, duration: performance.now() - startTime };
        }
        abstract runTest(): TestResult;
        abstract readonly title: string;
    }

    interface TestOutput {
        title: string;
        outcome: TestResult | Error;
        duration: number;
    }

    interface PassResult { outcome: "pass", context: object };
    interface FailResult { outcome: "fail", reason: string, context: object }
    interface SkipResult { outcome: "skip", reason: string }
    export type TestResult = PassResult | FailResult | SkipResult | Error;
    export function pass(context: object): TestResult { return { outcome: "pass", context } };
    export function fail(reason: string, context: object): TestResult { return { outcome: "fail", reason, context }; }
    export function skip(reason: string): TestResult { return { outcome: "skip", reason }; }

    export const results: TestOutput[] = [];
    function isDocumentReady() { return document.readyState === "complete"; }
    let toRender: TestOutput[] | null = isDocumentReady() ? null : [];
    document.addEventListener("readystatechange", ev => {
        if (!isDocumentReady()) {
            return;
        }
        for (let r of toRender) {
            render(r);
        }
        toRender = null;
    }, false);
    export function addTest(...tests: Test[]) {
        for (let t of tests) {
            let result = t.getResult();
            results.push(result);
            if (toRender !== null) {
                toRender.push(result);
            } else {
                render(result);
            }
        }
    }

    function render(result: TestOutput) {
        let template = <HTMLTemplateElement>document.getElementById("test-result");
        let content = template.content;
        content.querySelector(".description").textContent = result.title;
        content.querySelector(".duration").textContent = result.duration.toFixed(2);
        function setOutcome(outcome: string, reason: string) {
            content.querySelector(".outcome").textContent = outcome;
            content.querySelector(".reason").textContent = reason;
            content.firstElementChild.className = outcome;
        }
        let resultContext: object = null;
        if (result.outcome instanceof Error) {
            setOutcome("error", result.outcome.message);
        }
        else {
            setOutcome(result.outcome.outcome, result.outcome.outcome == "pass" ? "" : result.outcome.reason);
            if (result.outcome.outcome !== "skip") {
                resultContext = result.outcome.context;
            }
        }

        let parent = document.getElementById("test-results-body");
        let instance = parent.appendChild(document.importNode(content, true));
        let button = <HTMLElement>parent.children[parent.children.length - 1].querySelector(".inspect button");
        if (button) button.onclick = () => console.log(resultContext);
        else console.log("no button");
    }
}