class T1 extends Testing.Test {
    runTest(): Testing.TestResult {
        throw new Error("Method not implemented.");
    }
    readonly title = "Throwing test";
}
class T2 extends Testing.Test {
    runTest(): Testing.TestResult { return Testing.pass(null); }
    readonly title = "Passing test";
}
class T3 extends Testing.Test {
    runTest(): Testing.TestResult {
        return Testing.fail("Out of peanuts", null);
    }
    readonly title = "Failing test";
}
class T4 extends Testing.Test {
    runTest(): Testing.TestResult {
        return { outcome: "skip", reason: "Need peanuts" };
    }
    readonly title = "Skipped test"
}

Testing.addTest(new T1(), new T2(), new T3(), new T4());