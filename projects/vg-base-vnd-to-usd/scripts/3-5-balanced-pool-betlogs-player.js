[l2_uat].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67d91b26f0b9bdd9664ec05e");

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

        const [game, postfix] = collName.split("_");
        const roundColl = `${game}_${postfix === "cuocs" ? "phiens" : "rounds"}`;

        console.log(
            ISODate().toISOString(),
            dbs,
            `${collName} - ${roundColl} to be updated: `,
            db.getCollection(collName).countDocuments({ time: { $lt: backupId.getTimestamp() }, "__archive.base": { $ne: "USD" }, operatorId: { $ne: " " } }),
        );
        console.log(
            ISODate().toISOString(),
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
                            roundId: 1,
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
                            from: roundColl,
                            localField: "roundId",
                            foreignField: "id",
                            as: "ex",
                            pipeline: [
                                { $project: { _id: 0, exchangeRateId: 1 } }, //-
                            ],
                        },
                    },
                    { $unwind: "$ex" },
                    {
                        $lookup: {
                            from: "exchange_rates",
                            localField: "ex.exchangeRateId",
                            foreignField: "exId",
                            pipeline: [
                                { $match: { "code.USD": 1, "__archive.code": { $exists: true } } }, //- NEED TO EDIT THIS CONDITION - SHOULE BE USD
                                { $limit: 1 },
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
                            roundId: "$$REMOVE",
                            ex: "$$REMOVE",
                            "__archive.base": "USD",
                        },
                    },
                    ...(EXECUTE ? [{ $merge: { into: collName } }] : []),
                ])
                .toArray(),
        );
        console.log(
            ISODate().toISOString(),
            dbs,
            `${collName} - ${roundColl} haven't been updated: `,
            db.getCollection(collName).countDocuments({ time: { $lt: backupId.getTimestamp() }, "__archive.base": { $ne: "USD" }, operatorId: { $ne: " " } }),
        );
    });
});
