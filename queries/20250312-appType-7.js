JSON.stringify(
    l2_pro_arc.log_arc.bets_bk
        .aggregate([
            {
                $match: {
                    _id: { $gt: ObjectId.createFromTime(ISODate("2025-03-01") / 1000) },
                    system: 7,
                },
            },
            {
                $group: {
                    _id: {
                        date: { $substrCP: ["$logTimeStamp", 0, 10] },
                        appType: "$system",
                        operatorId: "$call.operatorId",
                        playerId: "$call.playerId",
                        gameId: "$call.gameTypeId",
                        roundId: "$call.gameRoundId",
                    },
                    currency: { $first: "$call.currency" },
                    requests: { $sum: 1 },
                    stake: { $sum: { $toDouble: "$call.amount" } },
                },
            },
            {
                $group: {
                    _id: {
                        date: "$_id.date",
                        appType: "$_id.appType",
                        playerId: "$_id.playerId",
                        operatorId: "$_id.operatorId",
                        gameId: "$_id.gameId",
                    },
                    stake: { $sum: "$stake" },
                    requests: { $sum: "$requests" },
                    tickets: { $sum: 1 },
                    currency: { $first: "$currency" },
                },
            },
            {
                $set: {
                    _id: "$$REMOVE",
                    date: "$_id.date",
                    appType: "$_id.appType",
                    playerId: "$_id.playerId",
                    operatorId: "$_id.operatorId",
                    gameId: "$_id.gameId",
                },
            },
        ])
        .toArray(),
);
