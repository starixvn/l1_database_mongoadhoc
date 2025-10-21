// @ts-check

(async () => {
    const data = await (
        await l1_pro_arc.summary_arc.daily_summaries_bk.aggregate(
            /** @type { CollectionAggregationPipeline } */ ([
                { $match: { gameId: 107, time: { $gte: ISODate("2025-03-01") } } }, // -
                {
                    $group: {
                        _id: { time: "$time", gameId: "$gameId", operatorId: "$operatorId" },
                        stake: { $sum: "$USD.stake" },
                        players: { $sum: "$players" },
                        tickets: { $sum: "$tickets" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        time: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                        gameId: "$_id.gameId",
                        operatorId: "$_id.operatorId",
                        stake: { $toDouble: "$stake" },
                        players: "$players",
                        tickets: "$tickets",
                    },
                },
            ]),
        )
    ).toArray();

    console.table(data);
    console.log(JSON.stringify(data));
})();

(async () => {
    const data = await (
        await l2_pro_arc.summary_arc.daily_summaries_bk.aggregate(
            /** @type { CollectionAggregationPipeline } */ ([
                { $match: { gameId: 107, time: { $gte: ISODate("2025-03-01") } } }, // -
                {
                    $group: {
                        _id: { time: "$time", gameId: "$gameId", operatorId: "$operatorId" },
                        stake: { $sum: "$USD.stake" },
                        players: { $sum: "$players" },
                        tickets: { $sum: "$tickets" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        time: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                        gameId: "$_id.gameId",
                        operatorId: "$_id.operatorId",
                        stake: { $toDouble: "$stake" },
                        players: "$players",
                        tickets: "$tickets",
                    },
                },
            ]),
        )
    ).toArray();

    console.table(data);
    console.log(JSON.stringify(data));
})();
