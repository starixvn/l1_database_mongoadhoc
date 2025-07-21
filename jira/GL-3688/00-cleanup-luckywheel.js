local.forEach((dbs) => {
    const backupId = "GL-3688";
    const filter = { name: "luckywheel" };

    const gameConfigs = dbs.minigame.game_configs;
    const rmGameConfigs = dbs.minigame_rm.game_configs_rm;

    {
        console.table(gameConfigs.find(filter, { _id: 1, name: 1, gameId: 1, type: 1 }).toArray());
    }

    const data = gameConfigs
        .aggregate(
            /** @type {CollectionAggregationPipeline} */
            ([
                { $match: filter }, // -
                { $project: { _id: 0, backupId: { $literal: backupId }, data: "$$ROOT" } },
                { $merge: { into: { db: "minigame_rm", coll: "game_configs_rm" } } },
            ]),
        )
        .toArray();
    console.log(ISODate().toISOString(), dbs, data);

    const rmData = rmGameConfigs
        .find({ backupId }, { _id: "$data._id" })
        .map(({ _id }) => _id)
        .toArray();
    const results = gameConfigs.deleteMany({ _id: { $in: rmData } });
    console.log(ISODate().toISOString(), dbs, results);

    {
        console.table(gameConfigs.find(filter, { _id: 1, name: 1, gameId: 1, type: 1 }).toArray());
    }
});
