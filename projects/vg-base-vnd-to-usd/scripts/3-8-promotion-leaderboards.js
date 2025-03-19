[l2_pro].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67da60f9e51930f2ad117b91");

    // Promotion leaderboard
    const collName = "promotion_leaderboards";

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
        db.getCollection(collName).countDocuments({ "__archive.base": { $ne: "USD" }, dataSourceTimeStamp: { $lte: backupId.getTimestamp() } }),
    );
    console.log(
        dbs,
        collName,
        db
            .getCollection(collName)
            .aggregate([
                { $match: { dataSourceTimeStamp: { $lte: backupId.getTimestamp() }, "__archive.base": { $ne: "USD" } } },
                { $project: { _id: 1, promotionId: 1, pointInBaseCurrency: 1, awardedAmountInBaseCurrency: 1 } },
                {
                    $lookup: {
                        from: "promotion_configs",
                        localField: "promotionId",
                        foreignField: "promotionId",
                        pipeline: [
                            { $project: { _id: 0, exId: 1 } }, //-
                        ],
                        as: "ex",
                    },
                },
                { $unwind: "$ex" },
                {
                    $lookup: {
                        from: "exchange_rates",
                        localField: "ex.exId",
                        foreignField: "exId",
                        pipeline: [
                            { $match: { "code.USD": 1, "__archive.code": { $exists: true } } }, //- NEED TO EDIT THIS CONDITION - SHOULE BE USD
                            { $project: { _id: 0, rate: { $toDouble: "$code.VND" } } },
                        ],
                        as: "ex",
                    },
                },
                { $unwind: "$ex" },
                {
                    $set: {
                        pointInBaseCurrency: { $ifNull: [{ $multiply: ["$pointInBaseCurrency", "$ex.rate"] }, "$$REMOVE"] },
                        awardedAmountInBaseCurrency: { $ifNull: [{ $multiply: ["$awardedAmountInBaseCurrency", "$ex.rate"] }, "$$REMOVE"] },
                        promotionId: "$$REMOVE",
                        ex: "$$REMOVE",
                        "__archive.base": "USD",
                    },
                },
                ...(EXECUTE ? [{ $merge: { into: collName } }] : []),
            ])
            .toArray(),
    );
});
