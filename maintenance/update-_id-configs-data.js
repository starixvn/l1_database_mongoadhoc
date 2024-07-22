[l1_pro, l2_pro, sn_pro].forEach((dbs) => {
    const coll = dbs.ops_configs.archive_configs;
    coll.find()
        .toArray()
        .forEach((_) => {
            const { _id, gameConfigs, id } = _;
            _._id = { gameConfigs, id };
            coll.deleteOne({ _id });
            coll.insertOne(_);
        });
});

[l1_pro, l2_pro, sn_pro].forEach((dbs) => {
    const coll = dbs.ops_configs.archive_templates;
    coll.find()
        .toArray()
        .forEach((_) => {
            const { _id, category, type } = _;
            _._id = { category, type };
            coll.deleteOne({ _id });
            coll.insertOne(_);
        });
});

[l1_pro, l2_pro, sn_pro].forEach((dbs) => {
    const coll = dbs.ops_configs.index_templates;
    coll.find()
        .toArray()
        .forEach((_) => {
            const { _id, category, type } = _;
            _._id = { category, type };
            coll.deleteOne({ _id });
            coll.insertOne(_);
        });
});

[l1_pro, l2_pro, sn_pro].forEach((dbs) => {
    const coll = dbs.ops_configs.summary_configs;
    coll.find()
        .toArray()
        .forEach((_) => {
            const { _id, gameConfigs, id } = _;
            _._id = { gameConfigs, id };
            coll.deleteOne({ _id });
            coll.insertOne(_);
        });
});

[l1_pro, l2_pro, sn_pro].forEach((dbs) => {
    const coll = dbs.ops_configs.summary_templates;
    coll.find()
        .toArray()
        .forEach((_) => {
            const { _id, category, type } = _;
            _._id = { category, type };
            coll.deleteOne({ _id });
            coll.insertOne(_);
        });
});

[l1_pro, l2_pro, sn_pro].forEach((dbs) => {
    const coll = dbs.summary.game_summary_config;
    coll.find()
        .toArray()
        .forEach((_) => {
            const { _id, gameId } = _;
            _._id = { gameId };
            coll.deleteOne({ _id });
            coll.insertOne(_);
        });
});

[l1_pro, l2_pro, sn_pro].forEach((dbs) => {
    const coll = dbs.minigame.global_configs;
    coll.find({ type: { $in: ["kenomatch_liveodds", "exchange_codes"] } })
        .toArray()
        .forEach((_) => {
            const { _id, type } = _;
            _._id = { type };
            coll.deleteOne({ _id });
            coll.insertOne(_);
        });
});
