// @ts-check
(async () => {
    const data = (
        await l5_pro_arc.hotdog_summary_arc.daily_summaries_bk.aggregate([
            {
                $match: {
                    currency: { $ne: "UUS" },
                    time: { $gte: ISODate("2025-09-01"), $lt: ISODate("2025-10-12") },
                },
            },
            {
                $group: {
                    _id: { time: "$time", gameId: "$gameId", currency: "$currency" },
                    tickets: { $sum: "$tickets" },
                    turnover: { $sum: "$stake" },
                    playerWL: { $sum: "$winloss" },
                    turnoverUSD: { $sum: "$USD.stake" },
                    playerWLUSD: { $sum: "$USD.winloss" },
                },
            },
            {
                $project: {
                    _id: 0,
                    timeNo: { $add: [{ $multiply: [{ $year: "$_id.time" }, 1_000] }, { $dayOfYear: "$_id.time" }] },
                    time: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                    gameId: "$_id.gameId",
                    currency: "$_id.currency",
                    tickets: "$tickets",
                    turnover: { $toDouble: "$turnover" },
                    playerWL: { $toDouble: "$playerWL" },
                    turnoverUSD: { $toDouble: "$turnoverUSD" },
                    playerWLUSD: { $toDouble: "$playerWLUSD" },
                },
            },
            { $sort: { timeNo: 1, gameId: 1, currency: 1 } },
        ])
    ).toArray();

    console.log(JSON.stringify(data));
})();

(async () => {
    const data = (
        await l5_pro.hotdog_summary.daily_summaries.aggregate([
            {
                $match: {
                    currency: { $ne: "UUS" },
                    time: { $gte: ISODate("2025-09-01"), $lt: ISODate("2025-10-12") },
                },
            },
            {
                $group: {
                    _id: { time: "$time", gameId: "$gameId", currency: "$currency" },
                    tickets: { $sum: "$tickets" },
                    turnover: { $sum: "$stake" },
                    playerWL: { $sum: "$winloss" },
                    turnoverUSD: { $sum: "$USD.stake" },
                    playerWLUSD: { $sum: "$USD.winloss" },
                },
            },
            {
                $project: {
                    _id: 0,
                    timeNo: { $add: [{ $multiply: [{ $year: "$_id.time" }, 1_000] }, { $dayOfYear: "$_id.time" }] },
                    time: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                    gameId: "$_id.gameId",
                    currency: "$_id.currency",
                    tickets: "$tickets",
                    turnover: { $toDouble: "$turnover" },
                    playerWL: { $toDouble: "$playerWL" },
                    turnoverUSD: { $toDouble: "$turnoverUSD" },
                    playerWLUSD: { $toDouble: "$playerWLUSD" },
                },
            },
            { $sort: { timeNo: 1, gameId: 1, currency: 1 } },
        ])
    ).toArray();

    console.log(JSON.stringify(data));
})();
