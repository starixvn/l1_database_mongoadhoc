// @ts-check
(async () => {
    const dbs = l2_pro;
    const backupId = "GL-6481";

    const chains = [
        "wave-veryhigh-100boards-bet4_00-1761297049307",
        "wave-veryhigh-100boards-bet10_00-1761297107342",
        "tease-veryhigh-100boards-bet4_00-1761298695119",
        "comeback-veryhigh-75boards-bet3_00-1761298981708",
        "comeback-veryhigh-100boards-bet3_00-1761299184756",
        "wave-100boards-bet7_00-1760524091716",
        "wave-100boards-bet4_00-1760524057423",
    ];

    {
        (
            await dbs.minigame.result_chains.aggregate(
                /** @type {CollectionAggregationPipeline} */ ([
                    { $match: { name: { $in: chains } } }, // -
                    { $project: { _id: 0, backupId, data: "$$ROOT" } }, // -
                    { $merge: { into: { db: "minigame_rm", coll: "result_chains_rm" } } },
                ]),
            )
        ).toArray();
        const rmData = await dbs.minigame_rm.result_chains_rm
            .find({ backupId }, { _id: "$data._id" })
            .map(({ _id }) => _id)
            .toArray();
        console.log(ISODate().toISOString(), "result_chains_rm", rmData.length);
        console.log(ISODate().toISOString(), "result_chains", dbs.minigame.result_chains.deleteMany({ _id: { $in: rmData } }));
    }
})();
