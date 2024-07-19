{
    const db = l1_uat_arc.minigame_arc;

    const res = db.footballdice_rounds_bk
        .aggregate([
            { $match: { time: { $gte: ISODate("2024-06-16") } } },
            {
                $group: {
                    _id: "",
                    cnt: { $sum: 1 },
                    home: { $sum: { $toInt: "$settlementResult.home" } },
                    away: { $sum: { $toInt: "$settlementResult.away" } },
                    draw: { $sum: { $toInt: "$settlementResult.draw" } },
                    draw12: { $sum: { $toInt: "$settlementResult.draw12" } },
                },
            },
            { $set: { _id: "$$REMOVE" } },
        ])
        .toArray();

    console.log(JSON.stringify(res));
}

{
    const db = l2_uat_arc.minigame_arc;

    let str = "";
    db.footballdice_rounds_bk
        .aggregate([
            { $match: { time: { $gte: ISODate("2024-06-16") } } },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    val: {
                        $switch: {
                            branches: [
                                { case: "$settlementResult.home", then: "H" },
                                { case: "$settlementResult.away", then: "A" },
                                { case: "$settlementResult.draw", then: "D" },
                            ],
                            default: "X",
                        },
                    },
                    prev: { $subtract: ["$id", 1] },
                },
            },
            {
                $lookup: {
                    from: "footballdice_rounds_bk",
                    localField: "prev",
                    foreignField: "id",
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                val: {
                                    $switch: {
                                        branches: [
                                            { case: "$settlementResult.home", then: "H" },
                                            { case: "$settlementResult.away", then: "A" },
                                            { case: "$settlementResult.draw", then: "D" },
                                        ],
                                        default: "X",
                                    },
                                },
                            },
                        },
                    ],
                    as: "prev",
                },
            },
            { $unwind: "$prev" },
            { $sort: { id: 1 } },
            {
                $project: {
                    val: { $concat: [{ $cond: [{ $eq: ["$val", "$prev.val"] }, "", "-"] }, "$val"] },
                },
            },
        ])
        .forEach(({ val }) => {
            str += val;
        });

    const result = { H: {}, A: {}, D: {} };
    str.split("-").forEach((val) => {
        result[val[0]][val.length] = (result[val[0]][val.length] ?? 0) + 1;
    });

    console.log(result);
}

{
    const db = l2_uat_arc.minigame_arc;

    const res = db.spaceflight_rounds_bk
        .aggregate([
            { $match: { time: { $gte: ISODate("2024-06-16") } } },
            {
                $group: {
                    _id: { $round: ["$result", 0] },
                    cnt: { $sum: 1 },
                },
            },
        ])
        .toArray();

    console.log(JSON.stringify(res));
}
