{
    const db = l1_pro_arc.summary_arc;

    const data = db
        .getCollection("daily_statements_bk")
        .aggregate([
            { $match: { currency: { $ne: "UUS" }, gameId: { $in: [95, 96] }, time: { $lt: ISODate("2024-09-25") } } },
            {
                $group: {
                    _id: { playerId: "$playerId", operatorId: "$operatorId" },
                    currency: { $first: "$currency" },
                },
            },
            {
                $lookup: {
                    from: "daily_statements_bk",
                    localField: "_id.playerId",
                    foreignField: "playerId",
                    let: { operatorId: "$_id.operatorId" },
                    pipeline: [
                        {
                            $match: {
                                time: { $gte: ISODate("2024-08-26"), $lt: ISODate("2024-09-10") },
                                $expr: { $eq: ["$operatorId", "$$operatorId"] },
                            },
                        },
                        {
                            $group: {
                                _id: "$gameId",
                                tickets: { $sum: "$tickets" },
                                stake: { $sum: "$USD.stake" },
                                winloss: { $sum: "$USD.winloss" },
                            },
                        },
                        {
                            $lookup: {
                                from: "game_configs_bk",
                                localField: "_id",
                                foreignField: "gameId",
                                as: "__g",
                            },
                        },
                        { $unwind: "$__g" },
                        {
                            $project: {
                                _id: 0,
                                gameId: "$_id",
                                name: "$__g.name",
                                tickets: 1,
                                stake: { $round: ["$stake", 4] },
                                winloss: { $round: ["$winloss", 4] },
                            },
                        },
                        { $sort: { gameId: 1 } },
                    ],
                    as: "_before",
                },
            },
            {
                $lookup: {
                    from: "daily_statements_bk",
                    localField: "_id.playerId",
                    foreignField: "playerId",
                    let: { operatorId: "$_id.operatorId" },
                    pipeline: [
                        {
                            $match: {
                                time: { $gte: ISODate("2024-09-10"), $lt: ISODate("2024-09-25") },
                                $expr: { $eq: ["$operatorId", "$$operatorId"] },
                            },
                        },
                        {
                            $group: {
                                _id: "$gameId",
                                tickets: { $sum: "$tickets" },
                                stake: { $sum: "$USD.stake" },
                                winloss: { $sum: "$USD.winloss" },
                            },
                        },
                        {
                            $lookup: {
                                from: "game_configs_bk",
                                localField: "_id",
                                foreignField: "gameId",
                                as: "__g",
                            },
                        },
                        { $unwind: "$__g" },
                        {
                            $project: {
                                _id: 0,
                                gameId: "$_id",
                                name: "$__g.name",
                                tickets: 1,
                                stake: { $round: ["$stake", 4] },
                                winloss: { $round: ["$winloss", 4] },
                            },
                        },
                        { $sort: { gameId: 1 } },
                    ],
                    as: "_after",
                },
            },
            {
                $group: {
                    _id: { $size: "$_before" },
                    players: { $addToSet: "$$ROOT" },
                },
            },
            { $set: { size: { $size: "$players" } } },
            { $sort: { _id: 1 } },
        ])
        .toArray();

    data;
}
