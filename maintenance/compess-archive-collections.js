{
    const db = l2pp.minigame_arc;

    const collNames = db.getCollectionNames().sort();
    const storageEngine = { wiredTiger: { configString: "block_compressor=zstd" } };
    const system = /^system/;

    for (const collName of collNames) {
        if (system.test(collName)) {
            continue;
        }

        const coll = db.getCollection(collName);

        const meta = coll.exists();
        if (meta?.options?.storageEngine?.wiredTiger?.configString === "block_compressor=zstd") {
            console.log(collName, "block_compressor=zstd");
            continue;
        }

        console.log(new Date().toISOString(), collName, coll.countDocuments());
        console.log(new Date().toISOString(), collName, db.createCollection(`${collName}_new`, { storageEngine }));
        console.log(new Date().toISOString(), collName, db.getCollection(collName).renameCollection(`${collName}_old`));
        console.log(new Date().toISOString(), collName, db.getCollection(`${collName}_new`).renameCollection(collName));
        console.log(new Date().toISOString(), collName, db.getCollection(`${collName}_old`).aggregate([{ $merge: { into: collName } }]));
        console.log(new Date().toISOString(), db.getCollection(`${collName}_old`).drop());
        console.log(new Date().toISOString(), collName, db.getCollection(collName).countDocuments());
    }
}
