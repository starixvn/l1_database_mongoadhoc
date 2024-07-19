{
    const db = l2_pro.minigame;

    const data = db.currency_groups
        .aggregate(
            [
                // { $match: { name: { $in: ["Cash_Thai", "Cash_Korea", "Cash_0.1Base"] } } },
                { $match: { name: "Cash_10Base" } },
                { $project: { _id: 0, name: 1, groupId: "$_id", operatorId: "$partnerId" } },
                {
                    $lookup: {
                        from: "currencies",
                        localField: "groupId",
                        foreignField: "groupId",
                        as: "c",
                        pipeline: [{ $match: { enabled: true, isTest: false } }, { $project: { _id: 0, name: 1, multiplier: 1 } }],
                    },
                },
                { $unwind: "$c" },
                { $set: { c: "$$REMOVE", groupId: "$$REMOVE", currency: "$c.name", multiplier: "$c.multiplier" } },
                {
                    $lookup: {
                        from: "ticket_silos",
                        let: { operatorId: "$operatorId", currency: "$currency" },
                        pipeline: [
                            {
                                $match: {
                                    time: { $gte: ISODate("2024-05-01"), $lt: ISODate("2024-06-01") },
                                    gameId: { $in: [29, 38, 46, 47, 49, 62, 63, 64, 65, 68, 69, 66, 70, 74, 76] },
                                    $expr: {
                                        $and: [{ $eq: ["$operatorId", "$$operatorId"] }, { $eq: ["$currency", "$$currency"] }],
                                    },
                                },
                            },
                            { $project: { _id: 0, gameId: 1, tickets: 1, stake: 1, payout: 1, refund: 1, winloss: 1 } },
                        ],
                        as: "t",
                    },
                },
                { $unwind: "$t" },
                {
                    $bucket: {
                        groupBy: "$t.stake",
                        boundaries: [0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000],
                        default: "other",
                        output: {
                            i: { $push: "$$ROOT" },
                        },
                    },
                },
                { $unwind: "$i" },
                {
                    $group: {
                        _id: { bucket: "$_id", currencyGroup: "$i.name" },
                        count: { $sum: 1 },
                        tickets: { $sum: "$i.t.tickets" },
                        stake: { $sum: "$i.t.stake" },
                        payout: { $sum: "$i.t.payout" },
                        winloss: { $sum: "$i.t.winloss" },
                    },
                },
                { $set: { _id: "$$REMOVE", bucket: "$_id.bucket", currencyGroup: "$_id.currencyGroup" } },
                { $sort: { bucket: 1 } },
            ],
            { allowDiskUse: true }
        )
        .toArray();

    console.table(data);
    console.log(JSON.stringify(data));
}
