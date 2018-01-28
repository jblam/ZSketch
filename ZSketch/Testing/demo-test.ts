class T1 extends Testing.Test {
    runTest(): Testing.TestOutcome {
        throw new Error("Method not implemented.");
    }
    readonly title = "Throwing test";
}
class T2 extends Testing.Test {
    runTest(): Testing.TestOutcome { return "pass"; }
    readonly title = "Passing test";
}
class T3 extends Testing.Test {
    runTest(): Testing.TestOutcome {
        return { outcome: "fail", reason: "Out of peanuts" };
    }
    readonly title = "Failing test";
}
class T4 extends Testing.Test {
    runTest(): Testing.TestOutcome {
        return { outcome: "skip", reason: "Need peanuts" };
    }
    readonly title = "Skipped test"
}

Testing.addTest(new T1(), new T2(), new T3(), new T4());