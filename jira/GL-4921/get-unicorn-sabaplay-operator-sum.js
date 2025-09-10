// @ts-check

(async () => {
    await Promise.allSettled(
        [l2_pro, l4_pro].map(async (dbs) => {
            const data = (
                await dbs.summary.daily_summaries.aggregate([
                    {
                        $match: {
                            operatorId: "SabaPlay",
                            siteId: "10000178",
                            time: { $gte: new Date(Math.floor((Date.now() - 30 * 24 * 3600_000) / (24 * 3600_000)) * 24 * 3600_000) },
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
                    { $sort: { gameId: 1 } },
                ])
            ).toArray();

            console.log(dbs);
            console.log(JSON.stringify(data));
        }),
    );
})();
