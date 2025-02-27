JSON.stringify(
    l1_pro_arc.minigame_arc.xocxoc_phiens_bk
        .aggregate(
            [
                {
                    $match: {
                        time: { $gte: ISODate("2024-12-01"), $lt: ISODate("2025-01-01") },
                    },
                },
                {
                    $group: {
                        _id: null,
                        red: {
                            $sum: {
                                $add: [
                                    { $toInt: "$result.red1" },
                                    { $toInt: "$result.red2" },
                                    { $toInt: "$result.red3" },
                                    { $toInt: "$result.red4" },
                                ],
                            },
                        },
                        white: {
                            $sum: {
                                $add: [
                                    { $toInt: { $not: "$result.red1" } },
                                    { $toInt: { $not: "$result.red2" } },
                                    { $toInt: { $not: "$result.red3" } },
                                    { $toInt: { $not: "$result.red4" } },
                                ],
                            },
                        },
                        odd: { $sum: { $toInt: "$settlementResult.odd" } },
                        even: { $sum: { $toInt: "$settlementResult.even" } },
                        red2: { $sum: { $toInt: "$settlementResult.red2" } },
                        red3: { $sum: { $toInt: "$settlementResult.red3" } },
                        red4: { $sum: { $toInt: "$settlementResult.red4" } },
                        white3: { $sum: { $toInt: "$settlementResult.white3" } },
                        white4: { $sum: { $toInt: "$settlementResult.white4" } },
                        cnt: { $sum: 1 },
                    },
                },
            ],
            {},
            null,
        )
        .toArray(),
);

JSON.stringify(
    l1_pro_arc.minigame_arc.vipsedie_phiens_bk
        .aggregate(
            [
                {
                    $match: {
                        time: { $gte: ISODate("2024-09-01"), $lt: ISODate("2025-01-01") },
                    },
                },
                {
                    $group: {
                        _id: null,
                        red: {
                            $sum: {
                                $add: [
                                    { $toInt: "$result.red1" },
                                    { $toInt: "$result.red2" },
                                    { $toInt: "$result.red3" },
                                    { $toInt: "$result.red4" },
                                ],
                            },
                        },
                        white: {
                            $sum: {
                                $add: [
                                    { $toInt: { $not: "$result.red1" } },
                                    { $toInt: { $not: "$result.red2" } },
                                    { $toInt: { $not: "$result.red3" } },
                                    { $toInt: { $not: "$result.red4" } },
                                ],
                            },
                        },
                        odd: { $sum: { $toInt: "$settlementResult.odd" } },
                        even: { $sum: { $toInt: "$settlementResult.even" } },
                        red2: { $sum: { $toInt: "$settlementResult.red2" } },
                        red3: { $sum: { $toInt: "$settlementResult.red3" } },
                        red4: { $sum: { $toInt: "$settlementResult.red4" } },
                        white3: { $sum: { $toInt: "$settlementResult.white3" } },
                        white4: { $sum: { $toInt: "$settlementResult.white4" } },
                        cnt: { $sum: 1 },
                    },
                },
            ],
            {},
            null,
        )
        .toArray(),
);
