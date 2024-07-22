{
    const dbs = l1_pro_arc;

    l1_pro.ops_configs.summary_configs.find(
        {},
        {
            _id: 0,
            gameId: "$gameConfigs.gameId",
            db: { $concat: ["$db", "_arc"] },
            bet: { $ifNull: [{ $concat: ["$gameConfigs.name", "$coll.bet", "_bk"] }, { $concat: ["$gameConfigs.name", "$coll.round", "_bk"] }] },
        }
    ).forEach(({ gameId, db, bet }) => {
        console.log(new Date().toISOString(), gameId, bet);
        dbs[db].getCollection(bet).aggregate([
            { $set: { gameId } },
            { $merge: { into: { db: "silo", coll: "tickets" } } },
        ])
    });
}

{
    const dbs = l1_pro_arc;

    const a = l1_pro.ops_configs.summary_configs.find(
        {},
        {
            _id: 0,
            gameId: "$gameConfigs.gameId",
            db: { $concat: ["$db", "_arc"] },
            bet: { $ifNull: [{ $concat: ["$gameConfigs.name", "$coll.bet", "_bk"] }, { $concat: ["$gameConfigs.name", "$coll.round", "_bk"] }] },
        }
    ).map(({ gameId, db, bet }) => {
        console.log(new Date().toISOString(), gameId, bet);
        return dbs[db].getCollection(bet).countDocuments();
    });

    let ac = 0;
    a.forEach((c) => { ac += c;})
    console.log(ac)
}

{
    // rate checking
    const dbs = sn_pro;

    sn_pro.ops_configs.summary_configs.find(
        {},
        {
            _id: 0,
            gameId: "$gameConfigs.gameId",
            db: { $concat: ["$db"] },
            bet: { $ifNull: [{ $concat: ["$gameConfigs.name", "$coll.bet"] }, { $concat: ["$gameConfigs.name", "$coll.round"] }] },
        }
    ).forEach(({ gameId, db, bet }) => {
        console.log(new Date().toISOString(), gameId, bet);
        console.log(new Date().toISOString(), gameId, dbs[db].getCollection(bet).findOne({}, { _id: 0, rate: 1 }, { sort: { _id: -1 } }));
    });
}
