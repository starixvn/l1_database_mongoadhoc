{
    const LOOKUP_USER = "__user";
    const LOOKUP_CURRENCY = "__currency";
    const LOOKUP_EXCHANGE = "__exchange";

    [sn_pro].forEach((dbs) => {
        const log = (...args) => console.log(new Date().toISOString(), dbs, ...args);

        log(
            dbs.minigame.ticket_silos
                .aggregate([
                    { $match: { $or: [{ "USD.stake": null }, { currencyGroupId: null }] } },

                    {
                        $lookup: {
                            from: "user_silos",
                            localField: "playerId",
                            foreignField: "playerId",
                            let: { operatorId: "$operatorId", playerId: "$playerId" },
                            pipeline: [
                                { $match: { $expr: { $and: [{ $eq: ["$operatorId", "$$operatorId"] }, { $eq: ["$playerId", "$$playerId"] }] } } },
                                { $project: { _id: 0, currencyGroupId: 1, siteName: 1 } },
                                { $limit: 1 },
                            ],
                            as: LOOKUP_USER,
                        },
                    },
                    { $unwind: { path: `$${LOOKUP_USER}`, preserveNullAndEmptyArrays: true } },
                    { $set: { currencyGroupId: `$${LOOKUP_USER}.currencyGroupId`, siteName: `$${LOOKUP_USER}.siteName`, [LOOKUP_USER]: "$$REMOVE" } },

                    {
                        $lookup: {
                            from: "currencies",
                            localField: "currency",
                            foreignField: "name",
                            let: { operatorId: "$operatorId", currency: "$currency" },
                            pipeline: [
                                { $match: { $expr: { $and: [{ $eq: ["$name", "$$currency"] }, { $eq: ["$partnerId", "$$operatorId"] }] } } },
                                { $project: { _id: 0, code: 1, multiplier: 1, isTest: 1 } },
                                { $limit: 1 },
                            ],
                            as: LOOKUP_CURRENCY,
                        },
                    },
                    { $unwind: { path: `$${LOOKUP_CURRENCY}`, preserveNullAndEmptyArrays: true } },
                    {
                        $set: {
                            code: `$${LOOKUP_CURRENCY}.code`,
                            isTest: { $toInt: `$${LOOKUP_CURRENCY}.isTest` },
                            __multiplier: `$${LOOKUP_CURRENCY}.multiplier`,
                            [LOOKUP_CURRENCY]: "$$REMOVE",
                        },
                    },

                    { $set: { roundTime: { $ifNull: ["$roundTime", "$time"] } } },
                    { $set: { __date: { $dateFromParts: { year: { $year: "$roundTime" }, month: { $month: "$roundTime" }, day: { $dayOfMonth: "$roundTime" } } } } },
                    {
                        $lookup: {
                            from: "exchange_silos",
                            localField: "__date",
                            foreignField: "time",
                            let: { time: "$__date", code: "$code" },
                            pipeline: [
                                { $match: { $expr: { $and: [{ $eq: ["$time", "$$time"] }, { $eq: ["$code", "$$code"] }] } } }, //
                                { $project: { _id: 0, USD: 1, VND: 1 } },
                                { $limit: 1 },
                            ],
                            as: LOOKUP_EXCHANGE,
                        },
                    },
                    { $unwind: { path: `$${LOOKUP_EXCHANGE}`, preserveNullAndEmptyArrays: true } },
                    { $set: { __USD: `$${LOOKUP_EXCHANGE}.USD`, __VND: `$${LOOKUP_EXCHANGE}.VND`, [LOOKUP_EXCHANGE]: "$$REMOVE" } },

                    {
                        $project: {
                            _id: 1,
                            roundTime: 1,
                            currencyGroupId: 1,
                            siteName: 1,
                            code: 1,
                            isTest: 1,
                            "USD.stake": { $round: [{ $multiply: ["$stake", "$__multiplier", "$__USD"] }, 4] },
                            "USD.payout": { $round: [{ $multiply: ["$payout", "$__multiplier", "$__USD"] }, 4] },
                            "USD.refund": { $round: [{ $multiply: ["$refund", "$__multiplier", "$__USD"] }, 4] },
                            "VND.stake": { $round: [{ $multiply: ["$stake", "$__multiplier", "$__VND"] }, 4] },
                            "VND.payout": { $round: [{ $multiply: ["$payout", "$__multiplier", "$__VND"] }, 4] },
                            "VND.refund": { $round: [{ $multiply: ["$refund", "$__multiplier", "$__VND"] }, 4] },
                        },
                    },
                    {
                        $set: {
                            "USD.winloss": { $round: [{ $subtract: ["$USD.payout", "$USD.stake"] }, 4] },
                            "VND.winloss": { $round: [{ $subtract: ["$VND.payout", "$VND.stake"] }, 4] },
                        },
                    },
                    {
                        $set: {
                            "USD.win": { $round: [{ $max: ["$USD.winloss", 0] }, 4] },
                            "USD.loss": { $round: [{ $min: ["$USD.winloss", 0] }, 4] },
                            "VND.win": { $round: [{ $max: ["$VND.winloss", 0] }, 4] },
                            "VND.loss": { $round: [{ $min: ["$VND.winloss", 0] }, 4] },
                        },
                    },

                    // { $limit: 100 },
                    { $merge: { into: "ticket_silos" } },
                ])
                .toArray()
        );

        log(dbs.minigame.ticket_silos.countDocuments({ "USD.stake": null }));
    });
}
