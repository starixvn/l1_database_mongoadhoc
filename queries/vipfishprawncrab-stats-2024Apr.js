{
    const db = l1_pro_arc.minigame_arc;
    const time = { $gte: ISODate("2024-01-01"), $lt: ISODate("2024-02-01") };

    console.table(
        db.vipfishprawncrab_phiens_bk
            .aggregate([
                { $match: { time } },
                {
                    $group: {
                        _id: "",
                        stag: { $sum: { $toInt: "$settlementResult.stag" } },
                        gourd: { $sum: { $toInt: "$settlementResult.gourd" } },
                        rooster: { $sum: { $toInt: "$settlementResult.rooster" } },
                        fish: { $sum: { $toInt: "$settlementResult.fish" } },
                        crab: { $sum: { $toInt: "$settlementResult.crab" } },
                        prawn: { $sum: { $toInt: "$settlementResult.prawn" } },
                        anyTriple: { $sum: { $toInt: "$settlementResult.anyTriple" } },
                        mountain: { $sum: { $toInt: "$settlementResult.mountain" } },
                        ocean: { $sum: { $toInt: "$settlementResult.ocean" } },
                    },
                },
            ])
            .toArray()
    );

    console.table(
        db.colorgame_rounds_bk
            .aggregate([
                { $match: { time } },
                {
                    $group: {
                        _id: "$result.dice1",
                        cnt: { $sum: 1 },
                    },
                },
            ])
            .toArray()
    );
    console.table(
        db.colorgame_rounds_bk
            .aggregate([
                { $match: { time } },
                {
                    $group: {
                        _id: "$result.dice2",
                        cnt: { $sum: 1 },
                    },
                },
            ])
            .toArray()
    );
    console.table(
        db.colorgame_rounds_bk
            .aggregate([
                { $match: { time } },
                {
                    $group: {
                        _id: "$result.dice3",
                        cnt: { $sum: 1 },
                    },
                },
            ])
            .toArray()
    );
}

{
    const db = l1_pro_arc.minigame_arc;
    const coll = db.vipfishprawncrab_cuocs_bk;
    const time = { $gte: ISODate("2024-01-01"), $lt: ISODate("2024-02-01") };

    const result = coll
        .aggregate([
            {
                $match: { time, currency: { $ne: "UUS" }, paid: true },
            },
            {
                $project: {
                    _id: 0,
                    stag: 1,
                    gourd: 1,
                    rooster: 1,
                    fish: 1,
                    crab: 1,
                    prawn: 1,
                    anyTriple: 1,
                    mountain: 1,
                    ocean: 1,
                    betwin: 1,
                    currency: 1,
                    roundId: 1,
                    odds: 1,
                    stake: { $sum: ["$stag", "$gourd", "$rooster", "$fish", "$crab", "$prawn", "$anyTriple", "$mountain", "$ocean"] },
                },
            },
            {
                $lookup: {
                    from: "vipfishprawncrab_phiens_bk",
                    localField: "roundId",
                    foreignField: "id",
                    as: "r",
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                result: {
                                    $reduce: {
                                        input: {
                                            $map: {
                                                input: { $objectToArray: "$result" },
                                                as: "entry",
                                                in: {
                                                    $switch: {
                                                        branches: [
                                                            { case: { $eq: ["$$entry.v", 0] }, then: { stag: 1 } },
                                                            { case: { $eq: ["$$entry.v", 1] }, then: { gourd: 1 } },
                                                            { case: { $eq: ["$$entry.v", 2] }, then: { rooster: 1 } },
                                                            { case: { $eq: ["$$entry.v", 3] }, then: { fish: 1 } },
                                                            { case: { $eq: ["$$entry.v", 4] }, then: { crab: 1 } },
                                                            { case: { $eq: ["$$entry.v", 5] }, then: { prawn: 1 } },
                                                        ],
                                                    },
                                                },
                                            },
                                        },
                                        initialValue: { stag: 0, gourd: 0, rooster: 0, fish: 0, crab: 0, prawn: 0 },
                                        in: {
                                            stag: { $add: ["$$value.stag", { $ifNull: ["$$this.stag", 0] }] },
                                            gourd: { $add: ["$$value.gourd", { $ifNull: ["$$this.gourd", 0] }] },
                                            rooster: { $add: ["$$value.rooster", { $ifNull: ["$$this.rooster", 0] }] },
                                            fish: { $add: ["$$value.fish", { $ifNull: ["$$this.fish", 0] }] },
                                            crab: { $add: ["$$value.crab", { $ifNull: ["$$this.crab", 0] }] },
                                            prawn: { $add: ["$$value.prawn", { $ifNull: ["$$this.prawn", 0] }] },
                                        },
                                    },
                                },
                                settlementResult: 1,
                            },
                        },
                    ],
                },
            },
            { $unwind: "$r" },
            {
                $set: {
                    odds: "$$REMOVE",
                    r: "$$REMOVE",
                    winRate: {
                        stag: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$r.result.stag", 1] }, then: "$odds.single" },
                                    { case: { $eq: ["$r.result.stag", 2] }, then: "$odds.double" },
                                    { case: { $eq: ["$r.result.stag", 3] }, then: "$odds.triple" },
                                ],
                                default: 0,
                            },
                        },
                        gourd: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$r.result.gourd", 1] }, then: "$odds.single" },
                                    { case: { $eq: ["$r.result.gourd", 2] }, then: "$odds.double" },
                                    { case: { $eq: ["$r.result.gourd", 3] }, then: "$odds.triple" },
                                ],
                                default: 0,
                            },
                        },
                        rooster: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$r.result.rooster", 1] }, then: "$odds.single" },
                                    { case: { $eq: ["$r.result.rooster", 2] }, then: "$odds.double" },
                                    { case: { $eq: ["$r.result.rooster", 3] }, then: "$odds.triple" },
                                ],
                                default: 0,
                            },
                        },
                        fish: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$r.result.fish", 1] }, then: "$odds.single" },
                                    { case: { $eq: ["$r.result.fish", 2] }, then: "$odds.double" },
                                    { case: { $eq: ["$r.result.fish", 3] }, then: "$odds.triple" },
                                ],
                                default: 0,
                            },
                        },
                        crab: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$r.result.crab", 1] }, then: "$odds.single" },
                                    { case: { $eq: ["$r.result.crab", 2] }, then: "$odds.double" },
                                    { case: { $eq: ["$r.result.crab", 3] }, then: "$odds.triple" },
                                ],
                                default: 0,
                            },
                        },
                        prawn: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$r.result.prawn", 1] }, then: "$odds.single" },
                                    { case: { $eq: ["$r.result.prawn", 2] }, then: "$odds.double" },
                                    { case: { $eq: ["$r.result.prawn", 3] }, then: "$odds.triple" },
                                ],
                                default: 0,
                            },
                        },
                        anyTriple: { $cond: ["$r.settlementResult.anyTriple", "$odds.anyTriple", 0] },
                        mountain: { $cond: ["$r.settlementResult.mountain", "$odds.mountain", 0] },
                        ocean: { $cond: ["$r.settlementResult.ocean", "$odds.ocean", 0] },
                    },
                },
            },
            {
                $set: {
                    stagWin: { $multiply: ["$stag", "$winRate.stag"] },
                    gourdWin: { $multiply: ["$gourd", "$winRate.gourd"] },
                    roosterWin: { $multiply: ["$rooster", "$winRate.rooster"] },
                    fishWin: { $multiply: ["$fish", "$winRate.fish"] },
                    crabWin: { $multiply: ["$crab", "$winRate.crab"] },
                    prawnWin: { $multiply: ["$prawn", "$winRate.prawn"] },
                    anyTripleWin: { $multiply: ["$anyTriple", "$winRate.anyTriple"] },
                    mountainWin: { $multiply: ["$mountain", "$winRate.mountain"] },
                    oceanWin: { $multiply: ["$ocean", "$winRate.ocean"] },
                },
            },

            // { $limit: 10 },
            {
                $group: {
                    _id: "$currency",
                    stag: { $sum: "$stag" },
                    gourd: { $sum: "$gourd" },
                    rooster: { $sum: "$rooster" },
                    fish: { $sum: "$fish" },
                    crab: { $sum: "$crab" },
                    prawn: { $sum: "$prawn" },
                    anyTriple: { $sum: "$anyTriple" },
                    mountain: { $sum: "$mountain" },
                    ocean: { $sum: "$ocean" },
                    stagWin: { $sum: "$stagWin" },
                    gourdWin: { $sum: "$gourdWin" },
                    roosterWin: { $sum: "$roosterWin" },
                    fishWin: { $sum: "$fishWin" },
                    crabWin: { $sum: "$crabWin" },
                    prawnWin: { $sum: "$prawnWin" },
                    anyTripleWin: { $sum: "$anyTripleWin" },
                    mountainWin: { $sum: "$mountainWin" },
                    oceanWin: { $sum: "$oceanWin" },
                    stagCount: { $sum: { $toInt: { $gt: ["$stag", 0] } } },
                    gourdCount: { $sum: { $toInt: { $gt: ["$gourd", 0] } } },
                    roosterCount: { $sum: { $toInt: { $gt: ["$rooster", 0] } } },
                    fishCount: { $sum: { $toInt: { $gt: ["$fish", 0] } } },
                    crabCount: { $sum: { $toInt: { $gt: ["$crab", 0] } } },
                    prawnCount: { $sum: { $toInt: { $gt: ["$prawn", 0] } } },
                    anyTripleCount: { $sum: { $toInt: { $gt: ["$anyTriple", 0] } } },
                    mountainCount: { $sum: { $toInt: { $gt: ["$mountain", 0] } } },
                    oceanCount: { $sum: { $toInt: { $gt: ["$ocean", 0] } } },
                    stake: { $sum: "$stake" },
                    win: { $sum: "$betwin" },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    choices: [
                        { currency: "$_id", choice: "stag", bet: "$stag", win: "$stagWin", count: "$stagCount" },
                        { currency: "$_id", choice: "gourd", bet: "$gourd", win: "$gourdWin", count: "$gourdCount" },
                        { currency: "$_id", choice: "rooster", bet: "$rooster", win: "$roosterWin", count: "$roosterCount" },
                        { currency: "$_id", choice: "fish", bet: "$fish", win: "$fishWin", count: "$fishCount" },
                        { currency: "$_id", choice: "crab", bet: "$crab", win: "$crabWin", count: "$crabCount" },
                        { currency: "$_id", choice: "prawn", bet: "$prawn", win: "$prawnWin", count: "$prawnCount" },
                        { currency: "$_id", choice: "anyTriple", bet: "$anyTriple", win: "$anyTripleWin", count: "$anyTripleCount" },
                        { currency: "$_id", choice: "mountain", bet: "$mountain", win: "$mountainWin", count: "$mountainCount" },
                        { currency: "$_id", choice: "ocean", bet: "$ocean", win: "$oceanWin", count: "$oceanCount" },
                        { currency: "$_id", choice: "TOTAL", bet: "$stake", win: "$win", count: "$count" },
                    ],
                },
            },
            { $unwind: "$choices" },
            { $replaceWith: "$choices" },
        ])
        .toArray();

    console.table(result);
    console.log(JSON.stringify(result));
}
