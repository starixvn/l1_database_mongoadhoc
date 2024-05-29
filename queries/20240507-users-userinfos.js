{
    const db = l1_pro.minigame;

    const userColl = db.getCollection("users");
    const userinfoColl = db.getCollection("userinfos");

    const userData = userColl
        .aggregate([
            { $limit: 10 },
            {
                $match: {
                    _id: { $lt: ObjectId("663186000000000000000000") },
                    playerId: { $ne: null },
                },
            },
            {
                $project: {
                    _id: 1,
                    id: { $toString: "$_id" },
                    playerId: 1,
                    operatorId: 1,
                    playerName: "$local.memberName",
                    currency: "$local.currency",
                    regDate: "$local.regDate",
                },
            },
            {
                $lookup: {
                    from: userinfoColl.getName(),
                    localField: "id",
                    foreignField: "id",
                    as: "ui",
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                banned: 1,
                                type: 1,
                                currency: 1,
                                joinedOn: 1,
                                betLimitModifiedDate: 1,
                            },
                        },
                    ],
                },
            },
            { $unwind: { path: "$ui", preserveNullAndEmptyArrays: true } },
            {
                $set: {
                    id: "$$REMOVE",
                    ui: "$$REMOVE",
                    banned: "$ui.banned",
                    type: "$ui.type",
                    currency: "$ui.currency",
                    joinedOn: "$ui.joinedOn",
                    betLimitModifiedDate: "$ui.betLimitModifiedDate",
                },
            },
        ])
        .toArray();

    console.table(userData);
}

{
    const db = l1_pro_arc.cleanupUsers;

    const userColl = db.getCollection("users");
    const userinfoColl = db.getCollection("userinfos");

    const userData = userColl
        .aggregate(
            [
                {
                    $match: {
                        _id: { $lt: ObjectId("663186000000000000000000") },
                        playerId: { $ne: null },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        id: { $toString: "$_id" },
                        playerId: 1,
                        operatorId: 1,
                        playerName: "$local.memberName",
                        currency: "$local.currency",
                        regTime: "$local.regDate",
                    },
                },
                {
                    $lookup: {
                        from: userinfoColl.getName(),
                        localField: "id",
                        foreignField: "id",
                        as: "ui",
                        pipeline: [
                            {
                                $project: {
                                    _id: 0,
                                    banned: 1,
                                    type: 1,
                                    currency: 1,
                                    joinedOn: 1,
                                    betLimitModifiedDate: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $match: { $expr: { $eq: [{ $size: "$ui" }, 0] } },
                },
                {
                    $set: {
                        ui: "$$REMOVE",
                        regMonth: { $toDate: { $dateFromParts: { year: { $year: "$regTime" }, month: { $month: "$regTime" } } } },
                    },
                },
                {
                    $group: {
                        _id: "$regMonth",
                        // users: { $addToSet: "$$ROOT" },
                        count: { $sum: 1 },
                    },
                },
            ]
        )
        .toArray();

    console.table(userData);
    console.log(JSON.stringify(userData));
}
