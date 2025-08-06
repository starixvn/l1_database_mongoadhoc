{
    db.createCollection("system.profile", { capped: true, size: 2 * 1024 ** 3 });
    db.setProfilingLevel(1);
}

{
    db.system.profile.find();
}

{
    console.log(db.setProfilingLevel(0, { filter: {} }));
    console.log(db.system.profile.drop());
    console.log(db.createCollection("system.profile", { capped: true, size: 2 * 1024 ** 3 }));
    console.log(db.setProfilingLevel(1, { filter: {} }));
}

{
    console.log(db.setProfilingLevel(0, { filter: {} }));
    console.log(db.system.profile.drop());
    console.log(db.createCollection("system.profile", { capped: true, size: 2 * 1024 ** 3 }));
    console.log(db.setProfilingLevel(2, { filter: {} }));
    console.log(db.getProfilingStatus());
}

{
    console.table(
        db.system.profile
            .find({ op: "query", ns: "minigame.userinfos" }, { ts: 1, returned: 1, keysExamined: 1, docsExamined: 1, millis: 1, appName: 1, f: "$command.filter" })
            .map((_) => {
                _.f = JSON.stringify(_.f);
                return _;
            })
            .toArray(),
    );
}

{
    console.table(
        db.system.profile
            .find(
                { op: "query", ns: { $nin: [""] }, docsExamined: { $gt: 200 } },
                { ts: 1, nreturned: 1, keysExamined: 1, docsExamined: 1, millis: 1, appName: 1, f: "$command.filter", ns: 1 },
            )
            .map((_) => {
                _.f = JSON.stringify(_.f);
                return _;
            })
            .toArray(),
    );
}

{
    console.table(
        db.system.profile
            .find(
                { op: "query", ns: { $nin: [""] }, docsExamined: { $gt: 0 } },
                { ts: 1, nreturned: 1, keysExamined: 1, docsExamined: 1, millis: 1, appName: 1, f: "$command.filter", ns: 1 },
            )
            .map((_) => {
                _.f = JSON.stringify(_.f);
                return _;
            })
            .toArray(),
    );
}
