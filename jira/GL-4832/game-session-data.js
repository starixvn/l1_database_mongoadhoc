Promise.allSettled(
    [l1_pro, l2_pro].map(async (dbs) => {
        const data = await dbs.minigame.user_game_sessions
            .aggregate(
                /** @type { CollectionAggregationPipeline } */ ([
                    { $match: { currencyName: { $ne: "UUS" } } }, // -
                    {
                        $project: {
                            _id: 0,
                            gameId: 1,
                            playerId: 1,
                            operatorId: 1,
                            signInGameTime: 1,
                            signOutGameTime: 1,
                            duration: { $dateDiff: { startDate: "$signInGameTime", endDate: "$signOutGameTime", unit: "second" } },
                        },
                    },
                    {
                        $lookup: {
                            from: "ticket_silos",
                            localField: "gameId",
                            foreignField: "gameId",
                            let: {
                                playerId: "$playerId",
                                operatorId: "$operatorId",
                                fromTime: "$signInGameTime",
                                toTime: "$signOutGameTime",
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$operatorId", "$$operatorId"] }, // -
                                                { $eq: ["$playerId", "$$playerId"] },
                                                { $gte: ["$time", "$$fromTime"] },
                                                { $lt: ["$time", "$$toTime"] },
                                            ],
                                        },
                                    },
                                },
                                { $group: { _id: 0, tickets: { $sum: 1 }, stake: { $sum: "$USD.stake" }, payout: { $sum: "$USD.payout" } } },
                                { $set: { _id: "$$REMOVE" } },
                            ],
                            as: "tickets",
                        },
                    },
                    { $unwind: { path: "$tickets", preserveNullAndEmptyArrays: true } },
                    {
                        $group: {
                            _id: "$gameId",
                            count: { $sum: 1 },

                            duration_AVG: { $avg: "$duration" },
                            duration_MED: { $median: { input: "$duration", method: "approximate" } },
                            duration_STD: { $stdDevPop: "$duration" },
                            duration_MIN: { $min: "$duration" },
                            duration_MAX: { $max: "$duration" },

                            tickets_AVG: { $avg: "$tickets.tickets" },
                            tickets_MED: { $median: { input: "$tickets.tickets", method: "approximate" } },
                            tickets_STD: { $stdDevPop: "$tickets.tickets" },
                            tickets_MIN: { $min: "$tickets.tickets" },
                            tickets_MAX: { $max: "$tickets.tickets" },

                            stake_AVG: { $avg: "$tickets.stake" },
                            stake_MED: { $median: { input: "$tickets.stake", method: "approximate" } },
                            stake_STD: { $stdDevPop: "$tickets.stake" },
                            stake_MIN: { $min: "$tickets.stake" },
                            stake_MAX: { $max: "$tickets.stake" },

                            payout_AVG: { $avg: "$tickets.payout" },
                            payout_MED: { $median: { input: "$tickets.payout", method: "approximate" } },
                            payout_STD: { $stdDevPop: "$tickets.payout" },
                            payout_MIN: { $min: "$tickets.payout" },
                            payout_MAX: { $max: "$tickets.payout" },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            gameId: "$_id",
                            count: 1,
                            duration_AVG: { $toDouble: { $round: ["$duration_AVG", 2] } },
                            duration_MED: { $toDouble: { $round: ["$duration_MED", 2] } },
                            duration_STD: { $toDouble: { $round: ["$duration_STD", 2] } },
                            duration_MIN: { $toDouble: { $round: ["$duration_MIN", 2] } },
                            duration_MAX: { $toDouble: { $round: ["$duration_MAX", 2] } },

                            tickets_AVG: { $toDouble: { $round: ["$tickets_AVG", 2] } },
                            tickets_MED: { $toDouble: { $round: ["$tickets_MED", 2] } },
                            tickets_STD: { $toDouble: { $round: ["$tickets_STD", 2] } },
                            tickets_MIN: { $toDouble: { $round: ["$tickets_MIN", 2] } },
                            tickets_MAX: { $toDouble: { $round: ["$tickets_MAX", 2] } },

                            stake_AVG: { $toDouble: { $round: ["$stake_AVG", 2] } },
                            stake_MED: { $toDouble: { $round: ["$stake_MED", 2] } },
                            stake_STD: { $toDouble: { $round: ["$stake_STD", 2] } },
                            stake_MIN: { $toDouble: { $round: ["$stake_MIN", 2] } },
                            stake_MAX: { $toDouble: { $round: ["$stake_MAX", 2] } },

                            payout_AVG: { $toDouble: { $round: ["$payout_AVG", 2] } },
                            payout_MED: { $toDouble: { $round: ["$payout_MED", 2] } },
                            payout_STD: { $toDouble: { $round: ["$payout_STD", 2] } },
                            payout_MIN: { $toDouble: { $round: ["$payout_MIN", 2] } },
                            payout_MAX: { $toDouble: { $round: ["$payout_MAX", 2] } },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]),
            )
            .toArray();

        console.log(dbs);
        console.table(data);
        console.log(JSON.stringify(data));
    }),
);
