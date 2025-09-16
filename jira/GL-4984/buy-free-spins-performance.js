// @ts-check

(async () => {
    const data = await (
        await l1_pro.minigame.ticket_silos.aggregate(
            /** @type { CollectionAggregationPipeline } */ ([
                {
                    $match: {
                        gameId: 121,
                        roundTime: { $gte: ISODate("2025-09-01") },
                        currency: { $ne: "UUS" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        time: { $dateTrunc: { date: "$roundTime", unit: "day" } },
                        operatorId: 1,
                        playerId: 1,
                        tickets: 1,
                        stake: "$USD.stake",
                        winloss: "$USD.winloss",
                        buyFreeSpins: "$features.buyFreeSpins",
                    },
                },
                {
                    $group: {
                        _id: {
                            time: "$time",
                            opreatorId: "$operatorId",
                        },
                        players: { $addToSet: "$playerId" },
                        tickets: { $sum: "$tickets" },
                        stake: { $sum: "$stake" },
                        winloss: { $sum: "$winloss" },
                        playersBFS: { $addToSet: { $cond: [{ $eq: ["$buyFreeSpins", true] }, "$playerId", "$$REMOVE"] } },
                        ticketsBFS: { $sum: { $cond: [{ $eq: ["$buyFreeSpins", true] }, "$tickets", 0] } },
                        stakeBFS: { $sum: { $cond: [{ $eq: ["$buyFreeSpins", true] }, "$stake", 0] } },
                        winlossBFS: { $sum: { $cond: [{ $eq: ["$buyFreeSpins", true] }, "$winloss", 0] } },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        monthNo: { $add: [{ $multiply: [{ $year: "$_id.time" }, 100] }, { $month: "$_id.time" }] },
                        month: { $substrCP: [{ $toString: { $dateTrunc: { date: "$_id.time", unit: "month" } } }, 0, 7] },
                        dayNo: { $add: [{ $multiply: [{ $year: "$_id.time" }, 1_000] }, { $dayOfYear: "$_id.time" }] },
                        day: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                        opreatorId: "$_id.opreatorId",
                        players: { $size: "$players" },
                        tickets: 1,
                        stake: { $toDouble: "$stake" },
                        winloss: { $toDouble: "$winloss" },
                        playersBFS: { $size: "$playersBFS" },
                        ticketsBFS: 1,
                        stakeBFS: { $toDouble: "$stakeBFS" },
                        winlossBFS: { $toDouble: "$winlossBFS" },
                    },
                },
                { $sort: { dayNo: 1 } },
            ]),
        )
    )
        .map(({ monthNo, month, dayNo, day, opreatorId, players, tickets, stake, winloss, playersBFS, ticketsBFS, stakeBFS, winlossBFS }) => ({
            monthNo,
            month,
            dayNo,
            day,
            opreatorId,
            players,
            tickets,
            stake,
            winloss,
            playersBFS,
            ticketsBFS,
            stakeBFS,
            winlossBFS,
        }))
        .toArray();

    console.table(data);
    console.log(JSON.stringify(data));
})();

(async () => {
    const data = await (
        await l2_pro_arc.minigame_arc.ticket_silos_bk.aggregate(
            /** @type { CollectionAggregationPipeline } */ ([
                {
                    $match: {
                        gameId: 121,
                        roundTime: { $gte: ISODate("2025-08-01"), $lt: ISODate("2025-09-01") },
                        currency: { $ne: "UUS" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        time: { $dateTrunc: { date: "$roundTime", unit: "day" } },
                        operatorId: 1,
                        playerId: 1,
                        tickets: 1,
                        stake: "$USD.stake",
                        winloss: "$USD.winloss",
                        buyFreeSpins: "$features.buyFreeSpins",
                    },
                },
                {
                    $group: {
                        _id: {
                            time: "$time",
                            opreatorId: "$operatorId",
                        },
                        players: { $addToSet: "$playerId" },
                        tickets: { $sum: "$tickets" },
                        stake: { $sum: "$stake" },
                        winloss: { $sum: "$winloss" },
                        playersBFS: { $addToSet: { $cond: [{ $eq: ["$buyFreeSpins", true] }, "$playerId", "$$REMOVE"] } },
                        ticketsBFS: { $sum: { $cond: [{ $eq: ["$buyFreeSpins", true] }, "$tickets", 0] } },
                        stakeBFS: { $sum: { $cond: [{ $eq: ["$buyFreeSpins", true] }, "$stake", 0] } },
                        winlossBFS: { $sum: { $cond: [{ $eq: ["$buyFreeSpins", true] }, "$winloss", 0] } },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        monthNo: { $add: [{ $multiply: [{ $year: "$_id.time" }, 100] }, { $month: "$_id.time" }] },
                        month: { $substrCP: [{ $toString: { $dateTrunc: { date: "$_id.time", unit: "month" } } }, 0, 7] },
                        dayNo: { $add: [{ $multiply: [{ $year: "$_id.time" }, 1_000] }, { $dayOfYear: "$_id.time" }] },
                        day: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                        opreatorId: "$_id.opreatorId",
                        players: { $size: "$players" },
                        tickets: 1,
                        stake: { $toDouble: "$stake" },
                        winloss: { $toDouble: "$winloss" },
                        playersBFS: { $size: "$playersBFS" },
                        ticketsBFS: 1,
                        stakeBFS: { $toDouble: "$stakeBFS" },
                        winlossBFS: { $toDouble: "$winlossBFS" },
                    },
                },
                { $sort: { dayNo: 1 } },
            ]),
        )
    )
        .map(({ monthNo, month, dayNo, day, opreatorId, players, tickets, stake, winloss, playersBFS, ticketsBFS, stakeBFS, winlossBFS }) => ({
            monthNo,
            month,
            dayNo,
            day,
            opreatorId,
            players,
            tickets,
            stake,
            winloss,
            playersBFS,
            ticketsBFS,
            stakeBFS,
            winlossBFS,
        }))
        .toArray();

    console.table(data);
    console.log(JSON.stringify(data));
})();
