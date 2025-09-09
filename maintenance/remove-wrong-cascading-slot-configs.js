// @ts-check
{
    const dbs = l1_pro;

    [
        { gameId: 142, backupId: "GL-4880" },
        { gameId: 155, backupId: "GL-4890" },
    ].map(({ gameId, backupId }) => {
        dbs.minigame.currency_group_games
            .aggregate([
                { $match: { gameId } },
                { $project: { _id: 0, backupId, data: "$$ROOT" } }, // -
                { $merge: { into: { db: "minigame_rm", coll: "currency_group_games_rm" } } },
            ])
            .toArray();

        dbs.minigame.game_configs
            .aggregate([
                { $match: { gameId } },
                { $project: { _id: 0, backupId, data: "$$ROOT" } }, // -
                { $merge: { into: { db: "minigame_rm", coll: "game_configs_rm" } } },
            ])
            .toArray();

        console.log(
            gameId,
            backupId,
            "currency_group_games",
            dbs.minigame.currency_group_games.deleteMany({
                _id: {
                    $in: dbs.minigame_rm.currency_group_games_rm
                        .find({ backupId }, { _id: "$data._id" })
                        .map(({ _id }) => _id)
                        .toArray(),
                },
            }),
        );

        console.log(
            gameId,
            backupId,
            "game_configs",
            dbs.minigame.game_configs.deleteMany({
                _id: {
                    $in: dbs.minigame_rm.game_configs_rm
                        .find({ backupId }, { _id: "$data._id" })
                        .map(({ _id }) => _id)
                        .toArray(),
                },
            }),
        );
    });
}
