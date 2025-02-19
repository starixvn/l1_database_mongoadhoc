{
    const db = l4_pro_arc.minigame_arc;

    const data = db.ticket_silos_bk
        .aggregate(
            /** @type { CollectionAggregationPipeline } */ ([
                { $match: { time: { $gte: ISODate("2024-12-01"), $lt: ISODate("2025-02-18") } } }, //
                {
                    $group: {
                        _id: {
                            date: { $toDate: { $dateToString: { format: "%Y-%m-%d", date: "$time" } } },
                            playerId: "$playerId",
                            currency: "$currency",
                            gameId: "$gameId",
                        },
                        tickets: { $sum: "$tickets" },
                        stake: { $sum: "$USD.stake" },
                        winloss: { $sum: "$USD.winloss" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id.date",
                        playerId: "$_id.playerId",
                        currency: "$_id.currency",
                        gameId: "$_id.gameId",
                        tickets: { $round: ["$tickets", 0] },
                        stake: { $round: ["$stake", 4] },
                        winloss: { $round: ["$winloss", 4] },
                    },
                },
            ]),
        )
        .toArray();

    console.table(data);
    console.log(JSON.stringify(data));
    fs.writeFileSync("E:/Billy/data/20250219-xd-player-performance.json", JSON.stringify(data));
}
