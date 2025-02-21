{
    const db = l2pp.minigame;
    const backupId = ObjectId();

    db.exchange_rates.aggregate(
        /** @type {CollectionAggregationPipeline} */
        ([
            { $project: { _id: 0, data: "$$ROOT", backupId } },
            { $merge: { into: { db: "minigame_backup", coll: "backup_exchange_rates" } } }, //-
        ]),
    );

    db.exchange_rates.aggregate(
        /** @type {CollectionAggregationPipeline} */
        ([
            {
                $lookup: {
                    from: "global_configs",
                    pipeline: [
                        { $match: { type: "exchange_codes" } }, //-
                        { $project: { _id: 0, base: "$base", codes: "$configs.codes" } },
                    ],
                    as: "cfg",
                },
            },
            { $unwind: "$cfg" },
            {
                $lookup: {
                    from: "exchange_silos",
                    localField: "exDate",
                    foreignField: "time",
                    let: { exDate: "$exDate", codes: "$cfg.codes", base: "$cfg.base" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$time", "$$exDate"] }, //-
                                        { $in: ["$code", "$$codes"] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                k: "$code",
                                v: { $objectToArray: { VND: "$VND", USD: "$USD" } },
                            },
                        },
                        { $unwind: "$v" },
                        { $match: { $expr: { $eq: ["$v.k", "$$base"] } } },
                        { $set: { "v.k": "v" } },
                        { $set: { v: { $arrayToObject: [["$v"]] } } },
                        { $set: { v: { $toDecimal: "$v.v" } } },
                    ],
                    as: "es",
                },
            },
            {
                $project: {
                    _id: 1,
                    code: { $mergeObjects: [{ $arrayToObject: ["$es"] }, "$code"] },
                },
            },
            { $merge: { into: "exchange_rates" } },
        ]),
    );
}
