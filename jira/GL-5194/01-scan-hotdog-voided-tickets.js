(async () => {
    const voidDB = l5_pro.hotdog_minigame_rm;
    const gameDB = l5_pro.hotdog_minigame;
    const arcDB = l5_pro_arc.hotdog_minigame_arc;
    const arcVoidDB = l5_pro_arc.hotdog_minigame_arc_rm;

    const backupId = "GL-5194";

    [
        "bacball1_bets_rm",
        "bacball2_bets_rm",
        "baccarat_cuocs_rm",
        "dragontigerfight_bets_rm",
        "luckynext1_bets_rm",
        "luckynext2_bets_rm",
        "luckythree_bets_rm",
        "seball1_bets_rm",
        "sicball_bets_rm",
        "vipsedie_cuocs_rm",
        "xocxoc_cuocs_rm",
    ].forEach((collName) => {
        console.log(collName, "Counts", voidDB.getCollection(collName).countDocuments());

        const voidedTickets = voidDB
            .getCollection(collName)
            .find({}, { _id: 1 })
            .map(({ _id }) => _id)
            .toArray();

        console.log(collName, "Counts", voidedTickets.length);

        console.log(collName, "ticket_silos", gameDB.ticket_silos.countDocuments({ _id: { $in: voidedTickets } }));
        console.log(collName, "ticket_silos_bk", arcDB.ticket_silos_bk.countDocuments({ _id: { $in: voidedTickets } }));

        gameDB.ticket_silos.aggregate(
            /** @type { CollectionAggregationPipeline } */ ([
                { $match: { _id: { $in: voidedTickets } } }, // -
                { $project: { _id: 0, backupId, data: "$$ROOT" } },
                { $merge: { into: { db: voidDB.getName(), coll: "ticket_silos_rm" } } },
            ]),
        );
        console.log(collName, "ticket_silos_rm", voidDB.ticket_silos_rm.countDocuments({ backupId }));
        console.log(collName, "Delete", gameDB.ticket_silos.deleteMany({ _id: { $in: voidedTickets } }));

        arcDB.ticket_silos_bk.aggregate(
            /** @type { CollectionAggregationPipeline } */ ([
                { $match: { _id: { $in: voidedTickets } } }, // -
                { $project: { _id: 0, backupId, data: "$$ROOT" } },
                { $merge: { into: { db: arcVoidDB.getName(), coll: "ticket_silos_bk_rm" } } },
            ]),
        );
        console.log(collName, "ticket_silos_bk_rm", arcVoidDB.ticket_silos_bk_rm.countDocuments({ backupId }));
        console.log(collName, "Delete", arcDB.ticket_silos_bk.deleteMany({ _id: { $in: voidedTickets } }));
    });
})();
