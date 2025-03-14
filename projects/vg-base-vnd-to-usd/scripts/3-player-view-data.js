// minigame.jackpots - amount, etc.
// minigame.promotion_configs - winningPrizes
// minigame.*_fames - baseTotalAmount, baseWinningAmount

Promise.allSettled(
    [l2pp].map(async (dbs) => {
        const EXECUTE = true;
        const db = dbs.minigame;

        const countNullExIdJackpots = await db.jackpots.countDocuments({ exchangeRateId: null });
        console.log(dbs, "Jackpots with null exchangeRateId", countNullExIdJackpots);
        if (countNullExIdJackpots === 0) {
            console.log(dbs, "Jackpots to be updated: ", await db.jackpots.countDocuments({ "__archive.base": { $ne: "USD" } }));
            console.log(
                dbs,
                await (
                    await db.jackpots.aggregate([
                        { $match: { "__archive.base": { $ne: "USD" } } },
                        { $project: { _id: 1, amount: 1, byBots: 1, byMembers: 1, initAmount: 1, exchangeRateId: 1, rate: 1 } },
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
                ).toArray(),
            );
        } else {
            console.log(dbs, "---!!!!!!--- ABORTED jackpots ---!!!!!!---");
        }

        const countNullExIdPromotionConfigs = await db.promotion_configs.countDocuments({ exId: null });
        console.log(dbs, "Promotion configs with null exId", countNullExIdPromotionConfigs);
        if (countNullExIdPromotionConfigs === 0) {
            console.log(dbs, "Promotion configs to be updated: ", await db.promotion_configs.countDocuments({ "__archive.base": { $ne: "USD" } }));
            console.log(
                dbs,
                await (
                    await db.promotion_configs.aggregate([
                        { $match: { "__archive.base": { $ne: "USD" } } },
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
                ).toArray(),
            );
        } else {
            console.log(dbs, "---!!!!!!--- ABORTED promotion_configs ---!!!!!!---");
        }

        Promise.allSettled(
            (await db.getCollectionNames())
                .filter((_) => /_fames$/.test(_))
                .map(async (collName) => {
                    const countNullExId = await db.collection(collName).countDocuments({ exchangeRateId: null });
                    console.log(dbs, `${collName} with null exchangeRateId`, countNullExId);
                    if (countNullExId === 0) {
                        console.log(dbs, `${collName} to be updated: `, await db.getCollection(collName).countDocuments({ "__archive.base": { $ne: "USD" } }));
                        console.log(
                            dbs,
                            collName,
                            await (
                                await db.getCollection(collName).aggregate([
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
                            ).toArray(),
                        );
                    } else {
                        console.log(dbs, "---!!!!!!--- ABORTED ", collName, " ---!!!!!!---");
                    }
                }),
        );

        // Balanced-pool betlog bots
        Promise.allSettled(
            ["taixiu_cuocs", "txturbo_cuocs", "specialsedie_cuocs", "bitcoinmaster_betlogs"].map(async (collName) => {
                console.log(dbs, `${collName} to be updated: `, await db.getCollection(collName).countDocuments({ "__archive.base": { $ne: "USD" }, operatorId: " " }));
                console.log(
                    dbs,
                    collName,
                    await (
                        await db.getCollection(collName).aggregate([
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
                    ).toArray(),
                );
            }),
        );

        // Balanced-pool betlog players
        Promise.allSettled(
            ["taixiu_cuocs", "txturbo_cuocs", "specialsedie_cuocs", "bitcoinmaster_betlogs"].map(async (collName) => {
                console.log(
                    dbs,
                    `${collName} to be updated: `,
                    await db
                        .getCollection(collName)
                        .countDocuments({ time: { $lt: ISODate("2025-03-10T06:21:10.000Z") }, "__archive.base": { $ne: "USD" }, operatorId: { $ne: " " } }),
                );
                console.log(
                    dbs,
                    collName,
                    await (
                        await db.getCollection(collName).aggregate([
                            { $sort: { _id: -1 } },
                            { $match: { time: { $lt: ISODate("2025-03-10T06:21:10.000Z") }, "__archive.base": { $ne: "USD" }, operatorId: { $ne: " " } } },
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
                    ).toArray(),
                );
            }),
        );

        // Balanced-pool bet bots
        Promise.allSettled(
            ["taixiu_ones", "txturbo_ones", "specialsedie_ones", "bitcoinmaster_bets"].map(async (collName) => {
                console.log(dbs, `${collName} to be updated: `, await db.getCollection(collName).countDocuments({ "__archive.base": { $ne: "USD" }, operatorId: " " }));
                console.log(
                    dbs,
                    collName,
                    await (
                        await db.getCollection(collName).aggregate([
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
                    ).toArray(),
                );
            }),
        );

        // Balanced-pool bet players
        Promise.allSettled(
            ["taixiu_ones", "txturbo_ones", "specialsedie_ones", "bitcoinmaster_bets"].map(async (collName) => {
                console.log(
                    dbs,
                    `${collName} to be updated: `,
                    await db
                        .getCollection(collName)
                        .countDocuments({ time: { $lt: ISODate("2025-03-10T06:21:10.000Z") }, "__archive.base": { $ne: "USD" }, operatorId: { $ne: " " } }),
                );
                console.log(
                    dbs,
                    collName,
                    await (
                        await db.getCollection(collName).aggregate([
                            { $sort: { _id: -1 } },
                            { $match: { time: { $lt: ISODate("2025-03-10T06:21:10.000Z") }, "__archive.base": { $ne: "USD" }, operatorId: { $ne: " " } } },
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
                    ).toArray(),
                );
            }),
        );
    }),
);
