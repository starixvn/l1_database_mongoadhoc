{
    db.createCollection("system.profile", { capped: true, size: 2 * 1024 ** 3 });
    db.setProfilingLevel(1);
}

{
    db.system.profile.find();
}

{
    console.log(db.setProfilingLevel(0, { filter: "unset" }));
    console.log(db.system.profile.drop());
    console.log(db.createCollection("system.profile", { capped: true, size: 2 * 1024 ** 3 }));
    console.log(db.setProfilingLevel(1, { slowms: 100, sampleRate: 1 }));
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

["minigame", "log", "member", "summary"].forEach((dbName) => {
    // ["hotdog_minigame", "hotdog_log", "hotdog_member", "hotdog_summary", "marble_odds_feed"].forEach((dbName) => {
    const thisDB = db.getSiblingDB(dbName);

    console.log(thisDB, thisDB.setProfilingLevel(0, { sampleRate: 0 }));
    console.log(thisDB, thisDB.system.profile.drop());
    console.log(thisDB, thisDB.createCollection("system.profile", { capped: true, size: 2 * 1024 ** 3 }));
    console.log(thisDB, thisDB.setProfilingLevel(1, { slowms: 100 }));
});

["minigame", "log", "member", "summary"].forEach((dbName) => {
    // ["hotdog_minigame", "hotdog_log", "hotdog_member", "hotdog_summary", "marble_odds_feed"].forEach((dbName) => {
    const thisDB = db.getSiblingDB(dbName);
    console.log(thisDB, thisDB.setProfilingLevel(1, { slowms: 100, sampleRate: 1 }));
});

// [l1db01, l1db02, l1db03].forEach((dbs) => {
// [l2db01, l2db02, l2db03].forEach((dbs) => {
[l4db01, l4db02, l4db03].forEach((dbs) => {
    console.log(dbs);
    console.table(
        dbs.minigame.system.profile
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
});

[l1db01, l1db02, l1db03, l2db01, l2db02, l2db03, l4db01, l4db02, l4db03].forEach((dbs) => {
    ["minigame", "log", "member", "summary"].forEach((dbName) => {
        const thisDB = dbs[dbName];
        console.log(thisDB, thisDB.setProfilingLevel(1, { slowms: 100, sampleRate: 1, filter: "unset" }));
    });
});

[l5db01, l5db02, l5db03].forEach((dbs) => {
    ["hotdog_minigame", "hotdog_log", "hotdog_member", "hotdog_summary", "marble_odds_feed"].forEach((dbName) => {
        const thisDB = dbs[dbName];
        console.log(thisDB, thisDB.setProfilingLevel(1, { slowms: 100, sampleRate: 1, filter: "unset" }));
    });
});

dbs_pro.forEach((dbs) => {
    dbs.admin
        .getMongo()
        .getDBs()
        .databases.forEach(({ name }) => {
            const idb = db.getSiblingDB(name);
            {
                const { was, slowms, sampleRate, ok } = idb.getProfilingStatus();
                console.log(name, idb.system.profile.countDocuments(), { was, slowms, sampleRate, ok });
            }
            console.log(name, idb.setProfilingLevel(0, { filter: "unset" }));
            {
                const { was, slowms, sampleRate, ok } = idb.getProfilingStatus();
                console.log(name, idb.system.profile.countDocuments(), { was, slowms, sampleRate, ok });
            }
        });
});
