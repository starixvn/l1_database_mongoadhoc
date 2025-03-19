[l2_uat].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67d91b26f0b9bdd9664ec05e");

    const countBackupData = dbs.minigame_backup.getCollection("backup_jackpots").countDocuments({ backupId });
    const countCurrentData = dbs.minigame.getCollection("jackpots").countDocuments();
    console.log(dbs, "Backup data count", countBackupData);
    console.log(dbs, "Current data count", countCurrentData);

    if (countBackupData === 0) {
        console.log(dbs, "No backup data found, aborting");
        return;
    }

    const countNullExIdJackpots = db.jackpots.countDocuments({ exchangeRateId: null, hitAt: { $ne: null } });
    console.log(dbs, "Jackpots with null exchangeRateId", countNullExIdJackpots);
    if (countNullExIdJackpots === 0) {
        console.log(dbs, "Jackpots to be updated: ", db.jackpots.countDocuments({ "__archive.base": { $ne: "USD" } }));
        console.log(
            dbs,
            db.jackpots
                .aggregate([
                    { $match: { "__archive.base": { $ne: "USD" } } },
                    { $project: { _id: 1, amount: 1, byBots: 1, byMembers: 1, initAmount: 1, exchangeRateId: 1, rate: 1, hitAt: 1 } },
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
                    { $unwind: { path: "$ex", preserveNullAndEmptyArrays: true } },
                    {
                        $lookup: {
                            from: "exchange_rates",
                            pipeline: [
                                { $sort: { exId: -1 } },
                                { $limit: 1 },
                                { $match: { "code.USD": 1 } }, //- NEED TO EDIT THIS CONDITION - SHOULE BE USD
                                { $project: { _id: 0, rate: { $toDouble: "$code.VND" } } },
                            ],
                            as: "ex2",
                        },
                    },
                    { $unwind: "$ex2" },
                    {
                        $set: {
                            ex: { $cond: [{ $not: { $gt: ["$hitAt", 0] } }, "$ex2", "$ex"] },
                            ex2: "$$REMOVE",
                        },
                    },
                    {
                        $set: {
                            amount: { $multiply: ["$amount", "$ex.rate"] },
                            byBots: { $multiply: ["$byBots", "$ex.rate"] },
                            byMembers: { $multiply: ["$byMembers", "$ex.rate"] },
                            initAmount: { $multiply: ["$initAmount", "$ex.rate"] },
                            rate: { $ifNull: [{ $multiply: ["$rate", "$ex.rate"] }, "$$REMOVE"] },
                            hitAt: "$$REMOVE",
                            exchangeRateId: "$$REMOVE",
                            ex: "$$REMOVE",
                            "__archive.base": "USD",
                        },
                    },
                    ...(EXECUTE ? [{ $merge: { into: "jackpots" } }] : []),
                ])
                .toArray(),
        );
    } else {
        console.log(dbs, "---!!!!!!--- ABORTED jackpots ---!!!!!!---");
    }
});
