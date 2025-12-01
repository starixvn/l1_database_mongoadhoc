{
    const dbs = l1_pro;

    const res = dbs.admin
        .aggregate(
            /** @type {DatabaseAggregationPipeline} */ ([
                { $currentOp: { allUsers: true, idleConnections: true } }, //-
                { $group: { _id: "$appName", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
        )
        .toArray();

    console.table(res);
    // res;
}
{
    const dbs = l1_pro;
    const res = dbs.admin
        .aggregate(
            /** @type {DatabaseAggregationPipeline} */ [
                { $currentOp: { allUsers: true, idleConnections: true } },
                /*-*/ { $group: { _id: { appName: "$appName", clientIP: { $arrayElemAt: [{ $split: ["$client", ":"] }, 0] } }, count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $project: { _id: 0, appName: "$_id.appName", clientIP: "$_id.clientIP", count: 1 } },
            ],
        )
        .toArray();
    console.table(res);
}

{
    const res = db
        .aggregate(
            /** @type {DatabaseAggregationPipeline} */ [
                { $currentOp: { allUsers: true, idleConnections: true } },
                /*-*/ { $group: { _id: { appName: "$appName", clientIP: { $arrayElemAt: [{ $split: ["$client", ":"] }, 0] } }, count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $project: { _id: 0, appName: "$_id.appName", clientIP: "$_id.clientIP", count: 1 } },
            ],
        )
        .toArray();
    console.table(res);
}
