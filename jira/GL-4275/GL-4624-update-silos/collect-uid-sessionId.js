// @ts-check
(async () => {})();

{
    const dbs = l1_uat;
    const dbs_arc = l1_uat_arc;
    dbs.ops_configs.summary_configs
        .find(
            {},
            {
                _id: 0,
                gameId: "$gameConfigs.gameId",
                db: { $concat: ["$db", "_arc"] },
                coll: { $concat: ["$gameConfigs.name", { $ifNull: ["$coll.bet", "$coll.round"] }, "_bk"] },
            },
        )
        .forEach(({ gameId, db, coll }) => {
            console.log(dbs_arc, gameId, db, coll);

            const { time } = dbs_arc[db].ticket_silos_bk.findOne({ gameId }, { _id: 0, time: 1 }, { sort: { _id: 1 } }) ?? { time: ISODate("2024-01-01") };
            console.log(dbs_arc, gameId, time);

            console.log(
                dbs_arc,
                dbs_arc[db].getCollection(coll).aggregate([
                    { $match: { time: { $gte: time } } },
                    { $project: { _id: 1, uid: 1, time: 1 } },
                    {
                        $lookup: {
                            from: "usersessions_bk",
                            localField: "uid",
                            foreignField: "userId",
                            let: { time: "$time" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $gte: ["$$time", "$ssoTime"] },
                                                { $lte: ["$$time", { $dateAdd: { startDate: "$recheckInTime", unit: "minute", amount: 1 } }] },
                                            ],
                                        },
                                    },
                                },
                                { $sort: { ssoTime: -1 } },
                                { $project: { _id: 0, sessionId: 1 } },
                                { $limit: 1 },
                            ],
                            as: "sessionId",
                        },
                    },
                    { $unwind: { path: "$sessionId", preserveNullAndEmptyArrays: true } },
                    { $set: { uid: { $toObjectId: "$uid" }, sessionId: "$sessionId.sessionId", time: "$$REMOVE" } },
                    { $merge: { into: "ticket_silos_bk", whenMatched: "merge", whenNotMatched: "discard" } },
                ]),
            );
        });
}
