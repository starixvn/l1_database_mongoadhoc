/**
 * Scan all game round collections in minigame database and get the latest document for each collection
 * For each dbs, output the result to a file named "E:/Billy/KL-DDay/latest-document/<dbs>_latest_documents.json" that has the following format:
 * {
 *   <collName>: <latestDoc>
 * }
 */

[l1_pro, l2_pro, l4_pro].forEach((dbs) => {
    const latestDocs = {};

    const db = dbs.minigame;
    console.log(dbs, db, "--------------------------------");

    db.getCollectionNames()
        .filter((_) => /(_(phien|round)s)$/.test(_))
        .sort()
        .forEach((collName) => {
            const coll = db.getCollection(collName);
            if (coll.exists()?.type !== "collection") return;
            const latestDoc = coll.findOne({}, {}, { sort: { _id: -1 } });
            latestDocs[collName] = latestDoc;
        });

    fs.writeFileSync(`E:/Billy/KL-DDay/latest-round/${dbs.toString()}_latest_rounds.json`, EJSON.stringify(latestDocs, null, 2));
});

[l5_pro].forEach((dbs) => {
    const latestDocs = {};

    const db = dbs.hotdog_minigame;
    console.log(dbs, db, "--------------------------------");

    db.getCollectionNames()
        .filter((_) => /(_(phien|round)s)$/.test(_))
        .sort()
        .forEach((collName) => {
            const coll = db.getCollection(collName);
            if (coll.exists()?.type !== "collection") return;
            const latestDoc = coll.findOne({}, {}, { sort: { _id: -1 } });
            latestDocs[collName] = latestDoc;
        });

    fs.writeFileSync(`E:/Billy/KL-DDay/latest-round/${dbs.toString()}_latest_rounds.json`, EJSON.stringify(latestDocs, null, 2));
});
