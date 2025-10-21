{
    const dbs = l2_uat;

    dbs.minigame.result_chains
        .aggregate([
            { $project: { _id: 0, backupId: "GL-5639", data: "$$ROOT" } }, // -
            { $merge: { into: { db: "minigame_rm", coll: "result_chains_rm" } } },
        ])
        .toArray();

    dbs.minigame.player_chain_assignments.aggregate([
        {
            $match: {
                chainName: {
                    $in: dbs.minigame_rm.result_chains_rm // -
                        .find({}, { _id: "$data.name" })
                        .map(({ _id }) => _id)
                        .toArray(),
                },
            },
        },
        { $project: { _id: 0, backupId: "GL-5639", data: "$$ROOT" } },
        { $merge: { into: { db: "minigame_rm", coll: "player_chain_assignments_rm" } } },
    ]);

    dbs.minigame.player_chain_assignments.deleteMany({
        _id: {
            $in: dbs.minigame_rm.player_chain_assignments_rm // -
                .find({}, { _id: "$data._id" })
                .map(({ _id }) => _id)
                .toArray(),
        },
    });

    dbs.minigame.result_chains.deleteMany({
        _id: {
            $in: dbs.minigame_rm.result_chains_rm // -
                .find({}, { _id: "$data._id" })
                .map(({ _id }) => _id)
                .toArray(),
        },
    });
}

{
    const dbs = l2_pro;

    const data = EJSON.parse(
        fs
            .readFileSync(
                // "/home/billy.bui@SIT/VG2-result_chains_20251016.json", // -
                "E:/vnBilly/data/VG2-result_chains_20251016.json", // -
            )
            .toString(),
    );
    dbs.minigame.result_chains.insertMany(data);
}

{
    const gameIds = [66, 126, 128, 129, 130, 131, 139, 140, 142, 155];
    const dbs = l2_pro;

    dbs.minigame.game_configs.updateMany(
        { gameId: { $in: gameIds } }, // -
        { $set: { "cascadingSlotsConfig.resultChains": { enabled: true, reload: true } } },
    );
}
