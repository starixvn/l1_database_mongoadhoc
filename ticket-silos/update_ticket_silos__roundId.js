{
    console.log("UPDATE ROUND ID");

    [
        // { dbs: l1, dbsArc: l1 },
        // { dbs: l1p, dbsArc: l1p },
        // { dbs: l1pp, dbsArc: l1pp },
        // { dbs: l1ppp, dbsArc: l1ppp },
        // { dbs: l2, dbsArc: l2 },
        // { dbs: l2p, dbsArc: l2p },
        // { dbs: l2pp, dbsArc: l2pp },
        // { dbs: l4, dbsArc: l4 },
        // { dbs: l1_sit, dbsArc: l1_sit_arc },
        // { dbs: l2_sit, dbsArc: l2_sit_arc },
        // { dbs: sn_sit, dbsArc: sn_sit_arc },
        // { dbs: l1_uat, dbsArc: l1_uat_arc },
        // { dbs: l2_uat, dbsArc: l2_uat_arc },
        // { dbs: sn_uat, dbsArc: sn_uat_arc },
        // { dbs: l1_pro, dbsArc: l1_pro_arc },
        // { dbs: l2_pro, dbsArc: l2_pro_arc },
        // { dbs: sn_pro, dbsArc: sn_pro_arc },
    ].forEach(({ dbs, dbsArc }) => {
        const log = (...args) => console.log(dbs, dbsArc, new Date().toISOString(), ...args);

        dbs.ops_configs.summary_configs
            .find({}, { _id: 0, gameId: "$gameConfigs.gameId", name: "$gameConfigs.name", round: "$coll.round" }, {})
            .forEach(async ({ gameId, name, round }) => {
                if (gameId === 99) {
                    return;
                }
                log(gameId, name, round);
                const bkRoundCollName = `${name}${round}_bk`;

                const cursor = dbs.minigame.ticket_silos.aggregate([
                    { $match: { gameId, _roundId: null } },
                    { $group: { _id: "$roundId" } },
                    { $project: { _id: 0, roundId: "$_id" } },
                ]);

                let roundIds = [];
                for await (const { roundId } of cursor) {
                    roundIds.push(roundId);

                    if (roundIds.length >= 1_000) {
                        log(bkRoundCollName, roundIds.length);

                        const bulkPipe = await dbsArc.minigame_arc
                            .getCollection(bkRoundCollName)
                            .find({ id: { $in: roundIds } }, { _id: 1, id: 1 })
                            .map(({ _id, id }) => ({
                                updateMany: {
                                    filter: { gameId, roundId: id },
                                    update: { $set: { _roundId: _id } },
                                },
                            }))
                            .toArray();

                        log(gameId, name, bulkPipe.length);

                        try {
                            const { matchedCount, modifiedCount } = await dbs.minigame.ticket_silos.bulkWrite(bulkPipe, { ordered: false });
                            log(gameId, name, JSON.stringify({ matchedCount, modifiedCount }));
                        } finally {
                            roundIds = [];
                        }
                    }
                }

                if (roundIds.length > 0) {
                    log(bkRoundCollName, roundIds.length);

                    const bulkPipe = await dbsArc.minigame_arc
                        .getCollection(`${name}${round}_bk`)
                        .find({ id: { $in: roundIds } }, { _id: 1, id: 1 })
                        .map(({ _id, id }) => ({
                            updateMany: {
                                filter: { gameId, roundId: id },
                                update: { $set: { _roundId: _id } },
                            },
                        }))
                        .toArray();

                    log(gameId, name, bulkPipe.length);

                    try {
                        const { matchedCount, modifiedCount } = await dbs.minigame.ticket_silos.bulkWrite(bulkPipe, { ordered: false });
                        log(gameId, name, JSON.stringify({ matchedCount, modifiedCount }));
                    } finally {
                        roundIds = [];
                    }
                }
            });
    });
}
