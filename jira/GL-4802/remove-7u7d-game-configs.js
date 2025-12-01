// @ts-check
(async () => {
    const dbs = l5_pro;
    const backupId = "GL-6473";
    const filter = { gameId: 103 };
    const __EXECUTE__ = true;

    {
        if (__EXECUTE__) {
            (
                await dbs.hotdog_minigame.game_configs.aggregate(
                    /** @type { CollectionAggregationPipeline } */
                    [
                        { $match: filter }, // -
                        { $project: { _id: 0, backupId, data: "$$ROOT" } },
                        { $merge: { into: { db: "hotdog_minigame_rm", coll: "game_configs_rm" } } },
                    ],
                )
            ).toArray();

            const rmIds = await dbs.hotdog_minigame_rm.game_configs_rm
                .find({ backupId }, { _id: "$data._id" })
                .map(({ _id }) => _id)
                .toArray();

            console.log(ISODate(), "game_configs_rm", rmIds.length);
            console.log(ISODate(), "game_configs", dbs.hotdog_minigame.game_configs.deleteMany({ _id: { $in: rmIds } }));
        } else {
            const rmIds = await dbs.hotdog_minigame.game_configs
                .find(filter, { _id: 1 })
                .map(({ _id }) => _id)
                .toArray();
            console.log(ISODate(), "DRY RUN: game_configs", dbs.hotdog_minigame.game_configs.countDocuments({ _id: { $in: rmIds } }));
        }
    }

    {
        if (__EXECUTE__) {
            (
                await dbs.hotdog_minigame.currency_group_games.aggregate(
                    /** @type { CollectionAggregationPipeline } */
                    [
                        { $match: filter }, // -
                        { $project: { _id: 0, backupId, data: "$$ROOT" } },
                        { $merge: { into: { db: "hotdog_minigame_rm", coll: "currency_group_games_rm" } } },
                    ],
                )
            ).toArray();

            const rmIds = await dbs.hotdog_minigame_rm.currency_group_games_rm
                .find({ backupId }, { _id: "$data._id" })
                .map(({ _id }) => _id)
                .toArray();

            console.log(ISODate(), "currency_group_games_rm", rmIds.length);
            console.log(ISODate(), "currency_group_games", dbs.hotdog_minigame.currency_group_games.deleteMany({ _id: { $in: rmIds } }));
        } else {
            const rmIds = await dbs.hotdog_minigame.currency_group_games
                .find(filter, { _id: 1 })
                .map(({ _id }) => _id)
                .toArray();
            console.log(ISODate(), "DRY RUN: currency_group_games", dbs.hotdog_minigame.currency_group_games.countDocuments({ _id: { $in: rmIds } }));
        }
    }
})();
