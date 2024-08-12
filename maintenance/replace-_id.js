[l1_pro, l2_pro, sn_pro].forEach((dbs) => {
    const _id = {
        kenomatch_liveodds: ObjectId(
            `${Math.floor(new Date("2021-10-04T00:00:00Z").valueOf() / 1000).toString(16)}${"liveodds"
                .split("")
                .map((_) => _.charCodeAt(0).toString(16))
                .join("")}`
        ),
        exchange_codes: ObjectId(
            `${Math.floor(new Date("2021-12-14T00:00:00Z").valueOf() / 1000).toString(16)}${"ex_codes"
                .split("")
                .map((_) => _.charCodeAt(0).toString(16))
                .join("")}`
        ),
    };

    const liveOdds = dbs.minigame.global_configs.findOne({ type: "kenomatch_liveodds" });
    const exCodes = dbs.minigame.global_configs.findOne({ type: "exchange_codes" });

    const liveOdds_id = liveOdds?._id;
    const exCodes_id = exCodes._id;

    console.log(dbs, JSON.stringify([liveOdds_id, exCodes_id]));

    if (liveOdds) {
        liveOdds._id = _id.kenomatch_liveodds;
    }
    exCodes._id = _id.exchange_codes;

    const res = dbs.minigame.global_configs.bulkWrite(
        [
            {
                deleteMany: { filter: { _id: { $in: [liveOdds_id, exCodes_id].filter(Boolean) } } },
            },
            !liveOdds ? null : { insertOne: { document: liveOdds } },
            { insertOne: { document: exCodes } },
        ].filter(Boolean)
    );

    console.log(dbs, JSON.stringify(res));

    {
        const liveOdds = dbs.minigame.global_configs.findOne({ type: "kenomatch_liveodds" });
        const exCodes = dbs.minigame.global_configs.findOne({ type: "exchange_codes" });

        const liveOdds_id = liveOdds?._id;
        const exCodes_id = exCodes._id;

        console.log(dbs, JSON.stringify([liveOdds_id, exCodes_id]));
    }
});
