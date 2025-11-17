// @ts-check
(async () => {
    const db = l2pp.minigame;

    fs.writeFileSync("D:/Temp/VG-result_chains-20251117.json", EJSON.stringify(db.result_chains.find({}, { _id: 0 }).toArray()));
})();

(async () => {
    const db = l2_sit.minigame;
    const backupId = "GL-6001";

    const data = EJSON.parse(fs.readFileSync("/home/billy.bui@SIT/VG-result_chains-20251117.json", "utf8"));
    console.log("INPUT", data.length, bsonsize(data));

    (
        await db.result_chains.aggregate([
            { $project: { _id: 0, backupId, data: "$$ROOT" } }, // -
            { $merge: { into: { db: "minigame_backup", coll: "result_chains_backup" } } },
        ])
    ).toArray();

    console.log("DELETE", db.result_chains.deleteMany({}));
    console.log("INSERT", Object.keys(db.result_chains.insertMany(data).insertedIds).length);
})();
