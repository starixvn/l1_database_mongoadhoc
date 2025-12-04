// @ts-check

(async () => {
    const code = "NJFHUIKSD50FSSL";
    const backupId = "GL-6555";
    const dbs = l2_pro;
    const now = ISODate();

    const { _id, gameIds } = /** @type { { _id: ObjectId, gameIds: number[] } } */ (dbs.minigame.game_promotions.findOne({ code }, { _id: 1, gameIds: 1 }));

    dbs.minigame.game_promotions.aggregate(
        /** @type { CollectionAggregationPipeline } */ ([
            { $match: { _id } }, // -
            { $project: { _id: 0, backupId, data: "$$ROOT" } },
            { $merge: { into: { db: "minigame_backup", coll: "game_promotions_backup" } } },
        ]),
    );
    console.log(
        ISODate().toISOString(), // -
        "game_promotions",
        dbs.minigame_backup.game_promotions_backup.countDocuments({ backupId }),
    );
    console.log(
        ISODate().toISOString(), // -
        "game_promotions",
        dbs.minigame.game_promotions.updateMany(
            { _id }, // -
            { $set: { endDate: now, claimExpirationDate: now } },
        ),
    );

    dbs.minigame.game_player_promotions.aggregate(
        /** @type { CollectionAggregationPipeline } */ ([
            { $match: { promotionId: _id } }, // -
            { $project: { _id: 0, backupId, data: "$$ROOT" } },
            { $merge: { into: { db: "minigame_backup", coll: "game_player_promotions_backup" } } },
        ]),
    );
    console.log(
        ISODate().toISOString(), // -
        "game_player_promotions",
        dbs.minigame_backup.game_player_promotions_backup.countDocuments({ backupId }),
    );
    console.log(
        ISODate().toISOString(), // -
        "game_player_promotions",
        dbs.minigame.game_player_promotions.updateMany(
            { promotionId: _id }, // -
            { $set: { endDate: now } },
        ),
    );
})();
