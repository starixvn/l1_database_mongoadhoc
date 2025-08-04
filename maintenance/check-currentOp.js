{
    const dbs = l1_pro;

    const res = dbs.admin
        .aggregate([
            { $currentOp: { allUsers: true, idleConnections: false } },
            {
                $match: {
                    "command.hello": null,
                    "command.ismaster": null,
                    "command.isMaster": null,
                    command: { $ne: {} },
                    "cursor.originatingCommand.pipeline.$changeStream": { $not: { $exists: true } },
                },
            },
            // { $match: { appName: /admin@/, active: true } },
            // {
            //     $project: {
            //         type: 1,
            //         app: { $ifNull: ["$appName", "$desc"] },
            //         active: 1,
            //         ns: 1,
            //         op: 1,
            //         ms: { $divide: ["$microsecs_running", 1000] },
            //     },
            // },
            {
                $set: {
                    "command.lsid": "$$REMOVE",
                },
            },
            { $sort: { app: 1, ms: -1 } },
        ])
        .toArray();

    // console.table(res);
    res;
}

{
    // dbs.admin
    db
        .aggregate([
            { $currentOp: { allUsers: true, idleConnections: true } }, //-
            { $match: { isFromUserConnection: true } },
            {
                $group: {
                    _id: { host: { $arrayElemAt: [{ $split: ["$client", ":"] }, 0] } },
                    cnt: { $sum: 1 },
                },
            },
        ])
        .toArray();
}

{
    dbs.admin
        .aggregate([
            { $currentOp: { allUsers: true, idleConnections: true } }, //-
        ])
        .toArray();
}
