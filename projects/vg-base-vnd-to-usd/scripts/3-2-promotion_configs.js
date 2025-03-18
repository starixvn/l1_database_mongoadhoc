[l2_sit].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67d3cc6fbbdfb267fd117b95");

    const countBackupData = dbs.minigame_backup.getCollection("backup_promotion_configs").countDocuments({ backupId });
    const countCurrentData = dbs.minigame.getCollection("promotion_configs").countDocuments();
    console.log(dbs, "Backup data count", countBackupData);
    console.log(dbs, "Current data count", countCurrentData);

    if (countBackupData === 0) {
        console.log(dbs, "No backup data found, aborting");
        return;
    }

    const countNullExIdPromotionConfigs = db.promotion_configs.countDocuments({ exId: null });
    console.log(dbs, "Promotion configs with null exId", countNullExIdPromotionConfigs);
    if (countNullExIdPromotionConfigs === 0) {
        console.log(dbs, "Promotion configs to be updated: ", db.promotion_configs.countDocuments({ "__archive.base": { $ne: "USD" } }));
        console.log(
            dbs,
            db.promotion_configs
                .aggregate([
                    { $match: { startDateTime: { $lte: backupId.getTimestamp() }, "__archive.base": { $ne: "USD" } } },
                    { $project: { _id: 1, winningPrizes: 1, exId: 1 } },
                    {
                        $lookup: {
                            from: "exchange_rates",
                            localField: "exId",
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
                            winningPrizes: { $map: { input: "$winningPrizes", as: "w", in: { $mergeObjects: ["$$w", { value: { $multiply: ["$$w.value", "$ex.rate"] } }] } } },
                            exId: "$$REMOVE",
                            ex: "$$REMOVE",
                            "__archive.base": "USD",
                        },
                    },
                    ...(EXECUTE ? [{ $merge: { into: "promotion_configs" } }] : []),
                ])
                .toArray(),
        );
    } else {
        console.log(dbs, "---!!!!!!--- ABORTED promotion_configs ---!!!!!!---");
    }
});
