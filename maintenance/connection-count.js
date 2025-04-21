{
    const dbs = l2pp;

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
