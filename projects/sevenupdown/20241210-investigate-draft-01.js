{
    const db = l1_pro_arc.minigame_arc;
    const rounds = db.sevenupdown_rounds_bk;

    const roundStats = rounds.aggregate([
        { $match: { _id: { $lt: ObjectId("6754e1800000000000000000") } } },
        {
            $facet: {
                total: [{ $group: { _id: null, cnt: { $sum: 1 } } }],
                dice1: [{ $group: { _id: "$result.dice1", cnt: { $sum: 1 } } }],
                dice2: [{ $group: { _id: "$result.dice2", cnt: { $sum: 1 } } }],
                up: [{ $group: { _id: "$settlementResult.up", cnt: { $sum: 1 } } }],
                down: [{ $group: { _id: "$settlementResult.down", cnt: { $sum: 1 } } }],
                seven: [{ $group: { _id: "$settlementResult.seven", cnt: { $sum: 1 } } }],
                multiplier: [{ $group: { _id: "$result.multiplier.choice", cnt: { $sum: 1 }, avg: { $avg: "$result.multiplier.value" } } }],
            },
        },
    ]);

    console.log(roundStats);
}

{
    const db = l1_pro_arc.minigame_arc;
    const rounds = db.sevenupdown_rounds_bk;

    const roundStats = rounds.aggregate([
        { $match: { _id: { $lt: ObjectId("6754e1800000000000000000") } } },
        {
            $facet: {
                total: [{ $group: { _id: null, cnt: { $sum: 1 } } }],
                multiplier: [
                    {
                        $group: {
                            _id: {
                                choice: "$result.multiplier.choice",
                                isWin: {
                                    $getField: {
                                        field: "v",
                                        input: {
                                            $first: {
                                                $filter: {
                                                    input: { $objectToArray: "$settlementResult" },
                                                    as: "d",
                                                    cond: { $eq: ["$$d.k", "$result.multiplier.choice"] },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            cnt: { $sum: 1 },
                            avg: { $avg: "$result.multiplier.value" },
                        },
                    },
                ],
            },
        },
    ]);

    console.log(roundStats);
}

{
    const db = l1_pro_arc.minigame_arc;
    const rounds = db.sevenupdown_rounds_bk;

    const roundStats = rounds.aggregate([
        { $match: { _id: { $lt: ObjectId("6754e1800000000000000000") } } },
        {
            $facet: {
                multiplier: [{ $group: { _id: "$result.multiplier.value", cnt: { $sum: 1 } } }],
            },
        },
    ]);

    console.log(roundStats);
}

{
    const db = l1_pro_arc.minigame_arc;
    const silos = db.ticket_silos_bk;

    const res = silos
        .aggregate(
            [
                {
                    $match: {
                        gameId: 103,
                        currency: { $ne: "UUS" },
                        isTest: { $ne: 1 },
                        time: { $lt: ISODate("2024-12-08") },
                    },
                }, //
                { $project: { _id: 0, USD: 1, operatorId: 1, playerId: 1, currency: 1, roundId: 1, _r: "$_roundId", _b: "$_id" } },
                {
                    $lookup: {
                        from: "sevenupdown_rounds_bk",
                        localField: "_r",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    _id: 0,
                                    up: {
                                        $multiply: [
                                            { $toInt: "$settlementResult.up" },
                                            {
                                                $add: [
                                                    1, //
                                                    {
                                                        $multiply: [1, { $cond: [{ $eq: ["$result.multiplier.choice", "up"] }, "$result.multiplier.value", 1] }],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    down: {
                                        $multiply: [
                                            { $toInt: "$settlementResult.down" },
                                            {
                                                $add: [
                                                    1, //
                                                    {
                                                        $multiply: [1, { $cond: [{ $eq: ["$result.multiplier.choice", "down"] }, "$result.multiplier.value", 1] }],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    seven: {
                                        $multiply: [
                                            { $toInt: "$settlementResult.seven" },
                                            {
                                                $add: [
                                                    1, //
                                                    {
                                                        $multiply: [4, { $cond: [{ $eq: ["$result.multiplier.choice", "seven"] }, "$result.multiplier.value", 1] }],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "_r",
                    },
                },
                { $unwind: { path: "$_r", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "sevenupdown_bets_bk",
                        localField: "_b",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 0, up: 1, down: 1, seven: 1 } }, //
                        ],
                        as: "_b",
                    },
                },
                { $unwind: { path: "$_b", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        operatorId: 1,
                        playerId: 1,
                        currency: 1,
                        roundId: 1,
                        stake: "$USD.stake",
                        payout: "$USD.payout",
                        refund: "$USD.refund",
                        winloss: "$USD.winloss",
                        win: "$USD.win",
                        loss: "$USD.loss",
                        up: "$_b.up",
                        upOdds: "$_r.up",
                        down: "$_b.down",
                        downOdds: "$_r.down",
                        seven: "$_b.seven",
                        sevenOdds: "$_r.seven",
                    },
                },
            ],
            {},
            null,
        )
        .toArray();

    fs.writeFileSync("E:/Billy/data/sevenupdown/20241210-alltickets-before-20241208.json", JSON.stringify(res));
}

{
    const db = l1_pro_arc.summary_arc;
    const players = db.daily_statements_bk;

    const playerStats = players.aggregate(
        [
            { $match: { gameId: 103, time: { $lt: ISODate("2024-12-08") }, currency: { $ne: "UUS" } } }, //
        ],
        {},
        null,
    );

    playerStats;
}
