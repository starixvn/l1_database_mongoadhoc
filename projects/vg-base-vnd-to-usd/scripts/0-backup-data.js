// minigame.global_configs
// minigame.exchange_rates
// minigame.jackpots
// minigame.promotion_configs
// minigame.*_fames

[l2_pro].map((dbs) => {
    const db = dbs.minigame;
    const backupDb = dbs.minigame_backup;
    const backupId = new ObjectId(); // New env should generate new backupId
    console.log(dbs, { backupId });

    const fames = db.getCollectionNames().filter((collection) => /_fames$/.test(collection));

    [
        "global_configs",
        "exchange_rates",
        "jackpots",
        "promotion_configs",
        "promotion_leaderboards",
        ...fames,
        "taixiu_cuocs",
        "txturbo_cuocs",
        "chanleturbo_cuocs",
        "specialsedie_cuocs",
        "bitcoinmaster_betlogs",
        "taixiu_ones",
        "txturbo_ones",
        "chanleturbo_ones",
        "specialsedie_ones",
        "bitcoinmaster_bets",
        "game_configs",
        "userinfos",
    ].map((collection) => {
        if (backupDb.getCollection(`backup_${collection}`).countDocuments({ backupId }) > 0) {
            console.log(dbs, collection, "already backed up with ", backupId);
            return;
        }

        const coll = db.getCollection(collection);
        coll.aggregate(
            /** @type {CollectionAggregationPipeline} */ ([
                { $match: { "__archive.base": { $ne: "USD" } } },
                { $project: { backupId: { $literal: backupId }, data: "$$ROOT" } }, //-
                { $merge: { into: { db: "minigame_backup", coll: `backup_${collection}` } } },
            ]),
        ).toArray();

        console.log(dbs, collection, db.getCollection(collection).countDocuments({}), "=>", backupDb.getCollection(`backup_${collection}`).countDocuments({ backupId }));
    });

    console.log(dbs, { backupId });
});

[l2_pro].map((dbs) => {
    const db = dbs.minigame;

    [
        "bitcoinmaster_bets",
        "specialsedie_ones",
        "chanleturbo_ones",
        "txturbo_ones",
        "taixiu_ones",
        "bitcoinmaster_betlogs",
        "specialsedie_cuocs",
        "chanleturbo_cuocs",
        "txturbo_cuocs",
        "taixiu_cuocs",
    ].map((collName) => {
        if (db.getCollection(`__VNDUSD_${collName}`).exists()) {
            return;
        }

        console.log(dbs, collName, db.getCollection(collName).aggregate(/** @type {CollectionAggregationPipeline} */ ([{ $merge: { into: `__VNDUSD_${collName}` } }])));
    });
});

// VG LOCAL0: ObjectId('67da70a3c173f8e48e0d81a7')
// VG LOCAL1: ObjectId('67da70dcc173f8e48e0d81a8')
// VG LOCAL2: ObjectId('67ce84d6a4622cbfc6305aae')
// VG SIT: ObjectId('67d3cc6fbbdfb267fd117b95')
// VG UAT: ObjectId('67d91b26f0b9bdd9664ec05e')
// VG PRO: ObjectId('67da60f9e51930f2ad117b91')
