// VG new rate = VG old rate / USD rate
Promise.allSettled(
    [l2_sit].map(async (dbs) => {
        const db = dbs.minigame;

        console.log(
            dbs,
            await (
                await db.exchange_rates.aggregate(
                    /** @type {CollectionAggregationPipeline} */ ([
                        { $match: { "code.VND": 1 } }, //-
                        {
                            $project: {
                                _id: 1,
                                "__archive.code": "$code",
                                code: { $arrayToObject: { $map: { input: { $objectToArray: "$code" }, as: "c", in: { k: "$$c.k", v: { $divide: ["$$c.v", "$code.USD"] } } } } },
                            },
                        },
                        { $merge: { into: "exchange_rates" } },
                    ]),
                )
            ).toArray(),
        );
    }),
);
