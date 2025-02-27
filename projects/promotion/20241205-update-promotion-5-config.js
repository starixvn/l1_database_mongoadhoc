{
    const time = ISODate();

    const [db, dbbk] = [l2_pro.minigame, l2_pro.minigame_backup];
    const filter = { promotionId: 5 };
    const { startDateTime } = db.promotion_configs.findOne(filter, { _id: 0, startDateTime: 1 });

    ["promotion_configs", "promotion_runs", "promotion_leaderboards"].forEach((collName) => {
        console.log(
            collName,
            dbbk.getCollection(`bk_${collName}`).insertMany(
                db
                    .getCollection(collName)
                    .aggregate([
                        { $match: filter }, //
                        { $project: { _id: 0, time, data: "$$ROOT" } },
                    ])
                    .toArray(),
            ),
        );
    });

    console.log(
        "promotion_bets",
        dbbk.bk_promotion_bets.insertMany(
            db.promotion_bets
                .aggregate([
                    { $match: { dataSourceTimeStamp: { $gte: startDateTime } } }, //
                    { $project: { _id: 0, time, data: "$$ROOT" } },
                ])
                .toArray(),
        ),
    );

    console.log(
        "Remove includedSiteName",
        db.promotion_configs.updateOne(
            filter, //
            { $set: { "operators.$[op].includedSiteNames": null, status: "new" } },
            { arrayFilters: [{ "op.operatorId": "ONEworksVGCash" }] },
        ),
    );

    console.log("Delete runs", db.promotion_runs.deleteMany(filter));
    console.log("Delete leaderboards", db.promotion_leaderboards.deleteMany(filter));
    console.log("Delete bets", db.promotion_bets.deleteMany({ dataSourceTimeStamp: { $gte: startDateTime } }));
}
