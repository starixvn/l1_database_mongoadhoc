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
                                    { $match: { "code.USD": 1 } }, //- NEED TO EDIT THIS CONDITION - SHOULE BE USD
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
                                    { $match: { "code.USD": 1 } }, //- NEED TO EDIT THIS CONDITION - SHOULE BE USD
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
                                                { $match: { "code.USD": 1 } }, //- NEED TO EDIT THIS CONDITION - SHOULE BE USD
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
    }),
);
