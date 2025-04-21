{
    const db = l2_pro_arc.log_arc;
    const product = "VG";

    const data = JSON.stringify(
        db.bets_bk
            .aggregate([
                { $match: { _id: { $gt: ObjectId.createFromTime(ISODate("2025-02-01") / 1000) } } },
                {
                    $group: {
                        _id: {
                            date: { $substrCP: ["$logTimeStamp", 0, 10] },
                            appType: "$system",
                            currency: "$call.currency",
                            operatorId: "$call.operatorId",
                            playerId: { $toString: "$call.playerId" },
                            roundId: "$call.gameRoundId",
                            gameId: "$call.gameTypeId",
                        },
                        requests: { $sum: 1 },
                        stake: { $sum: { $toDouble: "$call.amount" } },
                    },
                },
                {
                    $group: {
                        _id: {
                            date: "$_id.date",
                            appType: "$_id.appType",
                            gameId: "$_id.gameId",
                            currency: "$_id.currency",
                            operatorId: "$_id.operatorId",
                        },
                        stake: { $sum: "$stake" },
                        requests: { $sum: "$requests" },
                        tickets: { $sum: 1 },
                    },
                },
                {
                    $set: {
                        _id: "$$REMOVE",
                        date: "$_id.date",
                        appType: "$_id.appType",
                        gameId: "$_id.gameId",
                        currency: "$_id.currency",
                        operatorId: "$_id.operatorId",
                    },
                },
            ])
            .toArray(),
    );

    fs.writeFileSync(`E:/Billy/data/20250324-${product}-appType-perf.json`, data);
}

{
    const db = l2_pro.minigame;
    const product = "VG";

    const data = JSON.stringify(
        db.currencies
            .aggregate([
                { $match: { isTest: false } },
                { $project: { _id: 0, name: 1, code: 1, multiplier: 1, operatorId: "$partnerId" } },
                {
                    $lookup: {
                        from: "exchange_silos",
                        localField: "code",
                        foreignField: "code",
                        pipeline: [
                            { $match: { time: { $gte: ISODate("2025-02-01") } } }, //-
                            { $project: { _id: 0, time: 1, USD: 1 } },
                        ],
                        as: "ex",
                    },
                },
                { $unwind: "$ex" },
                {
                    $project: {
                        date: { $substrCP: [{ $toString: "$ex.time" }, 0, 10] },
                        operatorId: 1,
                        currency: "$name",
                        code: 1,
                        rate: { $multiply: ["$multiplier", "$ex.USD"] },
                    },
                },
            ])
            .toArray(),
    );

    fs.writeFileSync(`E:/Billy/data/20250324-${product}-exchange-rate.json`, data);
}
