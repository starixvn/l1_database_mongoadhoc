{
    [
        // { dbs: l1 },
        // { dbs: l1p },
        // { dbs: l1pp },
        // { dbs: l1ppp },
        // { dbs: l2 },
        // { dbs: l2p },
        // { dbs: l2pp },
        // { dbs: l4 },
        // { dbs: l1_uat },
        // { dbs: l2_uat },
        // { dbs: sn_uat },
        // { dbs: l1_pro },
        { dbs: l2_pro },
        // { dbs: sn_pro },
    ].forEach(({ dbs }) => {
        console.log(dbs, dbs.summary.round_summaries.countDocuments({ _roundId: null }));
        dbs.minigame.ticket_silos.aggregate([
            { $match: { roundTime: { $gte: ISODate("2024-08-04") } } },
            {
                $group: {
                    _id: {
                        _roundId: "$_roundId",
                        gameId: "$gameId",
                        currency: "$currency",
                        operatorId: "$operatorId",
                        siteId: { $ifNull: ["$siteId", ""] },
                        roundId: "$roundId",
                    },
                },
            },
            { $replaceWith: "$_id" },
            {
                $merge: {
                    into: { db: "summary", coll: "round_summaries" },
                    on: ["gameId", "currency", "operatorId", "siteId", "roundId"],
                    whenMatched: "merge",
                    whenNotMatched: "discard",
                },
            },
        ]);
        console.log(dbs, dbs.summary.round_summaries.countDocuments({ _roundId: null }));
    });
}
