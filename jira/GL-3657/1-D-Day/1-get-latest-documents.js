/**
 * Scan all collections in all databases and get the latest document for each collection
 * For each dbs, output the result to a file named "E:/Billy/KL-DDay/latest-document/<dbs>_latest_documents.json" that has the following format:
 * {
 *   <dbName>: {
 *     <collName>: <latestDoc>
 *   }
 * }
 */

pro.forEach((dbs) => {
    const latestDocs = {};

    const { databases } = dbs._mongo.getDBs();
    databases.forEach(({ name }) => {
        if (!["minigame", "log", "summary", "member", "hotdog_minigame", "hotdog_log", "hotdog_summary", "hotdog_member", "marble_odds_feed"].includes(name)) return;
        console.log(dbs, name, "--------------------------------");
        const db = dbs[name];

        latestDocs[name] = {};

        db.getCollectionNames()
            .filter((_) => !/(system[.])/.test(_))
            .sort()
            .forEach((collName) => {
                const coll = db.getCollection(collName);
                if (coll.exists()?.type !== "collection") return;
                const latestDoc = coll.findOne({}, {}, { sort: { _id: -1 } });
                latestDocs[name][collName] = latestDoc;
            });
    });
    fs.writeFileSync(`E:/Billy/KL-DDay/latest-document/${dbs.toString()}_latest_documents.json`, EJSON.stringify(latestDocs, null, 2));
});
