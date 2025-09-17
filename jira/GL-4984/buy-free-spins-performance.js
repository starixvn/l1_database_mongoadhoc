// @ts-check

(async () => {
    const data = await (
        await l2_pro.minigame.ticket_silos.aggregate(
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
                        buyFreeSpins: { $addToSet: { $cond: [{ $gt: ["$buyFreeSpins", 0] }, "$buyFreeSpins", "$$REMOVE"] } },
                        playersBFS: { $addToSet: { $cond: [{ $gt: ["$buyFreeSpins", 0] }, "$playerId", "$$REMOVE"] } },
                        ticketsBFS: { $sum: { $cond: [{ $gt: ["$buyFreeSpins", 0] }, "$tickets", 0] } },
                        stakeBFS: { $sum: { $cond: [{ $gt: ["$buyFreeSpins", 0] }, "$stake", 0] } },
                        winlossBFS: { $sum: { $cond: [{ $gt: ["$buyFreeSpins", 0] }, "$winloss", 0] } },
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
                        buyFreeSpins: { $size: "$buyFreeSpins" },
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
        .map(({ monthNo, month, dayNo, day, opreatorId, players, tickets, stake, winloss, buyFreeSpins, playersBFS, ticketsBFS, stakeBFS, winlossBFS }) => ({
            monthNo,
            month,
            dayNo,
            day,
            opreatorId,
            players,
            tickets,
            stake,
            winloss,
            buyFreeSpins,
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
                        buyFreeSpins: { $addToSet: { $cond: [{ $gt: ["$buyFreeSpins", 0] }, "$buyFreeSpins", "$$REMOVE"] } },
                        playersBFS: { $addToSet: { $cond: [{ $gt: ["$buyFreeSpins", 0] }, "$playerId", "$$REMOVE"] } },
                        ticketsBFS: { $sum: { $cond: [{ $gt: ["$buyFreeSpins", 0] }, "$tickets", 0] } },
                        stakeBFS: { $sum: { $cond: [{ $gt: ["$buyFreeSpins", 0] }, "$stake", 0] } },
                        winlossBFS: { $sum: { $cond: [{ $gt: ["$buyFreeSpins", 0] }, "$winloss", 0] } },
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
                        buyFreeSpins: { $size: "$buyFreeSpins" },
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
        .map(({ monthNo, month, dayNo, day, opreatorId, players, tickets, stake, winloss, buyFreeSpins, playersBFS, ticketsBFS, stakeBFS, winlossBFS }) => ({
            monthNo,
            month,
            dayNo,
            day,
            opreatorId,
            players,
            tickets,
            stake,
            winloss,
            buyFreeSpins,
            playersBFS,
            ticketsBFS,
            stakeBFS,
            winlossBFS,
        }))
        .toArray();

    console.table(data);
    console.log(JSON.stringify(data));
})();
