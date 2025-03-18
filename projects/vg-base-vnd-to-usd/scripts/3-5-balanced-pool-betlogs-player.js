[l2_sit].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67d3cc6fbbdfb267fd117b95");

    // Balanced-pool betlog players
    ["taixiu_cuocs", "txturbo_cuocs", "chanleturbo_cuocs", "specialsedie_cuocs", "bitcoinmaster_betlogs"].map((collName) => {
        const countBackupData = dbs.minigame_backup.getCollection(`backup_${collName}`).countDocuments({ backupId });
        const countCurrentData = dbs.minigame.getCollection(collName).countDocuments();
        console.log(dbs, "Backup data count", countBackupData);
        console.log(dbs, "Current data count", countCurrentData);

        if (countBackupData === 0) {
            console.log(dbs, "No backup data found, aborting");
            return { [collName]: false };
        }

        console.log(
            dbs,
            `${collName} to be updated: `,
            db.getCollection(collName).countDocuments({ time: { $lt: backupId.getTimestamp() }, "__archive.base": { $ne: "USD" }, operatorId: { $ne: " " } }),
        );
        console.log(
            dbs,
            collName,
            db
                .getCollection(collName)
                .aggregate([
                    { $sort: { _id: -1 } },
                    { $match: { time: { $lt: backupId.getTimestamp() }, "__archive.base": { $ne: "USD" }, operatorId: { $ne: " " } } },
                    {
                        $project: {
                            _id: 1,
                            time: 1,
                            baseRefund: 1,
                            baseBetWin: 1,
                            baseTotalWin: 1,
                            baseAmount: 1,
                            rate: 1,
                        },
                    },
                    {
                        $lookup: {
                            from: "exchange_rates",
                            let: { time: "$time" },
                            pipeline: [
                                { $match: { $expr: { $lte: ["$time", "$$time"] } } },
                                { $sort: { time: -1 } },
                                { $limit: 1 },
                                { $match: { "code.USD": 1, "__archive.code": { $exists: true } } }, //- NEED TO EDIT THIS CONDITION - SHOULE BE USD
                                { $project: { _id: 0, rate: { $toDouble: "$code.VND" } } },
                            ],
                            as: "ex",
                        },
                    },
                    { $unwind: "$ex" },
                    {
                        $set: {
                            baseRefund: { $ifNull: [{ $multiply: ["$baseRefund", "$ex.rate"] }, "$$REMOVE"] },
                            baseBetWin: { $ifNull: [{ $multiply: ["$baseBetWin", "$ex.rate"] }, "$$REMOVE"] },
                            baseTotalWin: { $ifNull: [{ $multiply: ["$baseTotalWin", "$ex.rate"] }, "$$REMOVE"] },
                            baseAmount: { $ifNull: [{ $multiply: ["$baseAmount", "$ex.rate"] }, "$$REMOVE"] },
                            rate: { $ifNull: [{ $multiply: ["$rate", "$ex.rate"] }, "$$REMOVE"] },
                            time: "$$REMOVE",
                            ex: "$$REMOVE",
                            "__archive.base": "USD",
                        },
                    },
                    ...(EXECUTE ? [{ $merge: { into: collName } }] : []),
                ])
                .toArray(),
        );
    });
});
