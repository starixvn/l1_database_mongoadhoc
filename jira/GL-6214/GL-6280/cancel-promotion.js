// @ts-check

(async () => {
    const code = "WELCOME88FS";
    const backupId = "GL-6280";
    const dbs = l2_pro;
    const now = ISODate();

    const { _id, gameIds } = dbs.minigame.game_promotions.findOne({ code }, { _id: 1, gameIds: 1 });

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

    gameIds.forEach((gameId) => {
        const { name } = dbs.minigame.game_configs.findOne({ gameId, type: 3 }, { _id: 0, name: 1 });

        if (!name) {
            console.log(ISODate().toISOString(), gameId, "- NOT FOUND");
            return;
        }

        console.log(
            ISODate().toISOString(), // -
            `${name}_multipliers`,
            dbs.minigame
                .getCollection(`${name}_multipliers`)
                .aggregate(
                    /** @type { CollectionAggregationPipeline } */ ([
                        { $match: { promotionId: _id.toString() } },
                        { $project: { _id: 0, backupId, data: "$$ROOT" } },
                        { $merge: { into: { db: "minigame_backup", coll: `${name}_multipliers_backup` } } },
                    ]),
                ),
        );
        console.log(
            ISODate().toISOString(), // -
            `${name}_multipliers`,
            dbs.minigame_backup.getCollection(`${name}_multipliers_backup`).countDocuments({ backupId }),
        );
        console.log(
            ISODate().toISOString(), // -
            `${name}_multipliers`,
            dbs.minigame.getCollection(`${name}_multipliers`).updateMany(
                { promotionId: _id.toString() }, // -
                { $set: { time: now } },
            ),
        );

        console.log(
            ISODate().toISOString(), // -
            `${name}_freespins`,
            dbs.minigame
                .getCollection(`${name}_freespins`)
                .aggregate(
                    /** @type { CollectionAggregationPipeline } */ ([
                        { $match: { promotionId: _id.toString() } },
                        { $project: { _id: 0, backupId, data: "$$ROOT" } },
                        { $merge: { into: { db: "minigame_backup", coll: `${name}_freespins_backup` } } },
                    ]),
                ),
        );
        console.log(
            ISODate().toISOString(), // -
            `${name}_freespins`,
            dbs.minigame_backup.getCollection(`${name}_freespins_backup`).countDocuments({ backupId }),
        );
        console.log(
            ISODate().toISOString(), // -
            `${name}_freespins`,
            dbs.minigame.getCollection(`${name}_freespins`).updateMany(
                { promotionId: _id.toString() }, // -
                { $set: { expiryTime: now } },
            ),
        );
    });
})();
