{
    const coll = l2_pro_arc.minigame_arc.getCollection("ticket_silos_bk");
    const seven = [103];
    const sedie3 = [95, 96];
    const sedies = [2, 9, 22, 24, 28];
    const bigsmalls = [1, 4, 6, 25, 50, 51, 54, 55];

    const res = coll
        .aggregate([
            {
                $match: {
                    currency: { $nin: ["UUS"] },
                    time: { $gte: ISODate("2024-11-19"), $lt: ISODate("2024-11-27") },
                },
            },
            {
                $group: {
                    _id: {
                        day: {
                            $dateFromParts: {
                                year: { $year: "$time" },
                                month: { $month: "$time" },
                                day: { $dayOfMonth: "$time" },
                            },
                        },
                        games: {
                            $switch: {
                                branches: [
                                    { case: { $in: ["$gameId", seven] }, then: "sevenupdown" },
                                    { case: { $in: ["$gameId", sedie3] }, then: "sedie3" },
                                    { case: { $in: ["$gameId", sedies] }, then: "sedies" },
                                    { case: { $in: ["$gameId", bigsmalls] }, then: "bigsmalls" },
                                ],
                                default: "others",
                            },
                        },
                    },
                    tickets: { $sum: "$tickets" },
                    stake: { $sum: "$USD.stake" },
                    winloss: { $sum: "$USD.winloss" },
                    payout: { $sum: "$USD.payout" },
                },
            },
            {
                $set: {
                    _id: "$$REMOVE",
                    day: "$_id.day",
                    games: "$_id.games",
                    stake: { $round: ["$stake", 4] },
                    winloss: { $round: ["$winloss", 4] },
                    payout: { $round: ["$payout", 4] },
                },
            },
        ])
        .toArray();

    console.log(JSON.stringify(res));
}

{
    const coll = l2_pro_arc.minigame_arc.getCollection("ticket_silos_bk");
    const seven = [103];
    const sedie3 = [95, 96];
    const sedies = [2, 9, 22, 24, 28];
    const bigsmalls = [1, 4, 6, 25, 50, 51, 54, 55];

    const res = coll
        .aggregate([
            {
                $match: {
                    currency: { $nin: ["UUS"] },
                    time: { $gte: ISODate("2024-11-19"), $lt: ISODate("2024-11-27") },
                    gameId: { $in: seven },
                },
            },
            { $group: { _id: { playerId: "$playerId", operatorId: "$operatorId" } } },
            { $replaceWith: "$_id" },
            {
                $lookup: {
                    from: "ticket_silos_bk",
                    localField: "playerId",
                    foreignField: "playerId",
                    let: { operatorId: "$operatorId" },
                    pipeline: [
                        {
                            $match: {
                                time: { $gte: ISODate("2024-11-19"), $lt: ISODate("2024-11-27") },
                                $expr: { $eq: ["$operatorId", "$$operatorId"] },
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    $switch: {
                                        branches: [
                                            { case: { $in: ["$gameId", seven] }, then: "sevenupdown" },
                                            { case: { $in: ["$gameId", sedie3] }, then: "sedie3" },
                                            { case: { $in: ["$gameId", sedies] }, then: "sedies" },
                                            { case: { $in: ["$gameId", bigsmalls] }, then: "bigsmalls" },
                                        ],
                                        default: "others",
                                    },
                                },
                                playerId: { $first: "$playerId" },
                                operatorId: { $first: "$operatorId" },
                                currency: { $first: "$currency" },
                                tickets: { $sum: "$tickets" },
                                stake: { $sum: "$USD.stake" },
                                winloss: { $sum: "$USD.winloss" },
                                payout: { $sum: "$USD.payout" },
                            },
                        },
                        {
                            $set: {
                                _id: "$$REMOVE",
                                games: "$_id",
                                stake: { $round: ["$stake", 4] },
                                winloss: { $round: ["$winloss", 4] },
                                payout: { $round: ["$payout", 4] },
                            },
                        },
                    ],
                    as: "data",
                },
            },
            { $set: { category: { $arrayElemAt: [{ $sortArray: { input: "$data", sortBy: { stake: -1 } } }, 0] } } },
            { $unwind: "$data" },
            { $set: { "data.category": "$category.games" } },
            { $replaceWith: "$data" },
        ])
        .toArray();

    console.log(JSON.stringify(res));
}

{
    const coll = l2_pro_arc.minigame_arc.getCollection("ticket_silos_bk");
    const seven = [103];
    const sedie3 = [95, 96];
    const sedies = [2, 9, 22, 24, 28];
    const bigsmalls = [1, 4, 6, 25, 50, 51, 54, 55];

    const res = coll
        .aggregate([
            {
                $match: {
                    currency: { $nin: ["UUS"] },
                    time: { $gte: ISODate("2024-11-19"), $lt: ISODate("2024-11-27") },
                },
            },
            { $group: { _id: { playerId: "$playerId", operatorId: "$operatorId" } } },
            { $replaceWith: "$_id" },
            {
                $lookup: {
                    from: "ticket_silos_bk",
                    localField: "playerId",
                    foreignField: "playerId",
                    let: { operatorId: "$operatorId" },
                    pipeline: [
                        {
                            $match: {
                                time: { $gte: ISODate("2024-11-19"), $lt: ISODate("2024-11-27") },
                                $expr: { $eq: ["$operatorId", "$$operatorId"] },
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    $switch: {
                                        branches: [
                                            { case: { $in: ["$gameId", seven] }, then: "sevenupdown" },
                                            { case: { $in: ["$gameId", sedie3] }, then: "sedie3" },
                                            { case: { $in: ["$gameId", sedies] }, then: "sedies" },
                                            { case: { $in: ["$gameId", bigsmalls] }, then: "bigsmalls" },
                                        ],
                                        default: "others",
                                    },
                                },
                                playerId: { $first: "$playerId" },
                                operatorId: { $first: "$operatorId" },
                                currency: { $first: "$currency" },
                                tickets: { $sum: "$tickets" },
                                stake: { $sum: "$USD.stake" },
                                winloss: { $sum: "$USD.winloss" },
                                payout: { $sum: "$USD.payout" },
                            },
                        },
                        {
                            $set: {
                                _id: "$$REMOVE",
                                games: "$_id",
                                stake: { $round: ["$stake", 4] },
                                winloss: { $round: ["$winloss", 4] },
                                payout: { $round: ["$payout", 4] },
                            },
                        },
                    ],
                    as: "data",
                },
            },
            { $set: { category: { $arrayElemAt: [{ $sortArray: { input: "$data", sortBy: { stake: -1 } } }, 0] } } },
            { $unwind: "$data" },
            { $set: { "data.category": "$category.games" } },
            { $replaceWith: "$data" },
        ])
        .toArray();

    // console.log(JSON.stringify(res));
    fs.writeFileSync("E:/Billy/data/sevenupdown/20241127-VG-allplayers-7U7D.json", JSON.stringify(res));
}
