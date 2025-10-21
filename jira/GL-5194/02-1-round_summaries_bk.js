(async () => {
    await (
        await l5_pro_arc.hotdog_minigame_arc.ticket_silos_bk.aggregate(
            /** @type { CollectionAggregationPipeline } */ ([
                { $match: { time: { $gte: ISODate("2025-08-26"), $lt: ISODate("2025-10-12") } } },
                {
                    $group: {
                        _id: "$_ids.roundSummary",
                    },
                },
                {
                    $lookup: {
                        from: "ticket_silos_bk",
                        localField: "_id",
                        foreignField: "_ids.roundSummary",
                        as: "silo",
                    },
                },
                { $unwind: "$silo" },
                {
                    $group: {
                        _id: "$_id",
                        _roundId: { $max: "$silo._roundId" },
                        time: { $min: { $ifNull: ["$silo.roundTime", "$silo.time"] } },
                        currency: { $first: { $ifNull: ["$silo.currency", { $literal: "" }] } },
                        gameId: { $first: "$silo.gameId" },
                        operatorId: { $first: { $ifNull: ["$silo.operatorId", { $literal: "" }] } },
                        siteId: { $first: { $ifNull: ["$silo.siteId", { $literal: "" }] } },
                        roundId: { $first: "$silo.roundId" },
                        tickets: { $sum: "$silo.tickets" },
                        stake: { $sum: "$silo.stake" },
                        payout: { $sum: "$silo.payout" },
                        winloss: { $sum: "$silo.winloss" },
                        win: { $sum: "$silo.win" },
                        loss: { $sum: "$silo.loss" },
                        refund: { $sum: "$silo.refund" },
                        playerIds: { $addToSet: "$silo.playerId" },
                        usdStake: { $sum: "$silo.USD.stake" },
                        usdPayout: { $sum: "$silo.USD.payout" },
                        usdWinloss: { $sum: "$silo.USD.winloss" },
                        usdWin: { $sum: "$silo.USD.win" },
                        usdLoss: { $sum: "$silo.USD.loss" },
                        usdRefund: { $sum: "$silo.USD.refund" },
                        vndStake: { $sum: "$silo.VND.stake" },
                        vndPayout: { $sum: "$silo.VND.payout" },
                        vndWinloss: { $sum: "$silo.VND.winloss" },
                        vndWin: { $sum: "$silo.VND.win" },
                        vndLoss: { $sum: "$silo.VND.loss" },
                        vndRefund: { $sum: "$silo.VND.refund" },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        _roundId: 1,
                        time: 1,
                        currency: 1,
                        gameId: 1,
                        operatorId: 1,
                        siteId: 1,
                        roundId: 1,
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
                        "_ids.hourlySummary": {
                            $toHashedIndexKey: {
                                gameId: "$gameId",
                                currency: "$currency",
                                operatorId: "$operatorId",
                                siteId: "$siteId",
                                time: {
                                    $dateFromParts: {
                                        year: { $year: "$time" },
                                        month: { $month: "$time" },
                                        day: { $dayOfMonth: "$time" },
                                        hour: { $hour: "$time" },
                                    },
                                },
                            },
                        },
                        "_ids.dailySummary": {
                            $toHashedIndexKey: {
                                gameId: "$gameId",
                                currency: "$currency",
                                operatorId: "$operatorId",
                                siteId: "$siteId",
                                time: {
                                    $dateFromParts: {
                                        year: { $year: "$time" },
                                        month: { $month: "$time" },
                                        day: { $dayOfMonth: "$time" },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $set: {
                        "_ids.hourlySummary": {
                            $toObjectId: {
                                $concat: [
                                    { $cond: [{ $lt: ["$_ids.hourlySummary", 0] }, "1", "0"] },
                                    { $substrCP: ["000000000000000000000000", 0, { $subtract: [23, { $strLenCP: { $toString: { $abs: "$_ids.hourlySummary" } } }] }] },
                                    { $toString: { $abs: "$_ids.hourlySummary" } },
                                ],
                            },
                        },
                        "_ids.dailySummary": {
                            $toObjectId: {
                                $concat: [
                                    { $cond: [{ $lt: ["$_ids.dailySummary", 0] }, "1", "0"] },
                                    { $substrCP: ["000000000000000000000000", 0, { $subtract: [23, { $strLenCP: { $toString: { $abs: "$_ids.dailySummary" } } }] }] },
                                    { $toString: { $abs: "$_ids.dailySummary" } },
                                ],
                            },
                        },
                    },
                },
                {
                    $match: {
                        gameId: { $ne: null },
                        currency: { $ne: null },
                        operatorId: { $ne: null },
                        siteId: { $ne: null },
                        time: { $ne: null },
                        roundId: { $ne: null },
                    },
                },
                {
                    $merge: {
                        into: { db: "hotdog_summary_arc", coll: "round_summaries_bk" },
                        on: "_id",
                        whenMatched: "replace",
                        whenNotMatched: "insert",
                    },
                },
            ]),
        )
    ).toArray();
})();
