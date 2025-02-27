{
    const db = l2_pro_arc.minigame_arc;
    const sedie3 = [95, 96];
    const sedies = [2, 9, 22, 24, 28];
    const bigsmalls = [1, 4, 6, 25, 50, 51, 54, 55];

    const data = db
        .getCollection("ticket_silos_bk")
        .aggregate([
            { $match: { currency: { $ne: "UUS" }, gameId: { $in: sedie3 }, time: { $lt: ISODate("2024-10-08") } } },
            {
                $group: {
                    _id: { playerId: "$playerId", operatorId: "$operatorId" },
                    currency: { $first: "$currency" },
                },
            },
            {
                $lookup: {
                    from: "ticket_silos_bk",
                    localField: "_id.playerId",
                    foreignField: "playerId",
                    let: { operatorId: "$_id.operatorId" },
                    pipeline: [
                        {
                            $match: {
                                time: { $gte: ISODate("2024-08-13"), $lt: ISODate("2024-09-10") },
                                $expr: { $eq: ["$operatorId", "$$operatorId"] },
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    $switch: {
                                        branches: [
                                            { case: { $in: ["$gameId", sedie3] }, then: "sedie3" },
                                            { case: { $in: ["$gameId", sedies] }, then: "sedies" },
                                            { case: { $in: ["$gameId", bigsmalls] }, then: "bigsmalls" },
                                        ],
                                        default: "others",
                                    },
                                },
                                tickets: { $sum: "$tickets" },
                                stake: { $sum: "$USD.stake" },
                                winloss: { $sum: "$USD.winloss" },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                gameId: "$_id",
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
                    from: "ticket_silos_bk",
                    localField: "_id.playerId",
                    foreignField: "playerId",
                    let: { operatorId: "$_id.operatorId" },
                    pipeline: [
                        {
                            $match: {
                                time: { $gte: ISODate("2024-09-10"), $lt: ISODate("2024-10-08") },
                                $expr: { $eq: ["$operatorId", "$$operatorId"] },
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    $switch: {
                                        branches: [
                                            { case: { $in: ["$gameId", sedie3] }, then: "sedie3" },
                                            { case: { $in: ["$gameId", sedies] }, then: "sedies" },
                                            { case: { $in: ["$gameId", bigsmalls] }, then: "bigsmalls" },
                                        ],
                                        default: "others",
                                    },
                                },
                                tickets: { $sum: "$tickets" },
                                stake: { $sum: "$USD.stake" },
                                winloss: { $sum: "$USD.winloss" },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                gameId: "$_id",
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
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $eq: [{ $size: "$_before" }, 0] }, then: "new-players" },
                                { case: { $gt: [{ $size: { $filter: { input: "$_before", as: "b", cond: { $eq: ["$$b.gameId", "sedies"] } } } }, 0] }, then: "sedies-players" },
                                { case: { $gt: [{ $size: { $filter: { input: "$_before", as: "b", cond: { $eq: ["$$b.gameId", "bigsmalls"] } } } }, 0] }, then: "bigsmalls-players" },
                                { case: { $eq: [{ $size: { $filter: { input: "$_before", as: "b", cond: { $eq: ["$$b.gameId", "sedies"] } } } }, 0] }, then: "no-sedies-players" },
                            ],
                            default: "others",
                        },
                    },
                    players: { $addToSet: "$$ROOT" },
                },
            },
            { $set: { playerCnt: { $size: "$players" } } },
        ])
        .toArray();

    fs.writeFileSync("E:/Billy/sedie3/VG-sedie-report.json", JSON.stringify(data));
}
