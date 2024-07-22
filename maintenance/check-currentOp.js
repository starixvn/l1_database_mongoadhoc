{
    const dbs = l1;

    const res = dbs.admin
        .aggregate([
            { $currentOp: { allUsers: true, idleConnections: false } },
            { $match: { appName: /admin@/, active: true } },
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
            { $sort: { app: 1, ms: -1 } },
        ])
        .toArray();

    console.log(res);
}
