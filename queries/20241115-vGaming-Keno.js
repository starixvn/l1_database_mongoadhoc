{
    const db = l1_pro_arc.log_arc;
    JSON.stringify(
        db.signin_requests_bk.aggregate([{ $match: { "request.gameTypeId": 102 } }, { $group: { _id: { $substrCP: ["$requestTimeStamp", 0, 10] }, cnt: { $sum: 1 } } }]).toArray(),
    );
}

{
    const db = l2_pro_arc.log_arc;
    JSON.stringify(
        db.signin_requests_bk.aggregate([{ $match: { "request.gameTypeId": 102 } }, { $group: { _id: { $substrCP: ["$requestTimeStamp", 0, 10] }, cnt: { $sum: 1 } } }]).toArray(),
    );
}

{
    const db = l2_pro_arc.log_arc;
    JSON.stringify(
        db.signin_requests_bk.aggregate([{ $match: { "request.appType": 4 } }, { $group: { _id: { $substrCP: ["$requestTimeStamp", 0, 10] }, cnt: { $sum: 1 } } }]).toArray(),
    );
}

{
    const db = l2_pro_arc.log_arc;
    JSON.stringify(
        db.bets_bk
            .aggregate(
                /** @satisfies { import("@ldb/mongo").CollectionAggregationPipeline } */
                ([
                    { $match: { system: 4 } },
                    {
                        $group: {
                            _id: { gameId: "$call.gameTypeId", currency: "$call.currency" },
                            cnt: { $sum: 1 },
                            amount: { $sum: { $toDouble: "$call.amount" } },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            gameId: "$_id.gameId",
                            currency: "$_id.currency",
                            cnt: 1,
                            amount: 1,
                        },
                    },
                ]),
            )
            .toArray(),
    );
}
