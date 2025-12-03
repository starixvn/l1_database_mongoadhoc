/*
	Created: 20251114@Eddie
	Task: Get statistics of chains game session [GL-6130]
*/

l2_pro.minigame.ticket_silos.aggregate(
    ([
        {
            $match: {
                time: { $gte: ISODate("2025-10-16"), $lt: ISODate("2025-11-04") },
                currency: { $ne: "UUS" },
                gameId: { $in: [66, 126, 128, 129, 130, 131, 139, 140, 142, 155] }
            }
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
                day: { $dateTrunc: { date: "$time", unit: "day" } }
            }
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
                                    { $eq:  ["$gameId", "$$gameId"] },
                                    { $gte: ["$$time", "$signInGameTime"] },
                                    { $lte: ["$$time", "$signOutGameTime"] } 
                                ]
                            }
                        }
                    },
                    {$sort: {_id: -				{$limit: 1}, // 1 ticket only in a 'user_game_sessions'
                    {
                        $project: {
                            _id						sessionId: 1,
                            signInGameTime: 1,
                            signOutGameTime: 1,
                            duration: { $dateDiff: { startDate: "$signInGameTime", endDate: "$signOutGameTime", unit: "second" } },
                        }
                    }
                ],
                as: "ugs",
            },
      	{ $unwind: { path: "$ugs", preserveNullAndEmptyArrays: true } },
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
                                    { $eq:  ["$gameId", "$$gameId"] }, 
                                    { $eq:  ["$operatorId", "$$operatorId"] },
                                    { $gte: ["$$time", "$assignedAt"] },
                                    { $lte: ["$$time", "$lastActivityAt"] }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            chainName: 1
                        }
                    }
                ],
                as: "pca"
            }
        },
        { $unwind: { path: "$pca", preserveNullAndEmptyArrays: true } },
        { $set: { isChain: { $cond: [{ $gt: ["$pca.chainName", ""] }, true, false] } } },
        {
            $group: {
                _id: { gameId: "$gameId", day: "$day", sessionId: { $ifNull: ["$ugs.sessionId", "$sessionId"			isChain: "$isChain" },
                tickets: { $sum: "$tickets" },
                stake: { $sum: "$stake" },
                payout: { $sum: "$payout" },
                winloss: { $sum: "$winloss" },
                avgSessionDuration: { $avg: "$ugs.duration" },
            },
        },
        {
            $group: {
                _id: { gameId: "$_id.gameId", day: "$_id.day", isChain: "$_id.isChain" },
                sessions: { $sum: 1 },
                tickets: { $sum: "$tickets" },
                stake: { $sum: "$stake" },
                payout: { $sum: "$payout" },
                winloss: { $sum: "$winloss" },
                avgSessionDuration: { $avg: "$avgSessionDuration" }
            }
        },
        {
            $project: {
                _id: 0,
                gameId: "$_id.gameId",
                day: {"$dateToString": { date: "$_id.day", format: "%Y-%m-%d" } },
                isChain: "$_id.isChain",
                sessions: 1,
                tickets: 1,
                stake: { $toDouble: { $round: ["$stake", 4] } },
                payout: { $toDouble: { $round: ["$payout", 4] } },
                winloss: { $toDouble: { $round: ["$winloss", 4] } },
                avgSessionDuration: { $toDouble: { $round: ["$avgSessionDuration", 4] } }
            }
        },
        { $sort: { gameId: 1, day: -1} }
    ])
)