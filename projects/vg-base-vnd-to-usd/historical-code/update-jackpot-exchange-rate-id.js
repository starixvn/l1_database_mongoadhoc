{
    const db = l2_pro.minigame;
    const backupId = ObjectId();

    db.jackpots.aggregate(
        /** @type {CollectionAggregationPipeline} */
        ([
            { $project: { _id: 0, data: "$$ROOT", backupId } }, //-
            { $merge: { into: { db: "minigame_backup", coll: "backup_jackpots" } } },
        ]),
    );

    db.jackpots.aggregate(
        /** @type {CollectionAggregationPipeline} */
        ([
            {
                $lookup: {
                    from: "exchange_rates",
                    localField: "exchangeRateId",
                    foreignField: "exId",
                    pipeline: [{ $project: { _id: 1 } }],
                    as: "ex",
                },
            }, //-
            { $unwind: { path: "$ex", preserveNullAndEmptyArrays: true } },
            { $match: { ex: null } },
            {
                $lookup: {
                    from: "exchange_rates",
                    let: { time: { $ifNull: ["$hitTime", "$createdTime", { $toString: "$_id" }] } },
                    pipeline: [
                        { $sort: { time: -1 } }, //-
                        { $match: { $expr: { $lte: ["$time", "$$time"] } } },
                        { $limit: 1 },
                        { $project: { _id: 0, exId: 1 } },
                    ],
                    as: "ex",
                },
            },
            { $unwind: { path: "$ex", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "exchange_rates",
                    pipeline: [
                        { $sort: { exId: 1 } }, //-
                        { $limit: 1 },
                        { $project: { _id: 0, exId: 1 } },
                    ],
                    as: "ex2",
                },
            },
            { $unwind: { path: "$ex2", preserveNullAndEmptyArrays: true } },
            { $project: { _id: 1, exchangeRateId: { $ifNull: ["$ex.exId", "$ex2.exId"] } } },
            { $merge: { into: "jackpots" } },
        ]),
    );
}

{
    const db = l2_pro.minigame;
    db.jackpots.aggregate(
        /** @type {CollectionAggregationPipeline} */
        ([
            {
                $lookup: {
                    from: "exchange_rates",
                    localField: "exchangeRateId",
                    foreignField: "exId",
                    pipeline: [{ $project: { _id: 1 } }],
                    as: "ex",
                },
            }, //-
            { $unwind: { path: "$ex", preserveNullAndEmptyArrays: true } },
            { $match: { ex: null } },
            {
                $lookup: {
                    from: "exchange_rates",
                    let: { time: { $ifNull: ["$hitTime", "$createdTime", { $toString: "$_id" }] } },
                    pipeline: [
                        { $sort: { time: -1 } }, //-
                        { $match: { $expr: { $lte: ["$time", "$$time"] } } },
                        { $limit: 1 },
                        { $project: { _id: 0, exId: 1 } },
                    ],
                    as: "ex",
                },
            },
            { $unwind: { path: "$ex", preserveNullAndEmptyArrays: true } },
        ]),
    );
}
