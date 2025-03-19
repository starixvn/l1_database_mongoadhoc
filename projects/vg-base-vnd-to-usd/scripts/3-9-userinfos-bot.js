[l2_pro].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67da60f9e51930f2ad117b91"); // Check correct environment backupId

    const collName = "userinfos";

    const countBackupData = dbs.minigame_backup.getCollection(`backup_${collName}`).countDocuments({ backupId });
    const countCurrentData = dbs.minigame.getCollection(collName).countDocuments();
    console.log(dbs, "Backup data count", countBackupData);
    console.log(dbs, "Current data count", countCurrentData);

    if (countBackupData === 0) {
        console.log(dbs, "No backup data found, aborting");
        return;
    }

    console.log(
        dbs,
        `${collName} to be updated: `,
        db.getCollection(collName).countDocuments({ type: true, "__archive.base": { $ne: "USD" }, joinedOn: { $lte: backupId.getTimestamp() } }),
    );
    console.log(
        dbs,
        collName,
        db
            .getCollection(collName)
            .aggregate([
                { $match: { type: true, joinedOn: { $lte: backupId.getTimestamp() }, "__archive.base": { $ne: "USD" } } },
                { $project: { _id: 1, red: 1, redWin: 1, redLost: 1, redPlay: 1 } },
                {
                    $lookup: {
                        from: "exchange_rates",
                        pipeline: [
                            { $sort: { _id: -1 } }, //-
                            { $match: { "code.USD": 1 } },
                            { $limit: 1 },
                            { $project: { _id: 0, rate: { $toDouble: "$code.VND" } } },
                        ],
                        as: "ex",
                    },
                },
                { $unwind: "$ex" },
                {
                    $set: {
                        red: { $ifNull: [{ $multiply: ["$red", "$ex.rate"] }, "$$REMOVE"] },
                        redWin: { $ifNull: [{ $multiply: ["$redWin", "$ex.rate"] }, "$$REMOVE"] },
                        redLost: { $ifNull: [{ $multiply: ["$redLost", "$ex.rate"] }, "$$REMOVE"] },
                        redPlay: { $ifNull: [{ $multiply: ["$redPlay", "$ex.rate"] }, "$$REMOVE"] },
                        ex: "$$REMOVE",
                        "__archive.base": "USD",
                    },
                },
                ...(EXECUTE ? [{ $merge: { into: collName } }] : []),
            ])
            .toArray(),
    );
});
