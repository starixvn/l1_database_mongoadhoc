[l2_sit].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67d3cc6fbbdfb267fd117b95");

    // Balanced-pool bet bots
    ["taixiu_ones", "txturbo_ones", "chanleturbo_ones", "specialsedie_ones", "bitcoinmaster_bets"].map((collName) => {
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
            db.getCollection(collName).countDocuments({ "__archive.base": { $ne: "USD" }, operatorId: " ", time: { $lt: backupId.getTimestamp() } }),
        );
        console.log(
            dbs,
            collName,
            db
                .getCollection(collName)
                .aggregate([
                    { $sort: { _id: -1 } },
                    { $match: { "__archive.base": { $ne: "USD" }, operatorId: " ", time: { $lt: backupId.getTimestamp() } } },
                    {
                        $project: {
                            _id: 1,
                            amount: 1,
                            baseAmount: 1,
                            baseBetWin: 1,
                            baseRefund: 1,
                            baseTotalWin: 1,
                            betwin: 1,
                            refund: 1,
                            totalAmount: 1,
                            totalWin: 1,
                        },
                    },
                    {
                        $lookup: {
                            from: "exchange_rates",
                            pipeline: [
                                { $match: { "code.USD": 1, "__archive.code": { $exists: true } } }, //- NEED TO EDIT THIS CONDITION - SHOULE BE USD
                                { $sort: { time: -1 } },
                                { $limit: 1 },
                                { $project: { _id: 0, rate: { $toDouble: "$code.VND" } } },
                            ],
                            as: "ex",
                        },
                    },
                    { $unwind: "$ex" },
                    {
                        $set: {
                            amount: { $ifNull: [{ $multiply: ["$amount", "$ex.rate"] }, "$$REMOVE"] },
                            baseAmount: { $ifNull: [{ $multiply: ["$baseAmount", "$ex.rate"] }, "$$REMOVE"] },
                            baseBetWin: { $ifNull: [{ $multiply: ["$baseBetWin", "$ex.rate"] }, "$$REMOVE"] },
                            baseRefund: { $ifNull: [{ $multiply: ["$baseRefund", "$ex.rate"] }, "$$REMOVE"] },
                            baseTotalWin: { $ifNull: [{ $multiply: ["$baseTotalWin", "$ex.rate"] }, "$$REMOVE"] },
                            betwin: { $ifNull: [{ $multiply: ["$betwin", "$ex.rate"] }, "$$REMOVE"] },
                            refund: { $ifNull: [{ $multiply: ["$refund", "$ex.rate"] }, "$$REMOVE"] },
                            totalAmount: { $ifNull: [{ $multiply: ["$totalAmount", "$ex.rate"] }, "$$REMOVE"] },
                            totalWin: { $ifNull: [{ $multiply: ["$totalWin", "$ex.rate"] }, "$$REMOVE"] },
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
