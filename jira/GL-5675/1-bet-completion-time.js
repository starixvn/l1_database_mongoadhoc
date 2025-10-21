Promise.all(
    [
        // { dbs: l1, dbsArc: l1, system: "SG" }, // -
        // { dbs: l2, dbsArc: l2, system: "VG" },
        { dbs: l1_pro, dbsArc: l1_pro_arc, system: "SG" },
        { dbs: l2_pro, dbsArc: l2_pro_arc, system: "VG" },
    ].map(async ({ dbsArc, system }) => {
        const __start = Date.now();

        const bucketStage = {
            $bucket: {
                groupBy: "$duration",
                boundaries: [0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1_000, 2_000, 5_000, 10_000, 1_000_000_000],
                default: "invalid",
                output: {
                    count: { $sum: 1 },
                    month: { $first: "$month" },
                },
            },
        };
        const gameIds = dbs.minigame.game_configs
            .find({ type: { $in: [2, 3] } }, { _id: 0, gameId: 1 })
            .map(({ gameId }) => gameId)
            .toArray();
        const pipeline = /** @type { CollectionAggregationPipeline } */ ([
            {
                $match: {
                    requestTimeStamp: { $gte: "2025-01-01" },
                    "call.gameTypeId": { $in: gameIds },
                },
            }, // -
            {
                $project: {
                    _id: 0,
                    month: { $dateTrunc: { date: { $toDate: "$requestTimeStamp" }, unit: "month" } },
                    duration: {
                        $dateDiff: {
                            startDate: { $toDate: "$requestTimeStamp" },
                            endDate: { $toDate: "$logTimeStamp" },
                            unit: "millisecond",
                        },
                    },
                },
            },
            {
                $facet: {
                    Jan2025: [{ $match: { month: ISODate("2025-01-01") } }, bucketStage],
                    Feb2025: [{ $match: { month: ISODate("2025-02-01") } }, bucketStage],
                    Mar2025: [{ $match: { month: ISODate("2025-03-01") } }, bucketStage],
                    Apr2025: [{ $match: { month: ISODate("2025-04-01") } }, bucketStage],
                    May2025: [{ $match: { month: ISODate("2025-05-01") } }, bucketStage],
                    Jun2025: [{ $match: { month: ISODate("2025-06-01") } }, bucketStage],
                    Jul2025: [{ $match: { month: ISODate("2025-07-01") } }, bucketStage],
                    Aug2025: [{ $match: { month: ISODate("2025-08-01") } }, bucketStage],
                    Sep2025: [{ $match: { month: ISODate("2025-09-01") } }, bucketStage],
                    Oct2025: [{ $match: { month: ISODate("2025-10-01") } }, bucketStage],
                    Nov2025: [{ $match: { month: ISODate("2025-11-01") } }, bucketStage],
                    Dec2025: [{ $match: { month: ISODate("2025-12-01") } }, bucketStage],
                },
            },
            {
                $project: {
                    obj: { $objectToArray: "$$ROOT" },
                },
            },
            { $unwind: "$obj" },
            { $unwind: "$obj.v" },
            { $replaceWith: "$obj.v" },
            { $set: { system: { $literal: system } } },
        ]);

        const result = dbsArc.log_arc.bets_bk.aggregate(pipeline).toArray();

        console.table(result);
        console.log(JSON.stringify(result));

        return Date.now() - __start;
    }),
);
