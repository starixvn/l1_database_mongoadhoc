JSON.stringify(
    l2_pro.minigame.jackpots
        .aggregate([
            { $project: { _id: 0, createdTime: 1, createdAt: 1, gameId: 1, prize: 1, amount: 1, exchangeRateId: 1, hitTime: 1 } },
            {
                $lookup: {
                    from: "exchange_rates",
                    localField: "exchangeRateId",
                    foreignField: "exId",
                    as: "ex",
                    pipeline: [{ $project: { _id: 0, code: 0 } }],
                },
            },
            { $unwind: "$ex" },
            { $set: { ex: "$$REMOVE", exTime: "$ex.time", exDate: "$ex.exDate" } },
        ])
        .toArray(),
);

{
    const data = l2_pro.minigame.jackpots
        .aggregate([
            { $project: { _id: 0, createdTime: 1, createdAt: 1, gameId: 1, prize: 1, amount: 1, exchangeRateId: 1, hitTime: 1 } },
            {
                $lookup: {
                    from: "exchange_rates",
                    localField: "exchangeRateId",
                    foreignField: "exId",
                    as: "ex",
                    pipeline: [{ $project: { _id: 0, code: 0 } }],
                },
            },
            { $unwind: { path: "$ex", preserveNullAndEmptyArrays: true } },
            { $set: { ex: "$$REMOVE", exTime: "$ex.time", exDate: "$ex.exDate" } },
            {
                $lookup: {
                    from: "exchange_rates",
                    as: "exg",
                    let: { hitTime: "$hitTime" },
                    pipeline: [
                        { $match: { $expr: { $lte: ["$time", "$$hitTime"] } } }, //
                        { $sort: { time: -1 } },
                        { $limit: 1 },
                        {
                            $project: {
                                _id: 0,
                                CNY: "$code.CNY",
                                HKD: "$code.EUR",
                                IDR: "$code.IDR",
                                INR: "$code.INR",
                                KRW: "$code.KRW",
                                MYR: "$code.MYR",
                                THB: "$code.THB",
                                USD: "$code.USD",
                                VND: "$code.VND",
                            },
                        },
                    ],
                },
            },
            { $unwind: { path: "$exg", preserveNullAndEmptyArrays: true } },
            {
                $set: {
                    exg: "$$REMOVE",
                    exgId: "$exg.exId",
                    exgTime: "$exg.time",
                    exgDate: "$exg.exDate",
                    CNY_VND: { $toDouble: "$exg.CNY" },
                    HKD_VND: { $toDouble: "$exg.HKD" },
                    IDR_VND: { $toDouble: "$exg.IDR" },
                    INR_VND: { $toDouble: "$exg.INR" },
                    KRW_VND: { $toDouble: "$exg.KRW" },
                    MYR_VND: { $toDouble: "$exg.MYR" },
                    THB_VND: { $toDouble: "$exg.THB" },
                    USD_VND: { $toDouble: "$exg.USD" },
                    VND_VND: { $toDouble: "$exg.VND" },
                },
            },
        ])

        .toArray();

    data.forEach((item) => {
        const ex_USD = l1_pro.minigame.exchange_rates.findOne(
            { time: { $lte: item.hitTime } },
            {
                _id: 0,
                CNY_USD: { $toDouble: "$code.CNY" },
                HKD_USD: { $toDouble: "$code.EUR" },
                IDR_USD: { $toDouble: "$code.IDR" },
                INR_USD: { $toDouble: "$code.INR" },
                KRW_USD: { $toDouble: "$code.KRW" },
                MYR_USD: { $toDouble: "$code.MYR" },
                THB_USD: { $toDouble: "$code.THB" },
                USD_USD: { $toDouble: "$code.USD" },
                VND_USD: { $toDouble: "$code.VND" },
            },
            { sort: { time: -1 } },
        );

        Object.assign(item, ex_USD);
    });

    JSON.stringify(data);
}
