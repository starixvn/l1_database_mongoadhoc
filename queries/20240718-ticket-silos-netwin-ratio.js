{
    const db = l2_pro.minigame;

    const silo = db.ticket_silos;

    silo.aggregate([
        {
            $match: {
                roundTime: {
                    $gte: ISODate("2024-02-01"),
                    $lt: ISODate("2024-07-01"),
                },
            },
        },
        {
            $group: {
                _id: {
                    gameId: "$gameId",
                    currency: "$currency",
                },
                stake: { $sum: "$stake" },
                winloss: { $sum: "$winloss" },
                win: { $sum: { $max: ["$winloss", 0] } },
                loss: { $sum: { $min: ["$winloss", 0] } },
            },
        },
        {
            $lookup: {
                from: "game_configs",
                localField: "_id.gameId",
                foreignField: "gameId",
                pipeline: [{ $project: { _id: 0, type: 1 } }],
                as: "__gc",
            },
        },
        { $unwind: "$__gc" },
        {
            $group: {
                _id: {
                    type: { $cond: [{ $in: ["$__gc.type", [2, 3]] }, "slot", "other"] },
                },
                stake: { $sum: "$stake" },
                winloss: { $sum: "$winloss" },
                win: { $sum: "$win" },
                loss: { $sum: "$loss" },
            },
        },
        {
            $set: {
                _id: "$$REMOVE",
                type: "$_id.type",
            },
        },
    ]);
}
