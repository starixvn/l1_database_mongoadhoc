// @ts-check
(async () => {
    const data = (
        await l5_pro_arc.hotdog_summary_arc.daily_summaries_bk.aggregate([
            { $match: { currency: { $ne: "UUS" } } },
            {
                $group: {
                    _id: { time: "$time", currency: "$currency" },
                    tickets: { $sum: "$tickets" },
                    turnover: { $sum: "$stake" },
                    income: { $sum: { $subtract: [0, "$winloss"] } },
                    turnoverUSD: { $sum: "$USD.stake" },
                    incomeUSD: { $sum: { $subtract: [0, "$USD.winloss"] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    timeNo: { $add: [{ $multiply: [{ $year: "$_id.time" }, 1_000] }, { $dayOfYear: "$_id.time" }] },
                    monthNo: { $add: [{ $multiply: [{ $year: "$_id.time" }, 100] }, { $month: "$_id.time" }] },
                    time: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                    currency: "$_id.currency",
                    tickets: "$tickets",
                    turnover: { $toDouble: "$turnover" },
                    income: { $toDouble: "$income" },
                    turnoverUSD: { $toDouble: "$turnoverUSD" },
                    incomeUSD: { $toDouble: "$incomeUSD" },
                },
            },
            { $sort: { timeNo: 1, currency: 1 } },
        ])
    ).toArray();

    console.log(JSON.stringify(data));
})();

(async () => {
    const data = (
        await l5_pro_arc.hotdog_summary_arc.hourly_summaries_bk.aggregate([
            { $match: { currency: { $ne: "UUS" } } },
            {
                $group: {
                    _id: { time: { $dateTrunc: { date: "$time", unit: "day" } }, currency: "$currency" },
                    tickets: { $sum: "$tickets" },
                    turnover: { $sum: "$stake" },
                    income: { $sum: { $subtract: [0, "$winloss"] } },
                    turnoverUSD: { $sum: "$USD.stake" },
                    incomeUSD: { $sum: { $subtract: [0, "$USD.winloss"] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    timeNo: { $add: [{ $multiply: [{ $year: "$_id.time" }, 1_000] }, { $dayOfYear: "$_id.time" }] },
                    monthNo: { $add: [{ $multiply: [{ $year: "$_id.time" }, 100] }, { $month: "$_id.time" }] },
                    time: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                    currency: "$_id.currency",
                    tickets: "$tickets",
                    turnover: { $toDouble: "$turnover" },
                    income: { $toDouble: "$income" },
                    turnoverUSD: { $toDouble: "$turnoverUSD" },
                    incomeUSD: { $toDouble: "$incomeUSD" },
                },
            },
            { $sort: { timeNo: 1, currency: 1 } },
        ])
    ).toArray();

    console.log(JSON.stringify(data));
})();
