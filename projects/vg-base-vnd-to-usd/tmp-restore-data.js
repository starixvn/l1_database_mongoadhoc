[
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
].map((collName) => {
    const dbs = l2_uat;
    const db = dbs.minigame_backup;
    const backupId = ObjectId("67d91b26f0b9bdd9664ec05e");

    console.log(
        dbs,
        collName,
        db
            .getCollection(`backup_${collName}`)
            .aggregate(
                /** @type {CollectionAggregationPipeline} */ ([
                    { $match: { backupId } },
                    { $replaceWith: "$data" },
                    {
                        $merge: {
                            into: { db: "minigame", coll: collName },
                            whenMatched: "replace",
                            whenNotMatched: "insert",
                        },
                    },
                ]),
            )
            .toArray(),
    );
});
