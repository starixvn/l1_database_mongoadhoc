// archive
{
    const db = l1_pro_arc.log_arc;
    const coll = db.bets_bk;

    const pipeline = [
        {$match: {
            system: {$in: [1,4]},
            "call.gameTypeId": {$in: [52,53,14,15,16,17,18,19,40,41,36,37]},
            _id: {$gt: ObjectId.createFromTime(ISODate("2025-01-01") / 1000)}

        }},
        {$group: {
            _id: "$system",
            ticketCount: {$sum: 1},
            TO: {
                $sum: {$toDouble: "$call.amount"}
            }
        }}
    ];

    const result_arc = coll.aggregate(pipeline).toArray();
    console.table(result_arc);
}