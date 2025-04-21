{
    const dbs = l1_pro;
    const issueId = "GL-1455";

    dbs.minigame.game_configs.aggregate(
        /** @type { CollectionAggregationPipeline }  */ ([
            { $project: { _id: 0, data: "$$ROOT", backupId: issueId } }, //-
            { $merge: { into: { db: "minigame_rm", coll: "game_configs_rm" } } },
        ]),
    );

    console.log(dbs.minigame_rm.game_configs_rm.find({ backupId: issueId }).toArray());
}
