[l2_uat].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67d91b26f0b9bdd9664ec05e");

    // Fames
    db.getCollectionNames()
        .filter((_) => /_fames$/.test(_))
        .map((collName) => {
            const countBackupData = dbs.minigame_backup.getCollection(`backup_${collName}`).countDocuments({ backupId });
            const countCurrentData = dbs.minigame.getCollection(collName).countDocuments();
            console.log(dbs, "Backup data count", countBackupData);
            console.log(dbs, "Current data count", countCurrentData);

            if (countBackupData === 0) {
                console.log(dbs, "No backup data found, aborting");
                return { [collName]: false };
            }

            const countNullExId = db.getCollection(collName).countDocuments({ exchangeRateId: null, time: { $lt: backupId.getTimestamp() } });
            console.log(dbs, `${collName} with null exchangeRateId`, countNullExId);
            if (countNullExId === 0) {
                console.log(
                    dbs,
                    `${collName} to be updated: `,
                    db.getCollection(collName).countDocuments({ "__archive.base": { $ne: "USD" }, time: { $lt: backupId.getTimestamp() } }),
                );
                console.log(
                    dbs,
                    collName,
                    db
                        .getCollection(collName)
                        .aggregate([
                            { $match: { "__archive.base": { $ne: "USD" }, time: { $lt: backupId.getTimestamp() } } },
                            { $project: { _id: 1, baseTotalAmount: 1, baseWinningAmount: 1, rate: 1, exchangeRateId: 1 } },
                            {
                                $lookup: {
                                    from: "exchange_rates",
                                    localField: "exchangeRateId",
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
                                    baseTotalAmount: { $multiply: ["$baseTotalAmount", "$ex.rate"] },
                                    baseWinningAmount: { $multiply: ["$baseWinningAmount", "$ex.rate"] },
                                    rate: { $multiply: ["$rate", "$ex.rate"] },
                                    exchangeRateId: "$$REMOVE",
                                    ex: "$$REMOVE",
                                    "__archive.base": "USD",
                                },
                            },
                            ...(EXECUTE ? [{ $merge: { into: collName } }] : []),
                        ])
                        .toArray(),
                );
            } else {
                console.log(dbs, "---!!!!!!--- ABORTED ", collName, " ---!!!!!!---");
            }
        });
});
