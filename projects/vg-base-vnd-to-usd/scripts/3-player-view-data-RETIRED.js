// minigame.jackpots - amount, etc.
// minigame.promotion_configs - winningPrizes
// minigame.*_fames - baseTotalAmount, baseWinningAmount

[l2_sit].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67d3cc6fbbdfb267fd117b95");

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

[l2_sit].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67d3cc6fbbdfb267fd117b95");

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

[l2_sit].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67d3cc6fbbdfb267fd117b95");

    // Fames
    db.getCollectionNames()
        .filter((_) => /_fames$/.test(_))
        .map((collName) => {
            const countNullExId = db.getCollection(collName).countDocuments({ exchangeRateId: null });
            console.log(dbs, `${collName} with null exchangeRateId`, countNullExId);
            if (countNullExId === 0) {
                console.log(dbs, `${collName} to be updated: `, db.getCollection(collName).countDocuments({ "__archive.base": { $ne: "USD" } }));
                console.log(
                    dbs,
                    collName,
                    db
                        .getCollection(collName)
                        .aggregate([
                            { $match: { "__archive.base": { $ne: "USD" } } },
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

[l2_sit].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67d3cc6fbbdfb267fd117b95");

    // Balanced-pool betlog bots
    ["taixiu_cuocs", "txturbo_cuocs", "chanleturbo_cuocs", "specialsedie_cuocs", "bitcoinmaster_betlogs"].map((collName) => {
        console.log(dbs, `${collName} to be updated: `, db.getCollection(collName).countDocuments({ "__archive.base": { $ne: "USD" }, operatorId: " " }));
        console.log(
            dbs,
            collName,
            db
                .getCollection(collName)
                .aggregate([
                    { $sort: { _id: -1 } },
                    { $match: { "__archive.base": { $ne: "USD" }, operatorId: " " } },
                    {
                        $project: {
                            _id: 1,
                            refund: 1,
                            baseRefund: 1,
                            betwin: 1,
                            baseBetWin: 1,
                            totalWin: 1,
                            baseTotalWin: 1,
                            amount: 1,
                            baseAmount: 1,
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
                            refund: { $ifNull: [{ $multiply: ["$refund", "$ex.rate"] }, "$$REMOVE"] },
                            baseRefund: { $ifNull: [{ $multiply: ["$baseRefund", "$ex.rate"] }, "$$REMOVE"] },
                            betwin: { $ifNull: [{ $multiply: ["$betwin", "$ex.rate"] }, "$$REMOVE"] },
                            baseBetWin: { $ifNull: [{ $multiply: ["$baseBetWin", "$ex.rate"] }, "$$REMOVE"] },
                            totalWin: { $ifNull: [{ $multiply: ["$totalWin", "$ex.rate"] }, "$$REMOVE"] },
                            baseTotalWin: { $ifNull: [{ $multiply: ["$baseTotalWin", "$ex.rate"] }, "$$REMOVE"] },
                            amount: { $ifNull: [{ $multiply: ["$amount", "$ex.rate"] }, "$$REMOVE"] },
                            baseAmount: { $ifNull: [{ $multiply: ["$baseAmount", "$ex.rate"] }, "$$REMOVE"] },
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

[l2_sit].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67d3cc6fbbdfb267fd117b95");

    // Balanced-pool betlog players
    ["taixiu_cuocs", "txturbo_cuocs", "chanleturbo_cuocs", "specialsedie_cuocs", "bitcoinmaster_betlogs"].map((collName) => {
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

[l2_sit].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67d3cc6fbbdfb267fd117b95");

    // Balanced-pool bet bots
    ["taixiu_ones", "txturbo_ones", "chanleturbo_ones", "specialsedie_ones", "bitcoinmaster_bets"].map((collName) => {
        console.log(dbs, `${collName} to be updated: `, db.getCollection(collName).countDocuments({ "__archive.base": { $ne: "USD" }, operatorId: " " }));
        console.log(
            dbs,
            collName,
            db
                .getCollection(collName)
                .aggregate([
                    { $sort: { _id: -1 } },
                    { $match: { "__archive.base": { $ne: "USD" }, operatorId: " " } },
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

[l2_sit].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67d3cc6fbbdfb267fd117b95");

    // Balanced-pool bet players
    ["taixiu_ones", "txturbo_ones", "chanleturbo_ones", "specialsedie_ones", "bitcoinmaster_bets"].map((collName) => {
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
                            baseAmount: 1,
                            baseBetWin: 1,
                            baseRefund: 1,
                            baseTotalWin: 1,
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
                            baseAmount: { $ifNull: [{ $multiply: ["$baseAmount", "$ex.rate"] }, "$$REMOVE"] },
                            baseBetWin: { $ifNull: [{ $multiply: ["$baseBetWin", "$ex.rate"] }, "$$REMOVE"] },
                            baseRefund: { $ifNull: [{ $multiply: ["$baseRefund", "$ex.rate"] }, "$$REMOVE"] },
                            baseTotalWin: { $ifNull: [{ $multiply: ["$baseTotalWin", "$ex.rate"] }, "$$REMOVE"] },
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

[l2_sit].map((dbs) => {
    const EXECUTE = true;
    const db = dbs.minigame;
    const backupId = ObjectId("67d3cc6fbbdfb267fd117b95");

    // Promotion leaderboard
    {
        const collName = "promotion_leaderboards";
        console.log(dbs, `${collName} to be updated: `, db.getCollection(collName).countDocuments({ "__archive.base": { $ne: "USD" } }));
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
    }
});
