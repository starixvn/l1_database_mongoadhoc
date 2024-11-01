{
    const dbs = l2;

    const res = dbs.admin
        .aggregate([
            { $currentOp: { allUsers: true, idleConnections: false } },
            {
                $match: {
                    "command.hello": null,
                    "command.ismaster": null,
                    "command.isMaster": null,
                    "command": { $ne: {} }
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
