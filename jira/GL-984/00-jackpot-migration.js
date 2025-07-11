{
    const db = l2_uat.minigame;

    const games = [
        { gameId: 29, name: "fourguardians" },
        { gameId: 70, name: "transformers" },
        { gameId: 74, name: "onepiece" },
        { gameId: 76, name: "dragonball" },
        { gameId: 122, name: "summerheat" },
        { gameId: 124, name: "nezhasrebellion" },
        { gameId: 133, name: "templeofcaishen" },
    ];

    games.forEach(({ gameId, name }) => {
        const result = db.jackpots.aggregate(
            /** @type {CollectionAggregationPipeline} */
            ([
                { $match: { gameId } },
                {
                    $lookup: {
                        from: "jackpot_configs",
                        localField: "gameId",
                        foreignField: "gameId",
                        pipeline: [
                            { $match: { operatorId: "ONEworksVGCash" } }, //-
                            { $project: { _id: { $toString: "$_id" } } },
                        ],
                        as: "jackpotConfigId",
                    },
                },
                { $unwind: "$jackpotConfigId" },
                { $set: { jackpotConfigId: "$jackpotConfigId._id" } },
                { $merge: { into: `${name}_jackpots` } },
            ]),
        );

        console.log(gameId, name, result);
    });

    console.log(
        "jackpot_winners_notifications",
        db.jackpots
            .aggregate(
                /** @type {CollectionAggregationPipeline} */
                ([
                    { $match: { hitAt: { $gt: 0 } } },
                    { $project: { _id: 1, gameId: 1, hitTime: 1, winnerName: 1, prize: 1, exchangeRateId: 1, amount: { $multiply: ["$amount", "$winningRatio"] } } },
                    {
                        $lookup: {
                            from: "jackpot_configs",
                            localField: "gameId",
                            foreignField: "gameId",
                            pipeline: [
                                { $match: { operatorId: "ONEworksVGCash" } }, //-
                                { $project: { _id: { $toString: "$_id" } } },
                            ],
                            as: "jackpotConfigId",
                        },
                    },
                    { $unwind: "$jackpotConfigId" },
                    { $set: { jackpotConfigId: "$jackpotConfigId._id" } },
                    { $merge: { into: "jackpot_winners_notifications" } },
                ]),
            )
            .toArray(),
    );
}
