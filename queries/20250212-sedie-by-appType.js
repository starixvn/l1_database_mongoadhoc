JSON.stringify(
    l1_pro_arc.log_arc.bets_bk
        .aggregate([
            { $match: { _id: { $gt: ObjectId.createFromTime(ISODate("2025-01-01") / 1000) }, "call.gameTypeId": 2 } },
            {
                $group: {
                    _id: {
                        date: { $substrCP: ["$logTimeStamp", 0, 10] },
                        appType: "$system",
                        choiceId: "$call.choiceId",
                        playerId: "$call.playerId",
                        roundId: "$call.gameRoundId",
                    },
                    requests: { $sum: 1 },
                    stake: { $sum: { $toDouble: "$call.amount" } },
                },
            },
            {
                $group: {
                    _id: { date: "$_id.date", appType: "$_id.appType", choiceId: "$_id.choiceId" },
                    stake: { $sum: "$stake" },
                    requests: { $sum: "$requests" },
                    tickets: { $sum: 1 },
                },
            },
            { $set: { _id: "$$REMOVE", date: "$_id.date", appType: "$_id.appType", choiceId: "$_id.choiceId" } },
        ])
        .toArray(),
);
