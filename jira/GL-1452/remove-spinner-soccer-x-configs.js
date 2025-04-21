{
    const dbs = l1_pro;
    const EXECUTE = true;
    const issueId = "GL-1452";

    const gameConfigs_docs = dbs.minigame.game_configs.find({ gameId: 114 }).toArray();
    const currencyGroupGames_docs = dbs.minigame.currency_group_games.find({ gameId: 114 }).toArray();

    console.log("game_configs", gameConfigs_docs);
    console.log("currency_group_games", currencyGroupGames_docs);

    if (EXECUTE) {
        const gameConfigs_ids = gameConfigs_docs.map(({ _id }) => _id);
        const currencyGroupGames_ids = currencyGroupGames_docs.map(({ _id }) => _id);

        console.log("game_configs", gameConfigs_ids);
        console.log("currency_group_games", currencyGroupGames_ids);

        dbs.minigame.game_configs
            .aggregate(
                /** @type {CollectionAggregationPipeline} */
                ([
                    { $match: { _id: { $in: gameConfigs_ids } } }, //-
                    {
                        $project: {
                            _id: 0,
                            data: "$$ROOT",
                            backupId: issueId,
                        },
                    },
                    ...(EXECUTE
                        ? [
                              {
                                  $merge: {
                                      into: { db: "minigame_rm", coll: "game_configs_rm" },
                                  },
                              },
                          ]
                        : []),
                ]),
            )
            .toArray();
        console.log("game_configs_rm", dbs.minigame_rm.game_configs_rm.find({ backupId: issueId }).toArray());

        dbs.minigame.currency_group_games
            .aggregate(
                /** @type {CollectionAggregationPipeline} */
                ([
                    { $match: { _id: { $in: currencyGroupGames_ids } } }, //-
                    {
                        $project: {
                            _id: 0,
                            data: "$$ROOT",
                            backupId: issueId,
                        },
                    },
                    ...(EXECUTE
                        ? [
                              {
                                  $merge: {
                                      into: { db: "minigame_rm", coll: "currency_group_games_rm" },
                                  },
                              },
                          ]
                        : []),
                ]),
            )
            .toArray();
        console.log("currency_group_games_rm", dbs.minigame_rm.currency_group_games_rm.find({ backupId: issueId }).toArray());

        console.log("game_configs", dbs.minigame.game_configs.deleteMany({ _id: { $in: gameConfigs_ids } }));
        console.log("currency_group_games", dbs.minigame.currency_group_games.deleteMany({ _id: { $in: currencyGroupGames_ids } }));

        console.log("game_configs", dbs.minigame.game_configs.find({ gameId: 114 }).toArray());
        console.log("currency_group_games", dbs.minigame.currency_group_games.find({ gameId: 114 }).toArray());
    }
}
