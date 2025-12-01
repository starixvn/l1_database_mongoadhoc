(async () => {
    const gameIds = l2_pro.minigame.game_configs
        .find({ "cascadingSlotsConfig.resultChains.enabled": true }, { _id: 0, gameId: 1, type: 1 })
        .map(({ gameId }) => gameId)
        .toArray();
})();

(async () => {
    const data = l2_pro.minigame.ticket_silos
        .aggregate(
            /** @type { CollectionAggregationPipeline } */ ([
                {
                    $match: {
                        time: { $gte: ISODate("2025-09-24") },
                        // time: { $gte: ISODate("2025-10-25") },
                        currency: { $ne: "UUS" },
                        gameId: { $in: [66, 126, 130, 129, 131, 128, 139, 140, 155, 142] },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        playerId: 1,
                        operatorId: 1,
                        gameId: 1,
                        time: 1,
                        sessionId: 1,
                        currency: 1,
                        tickets: 1,
                        stake: "$USD.stake",
                        payout: "$USD.payout",
                        winloss: "$USD.winloss",
                        isBFS: { $cond: [{ $gt: ["$features.buyFreeSpins", 0] }, true, false] },
                        day: { $dateTrunc: { date: "$time", unit: "day" } },
                    },
                },
                {
                    $lookup: {
                        from: "user_game_sessions",
                        localField: "sessionId",
                        foreignField: "sessionId",
                        let: { gameId: "$gameId", time: "$time" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$gameId", "$$gameId"] }, // -
                                            { $gte: ["$$time", "$signInGameTime"] },
                                        ],
                                    },
                                },
                            },
                            { $sort: { _id: -1 } },
                            { $limit: 1 },
                            {
                                $project: {
                                    _id: 1,
                                    signInGameTime: 1,
                                    signOutGameTime: 1,
                                    duration: { $dateDiff: { startDate: "$signInGameTime", endDate: "$signOutGameTime", unit: "second" } },
                                },
                            },
                        ],
                        as: "gs",
                    },
                },
                { $unwind: "$gs" },
                {
                    $lookup: {
                        from: "player_chain_assignments",
                        localField: "playerId",
                        foreignField: "playerId",
                        let: { gameId: { $toString: "$gameId" }, time: "$time", operatorId: "$operatorId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$gameId", "$$gameId"] }, // -
                                            { $eq: ["$operatorId", "$$operatorId"] },
                                            { $gte: ["$$time", "$assignedAt"] },
                                            { $lte: ["$$time", "$lastActivityAt"] },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    chainName: 1,
                                },
                            },
                        ],
                        as: "ch",
                    },
                },
                { $unwind: { path: "$ch", preserveNullAndEmptyArrays: true } },
                { $set: { isChain: { $cond: [{ $gt: ["$ch.chainName", ""] }, true, false] } } },
                {
                    $group: {
                        _id: { day: "$day", sessionId: { $ifNull: ["$gs._id", "$sessionId"] } },
                        isBFS: { $max: "$isBFS" },
                        isChain: { $max: "$isChain" },
                        tickets: { $sum: "$tickets" },
                        stake: { $sum: "$stake" },
                        payout: { $sum: "$payout" },
                        winloss: { $sum: "$winloss" },
                        avgSessionDuration: { $avg: "$gs.duration" },
                    },
                },
                {
                    $group: {
                        _id: { day: "$_id.day", isChain: "$isChain" },
                        sessions: { $sum: 1 },
                        tickets: { $sum: "$tickets" },
                        stake: { $sum: "$stake" },
                        payout: { $sum: "$payout" },
                        winloss: { $sum: "$winloss" },
                        avgTickets: { $avg: "$tickets" },
                        avgStake: { $avg: "$stake" },
                        avgPayout: { $avg: "$payout" },
                        avgWinloss: { $avg: "$winloss" },
                        avgSessionDuration: { $avg: "$avgSessionDuration" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        day: {"$dateToString": { date: "$_id.day", format: "%Y-%m-%d" } },
                        dayNo: { $add: [{ $multiply: [{ $year: "$_id.day" }, 1000] }, { $dayOfYear: "$_id.day" }] },
                        isChain: "$_id.isChain",
                        sessions: 1,
                        tickets: 1,
                        stake: { $toDouble: { $round: ["$stake", 2] } },
                        payout: { $toDouble: { $round: ["$payout", 2] } },
                        winloss: { $toDouble: { $round: ["$winloss", 2] } },
                        avgTickets: { $toDouble: { $round: ["$avgTickets", 0] } },
                        avgStake: { $toDouble: { $round: ["$avgStake", 2] } },
                        avgPayout: { $toDouble: { $round: ["$avgPayout", 2] } },
                        avgWinloss: { $toDouble: { $round: ["$avgWinloss", 2] } },
                        avgSessionDuration: { $toDouble: { $round: ["$avgSessionDuration", 2] } },
                    },
                },
            ]),
        )
        .toArray();

    console.log(JSON.stringify(data));
})();
