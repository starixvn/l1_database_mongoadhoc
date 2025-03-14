// minigame.global_configs
// minigame.exchange_rates
// minigame.jackpots
// minigame.promotion_configs
// minigame.*_fames

Promise.allSettled(
    [l2pp].map(async (dbs) => {
        const db = dbs.minigame;
        const backupDb = dbs.minigame_backup;
        const backupId = new ObjectId();
        console.log(dbs, { backupId });

        const fames = (await db.getCollectionNames()).filter((collection) => /_fames$/.test(collection));

        ["global_configs", "exchange_rates", "jackpots", "promotion_configs", ...fames].forEach(async (collection) => {
            const coll = db.getCollection(collection);
            await (
                await coll.aggregate(
                    /** @type {CollectionAggregationPipeline} */ ([
                        { $project: { backupId: { $literal: backupId }, data: "$$ROOT" } }, //-
                        { $merge: { into: { db: "minigame_backup", coll: `backup_${collection}` } } },
                    ]),
                )
            ).toArray();

            console.log(dbs, collection, db.getCollection(collection).countDocuments({}), "=>", backupDb.getCollection(`backup_${collection}`).countDocuments({ backupId }));
        });

        console.log(dbs, { backupId });
    }),
);

// VG LOCAL2: ObjectId('67ce84d6a4622cbfc6305aae')
