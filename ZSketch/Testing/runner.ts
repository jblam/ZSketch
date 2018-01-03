namespace Testing {
    export abstract class Test {
        public getResult(): TestResult {
            const startTime = performance.now();
            let outcome: TestOutcome | Error;
            try {
                outcome = this.runTest();
            }
            catch (e) {
                console.error(e);
                outcome = e;
            }
            return { title: this.title, outcome, duration: performance.now() - startTime };
        }
        abstract runTest(): TestOutcome;
        abstract readonly title: string;
    }

    interface TestResult {
        title: string;
        outcome: TestOutcome | Error;
        duration: number;
    }

    type FailOrSkip = "fail" | "skip";
    export type TestOutcome = "pass" | { outcome: FailOrSkip, reason: string } | Error;

    export const results: TestResult[] = [];
    function isDocumentReady() { return document.readyState === "complete"; }
    let toRender: TestResult[] | null = isDocumentReady() ? null : [];
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

    function render(result: TestResult) {
        let template = <HTMLTemplateElement>document.getElementById("test-result");
        var content = template.content;
        content.querySelector(".description").textContent = result.title;
        content.querySelector(".duration").textContent = result.duration.toFixed(2);
        function setOutcome(outcome: string, reason: string) {
            content.querySelector(".outcome").textContent = outcome;
            content.querySelector(".reason").textContent = reason;
            content.firstElementChild.className = outcome;
        }
        if (result.outcome == "pass") {
            setOutcome(result.outcome, "");
        }
        else if (result.outcome instanceof Error) {
            setOutcome("error", result.outcome.message);
        }
        else {
            setOutcome(result.outcome.outcome, result.outcome.reason);
        }

        document.getElementById("test-results-body").appendChild(document.importNode(content, true));
    }
}