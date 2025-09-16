// @ts-check

(async () => {
    await Promise.allSettled(
        [l2_pro_arc, l4_pro_arc].map(async (dbs) => {
            const data = (
                await dbs.summary_arc.daily_summaries_bk.aggregate([
                    {
                        $match: {
                            $expr: {
                                $not: { $and: [{ $eq: ["$operatorId", "SabaPlay"] }, { $eq: ["$siteId", "10000178"] }] },
                            },
                            time: { $gte: ISODate("2025-06-01"), $lt: ISODate("2025-09-01") },
                            currency: { $nin: ["UUS"] },
                        },
                    },
                    {
                        $group: {
                            _id: "$gameId",
                            playerIds: { $addToSet: "$playerIds" },
                            tickets: { $sum: "$tickets" },
                            stake: { $sum: "$USD.stake" },
                            winloss: { $sum: "$USD.winloss" },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            gameId: "$_id",
                            players: {
                                $size: {
                                    $reduce: {
                                        input: "$playerIds",
                                        initialValue: [],
                                        in: { $setUnion: ["$$value", "$$this"] },
                                    },
                                },
                            },
                            tickets: "$tickets",
                            stake: { $toDouble: "$stake" },
                            winloss: { $toDouble: "$winloss" },
                        },
                    },
                    {
                        $lookup: {
                            from: "game_configs",
                            localField: "gameId",
                            foreignField: "gameId",
                            pipeline: [{ $project: { _id: 0, name: 1, type: 1 } }],
                            as: "gameName",
                        },
                    },
                    { $unwind: { path: "$gameName", preserveNullAndEmptyArrays: true } },
                    {
                        $set: {
                            gameName: { $ifNull: ["$gameName.name", { $concat: ["game#", { $toString: "$gameId" }] }] },
                            gameType: { $ifNull: ["$gameName.type", "-"] },
                        },
                    },
                    { $sort: { gameId: 1 } },
                ])
            ).toArray();

            console.log(dbs);
            console.log(JSON.stringify(data));
        }),
    );
})();
