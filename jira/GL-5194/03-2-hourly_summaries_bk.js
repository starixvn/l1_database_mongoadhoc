(async () => {
    await (
        await l5_pro_arc.hotdog_summary_arc.round_summaries_bk.aggregate(
            /** @type { CollectionAggregationPipeline } */ ([
                { $match: { time: { $gte: ISODate("2025-08-26"), $lt: ISODate("2025-10-12") } } },
                {
                    $group: {
                        _id: "$_ids.hourlySummary",
                    },
                },
                {
                    $lookup: {
                        from: "round_summaries_bk",
                        localField: "_id",
                        foreignField: "_ids.hourlySummary",
                        as: "data",
                    },
                },
                { $unwind: "$data" },
                {
                    $group: {
                        _id: "$_id",
                        time: {
                            $first: {
                                $dateFromParts: {
                                    year: { $year: "$data.time" },
                                    month: { $month: "$data.time" },
                                    day: { $dayOfMonth: "$data.time" },
                                    hour: { $hour: "$data.time" },
                                },
                            },
                        },
                        currency: { $first: "$data.currency" },
                        gameId: { $first: "$data.gameId" },
                        operatorId: { $first: "$data.operatorId" },
                        siteId: { $first: "$data.siteId" },
                        tickets: { $sum: "$data.tickets" },
                        stake: { $sum: "$data.stake" },
                        payout: { $sum: "$data.payout" },
                        winloss: { $sum: "$data.winloss" },
                        win: { $sum: "$data.win" },
                        loss: { $sum: "$data.loss" },
                        refund: { $sum: "$data.refund" },
                        playerIds: { $addToSet: "$data.playerIds" },
                        usdStake: { $sum: "$data.USD.stake" },
                        usdPayout: { $sum: "$data.USD.payout" },
                        usdWinloss: { $sum: "$data.USD.winloss" },
                        usdWin: { $sum: "$data.USD.win" },
                        usdLoss: { $sum: "$data.USD.loss" },
                        usdRefund: { $sum: "$data.USD.refund" },
                        vndStake: { $sum: "$data.VND.stake" },
                        vndPayout: { $sum: "$data.VND.payout" },
                        vndWinloss: { $sum: "$data.VND.winloss" },
                        vndWin: { $sum: "$data.VND.win" },
                        vndLoss: { $sum: "$data.VND.loss" },
                        vndRefund: { $sum: "$data.VND.refund" },
                    },
                },
                {
                    $set: {
                        playerIds: { $reduce: { input: "$playerIds", initialValue: [], in: { $setUnion: ["$$value", "$$this"] } } },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        time: 1,
                        currency: 1,
                        gameId: 1,
                        operatorId: 1,
                        siteId: 1,
                        tickets: 1,
                        stake: { $toDecimal: { $round: ["$stake", 4] } },
                        payout: { $toDecimal: { $round: ["$payout", 4] } },
                        winloss: { $toDecimal: { $round: ["$winloss", 4] } },
                        win: { $toDecimal: { $round: ["$win", 4] } },
                        loss: { $toDecimal: { $round: ["$loss", 4] } },
                        refund: { $toDecimal: { $round: ["$refund", 4] } },
                        players: { $size: "$playerIds" },
                        playerIds: { $sortArray: { input: "$playerIds", sortBy: 1 } },
                        "USD.stake": { $toDecimal: { $round: ["$usdStake", 4] } },
                        "USD.payout": { $toDecimal: { $round: ["$usdPayout", 4] } },
                        "USD.winloss": { $toDecimal: { $round: ["$usdWinloss", 4] } },
                        "USD.win": { $toDecimal: { $round: ["$usdWin", 4] } },
                        "USD.loss": { $toDecimal: { $round: ["$usdLoss", 4] } },
                        "USD.refund": { $toDecimal: { $round: ["$usdRefund", 4] } },
                        "VND.stake": { $toDecimal: { $round: ["$vndStake", 4] } },
                        "VND.payout": { $toDecimal: { $round: ["$vndPayout", 4] } },
                        "VND.winloss": { $toDecimal: { $round: ["$vndWinloss", 4] } },
                        "VND.win": { $toDecimal: { $round: ["$vndWin", 4] } },
                        "VND.loss": { $toDecimal: { $round: ["$vndLoss", 4] } },
                        "VND.refund": { $toDecimal: { $round: ["$vndRefund", 4] } },
                        __v: version,
                    },
                },
                {
                    $merge: {
                        into: { db: "hotdog_summary_arc", coll: "hourly_summaries_bk" },
                        on: "_id",
                        whenMatched: "replace",
                        whenNotMatched: "insert",
                    },
                },
            ]),
        )
    ).toArray();
})();
