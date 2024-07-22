{
    const db = l1_pro_arc.minigame_arc;

    console.table(
        db.colorgame_rounds_bk
            .aggregate([
                { $match: { time: { $gte: ISODate("2024-04-01") } } },
                {
                    $group: {
                        _id: "",
                        yellow: { $sum: { $toInt: "$settlementResult.yellow" } },
                        red: { $sum: { $toInt: "$settlementResult.red" } },
                        pink: { $sum: { $toInt: "$settlementResult.pink" } },
                        white: { $sum: { $toInt: "$settlementResult.white" } },
                        blue: { $sum: { $toInt: "$settlementResult.blue" } },
                        green: { $sum: { $toInt: "$settlementResult.green" } },
                        hot: { $sum: { $toInt: "$settlementResult.hot" } },
                        cold: { $sum: { $toInt: "$settlementResult.cold" } },
                    },
                },
            ])
            .toArray()
    );

    console.table(
        db.colorgame_rounds_bk
            .aggregate([
                { $match: { time: { $gte: ISODate("2024-04-01") } } },
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
                { $match: { time: { $gte: ISODate("2024-04-01") } } },
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
                { $match: { time: { $gte: ISODate("2024-04-01") } } },
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
    const coll = db.colorgame_bets_bk;

    const result = coll
        .aggregate([
            {
                $match: {
                    time: { $gte: ISODate("2024-04-01") },
                    currency: { $ne: "UUS" },
                    paid: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    yellow: 1,
                    red: 1,
                    pink: 1,
                    white: 1,
                    blue: 1,
                    green: 1,
                    hot: 1,
                    cold: 1,
                    betwin: 1,
                    currency: 1,
                    roundId: 1,
                    odds: 1,
                    stake: { $sum: ["$yellow", "$red", "$pink", "$white", "$blue", "$green", "$hot", "$cold"] },
                },
            },
            {
                $lookup: {
                    from: "colorgame_rounds_bk",
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
                                                            { case: { $eq: ["$$entry.v", 0] }, then: { yellow: 1 } },
                                                            { case: { $eq: ["$$entry.v", 1] }, then: { red: 1 } },
                                                            { case: { $eq: ["$$entry.v", 2] }, then: { pink: 1 } },
                                                            { case: { $eq: ["$$entry.v", 3] }, then: { white: 1 } },
                                                            { case: { $eq: ["$$entry.v", 4] }, then: { blue: 1 } },
                                                            { case: { $eq: ["$$entry.v", 5] }, then: { green: 1 } },
                                                        ],
                                                    },
                                                },
                                            },
                                        },
                                        initialValue: { yellow: 0, red: 0, pink: 0, white: 0, blue: 0, green: 0 },
                                        in: {
                                            yellow: { $add: ["$$value.yellow", { $ifNull: ["$$this.yellow", 0] }] },
                                            red: { $add: ["$$value.red", { $ifNull: ["$$this.red", 0] }] },
                                            pink: { $add: ["$$value.pink", { $ifNull: ["$$this.pink", 0] }] },
                                            white: { $add: ["$$value.white", { $ifNull: ["$$this.white", 0] }] },
                                            blue: { $add: ["$$value.blue", { $ifNull: ["$$this.blue", 0] }] },
                                            green: { $add: ["$$value.green", { $ifNull: ["$$this.green", 0] }] },
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
                        yellow: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$r.result.yellow", 1] }, then: "$odds.single" },
                                    { case: { $eq: ["$r.result.yellow", 2] }, then: "$odds.double" },
                                    { case: { $eq: ["$r.result.yellow", 3] }, then: "$odds.triple" },
                                ],
                                default: 0,
                            },
                        },
                        red: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$r.result.red", 1] }, then: "$odds.single" },
                                    { case: { $eq: ["$r.result.red", 2] }, then: "$odds.double" },
                                    { case: { $eq: ["$r.result.red", 3] }, then: "$odds.triple" },
                                ],
                                default: 0,
                            },
                        },
                        pink: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$r.result.pink", 1] }, then: "$odds.single" },
                                    { case: { $eq: ["$r.result.pink", 2] }, then: "$odds.double" },
                                    { case: { $eq: ["$r.result.pink", 3] }, then: "$odds.triple" },
                                ],
                                default: 0,
                            },
                        },
                        white: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$r.result.white", 1] }, then: "$odds.single" },
                                    { case: { $eq: ["$r.result.white", 2] }, then: "$odds.double" },
                                    { case: { $eq: ["$r.result.white", 3] }, then: "$odds.triple" },
                                ],
                                default: 0,
                            },
                        },
                        blue: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$r.result.blue", 1] }, then: "$odds.single" },
                                    { case: { $eq: ["$r.result.blue", 2] }, then: "$odds.double" },
                                    { case: { $eq: ["$r.result.blue", 3] }, then: "$odds.triple" },
                                ],
                                default: 0,
                            },
                        },
                        green: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$r.result.green", 1] }, then: "$odds.single" },
                                    { case: { $eq: ["$r.result.green", 2] }, then: "$odds.double" },
                                    { case: { $eq: ["$r.result.green", 3] }, then: "$odds.triple" },
                                ],
                                default: 0,
                            },
                        },
                        hot: { $cond: ["$r.settlementResult.hot", "$odds.hot", 0] },
                        cold: { $cond: ["$r.settlementResult.cold", "$odds.cold", 0] },
                    },
                },
            },
            {
                $set: {
                    yellowWin: { $multiply: ["$yellow", "$winRate.yellow"] },
                    redWin: { $multiply: ["$red", "$winRate.red"] },
                    pinkWin: { $multiply: ["$pink", "$winRate.pink"] },
                    whiteWin: { $multiply: ["$white", "$winRate.white"] },
                    blueWin: { $multiply: ["$blue", "$winRate.blue"] },
                    greenWin: { $multiply: ["$green", "$winRate.green"] },
                    hotWin: { $multiply: ["$hot", "$winRate.hot"] },
                    coldWin: { $multiply: ["$cold", "$winRate.cold"] },
                },
            },

            // { $limit: 10 },
            {
                $group: {
                    _id: "$currency",
                    yellow: { $sum: "$yellow" },
                    red: { $sum: "$red" },
                    pink: { $sum: "$pink" },
                    white: { $sum: "$white" },
                    blue: { $sum: "$blue" },
                    green: { $sum: "$green" },
                    hot: { $sum: "$hot" },
                    cold: { $sum: "$cold" },
                    yellowWin: { $sum: "$yellowWin" },
                    redWin: { $sum: "$redWin" },
                    pinkWin: { $sum: "$pinkWin" },
                    whiteWin: { $sum: "$whiteWin" },
                    blueWin: { $sum: "$blueWin" },
                    greenWin: { $sum: "$greenWin" },
                    hotWin: { $sum: "$hotWin" },
                    coldWin: { $sum: "$coldWin" },
                    yellowCount: { $sum: { $toInt: { $gt: ["$yellow", 0] } } },
                    redCount: { $sum: { $toInt: { $gt: ["$red", 0] } } },
                    pinkCount: { $sum: { $toInt: { $gt: ["$pink", 0] } } },
                    whiteCount: { $sum: { $toInt: { $gt: ["$white", 0] } } },
                    blueCount: { $sum: { $toInt: { $gt: ["$blue", 0] } } },
                    greenCount: { $sum: { $toInt: { $gt: ["$green", 0] } } },
                    hotCount: { $sum: { $toInt: { $gt: ["$hot", 0] } } },
                    coldCount: { $sum: { $toInt: { $gt: ["$cold", 0] } } },
                    stake: { $sum: "$stake" },
                    win: { $sum: "$betwin" },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    choices: [
                        { currency: "$_id", choice: "yellow", bet: "$yellow", win: "$yellowWin", count: "$yellowCount" },
                        { currency: "$_id", choice: "red", bet: "$red", win: "$redWin", count: "$redCount" },
                        { currency: "$_id", choice: "pink", bet: "$pink", win: "$pinkWin", count: "$pinkCount" },
                        { currency: "$_id", choice: "white", bet: "$white", win: "$whiteWin", count: "$whiteCount" },
                        { currency: "$_id", choice: "blue", bet: "$blue", win: "$blueWin", count: "$blueCount" },
                        { currency: "$_id", choice: "green", bet: "$green", win: "$greenWin", count: "$greenCount" },
                        { currency: "$_id", choice: "hot", bet: "$hot", win: "$hotWin", count: "$hotCount" },
                        { currency: "$_id", choice: "cold", bet: "$cold", win: "$coldWin", count: "$coldCount" },
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
