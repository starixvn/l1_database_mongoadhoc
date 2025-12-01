Promise.all(
    [
        { dbs: l5_pro, dbsArc: l5_pro_arc }, // -
    ].map(async ({ dbs, dbsArc }) => {
        const __start = Date.now();

        const namespaces = dbs.hotdog_ops_configs.summary_configs
            .find(
                { type: 6 },
                {
                    _id: 0, // -
                    db: 1,
                    coll: { $concat: ["$gameConfigs.name", { $ifNull: ["$coll.bet", "$coll.round"] }] },
                },
            )
            .toArray();

        namespaces.forEach(({ db, coll }) => {
            console.log(dbs, dbsArc, db, coll);
            const __start = Date.now();

            let bulkOps = /** @type { AnyBulkWriteOperation[] } */ ([]);
            dbsArc[`${db}_arc`]
                .getCollection(`${coll}_bk`)
                .find({}, { _id: 1, drawId: 1 })
                .forEach(({ _id, drawId }) => {
                    bulkOps.push({
                        updateOne: {
                            filter: { _id },
                            update: { $set: { subRoundId: drawId } },
                        },
                    });

                    if (bulkOps.length >= 1000) {
                        const { matchedCount, modifiedCount } = dbsArc.hotdog_minigame_arc.ticket_silos_bk.bulkWrite(bulkOps, { ordered: false });
                        console.log(dbs, dbsArc, db, coll, bulkOps.length, matchedCount, modifiedCount);

                        bulkOps = [];
                    }
                });

            if (bulkOps.length > 0) {
                const { matchedCount, modifiedCount } = dbsArc.hotdog_minigame_arc.ticket_silos_bk.bulkWrite(bulkOps, { ordered: false });
                console.log(dbs, dbsArc, db, coll, bulkOps.length, matchedCount, modifiedCount);
            }

            console.log(dbs, dbsArc, db, coll, "=== DONE ===", Date.now() - __start);
        });

        return Date.now() - __start;
    }),
);
