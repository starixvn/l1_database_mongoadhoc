{
    const db = l2_pro.minigame;

    db.currency_group_games.aggregate([
        { $project: { _id: { _id: "$_id", feature: "568win" }, data: "$$ROOT" } },
        {
            $merge: {
                into: { db: "minigame_backup", coll: "bk_currency_group_games" },
                whenMatched: "keepExisting",
                whenNotMatched: "insert",
            },
        },
    ]);
}

{
    const db = l2_pro.minigame;

    const res = db
        .aggregate([
            {
                $documents: [
                    {
                        from: { operatorId: "ONEworksVGCash", groupName: "Cash_INH" },
                        to: { operatorId: "SabaPlay", groupName: "Cash_VN" },
                    },
                    {
                        from: { operatorId: "ONEworksVGCash", groupName: "Cash_Asia" },
                        to: { operatorId: "SabaPlay", groupName: "Cash_CN" },
                    },
                    {
                        from: { operatorId: "ONEworksVGCash", groupName: "Cash_0.1Base" },
                        to: { operatorId: "SabaPlay", groupName: "Cash_PHP" },
                    },
                    {
                        from: { operatorId: "ONEworksVGCash", groupName: "Cash_Thai" },
                        to: { operatorId: "SabaPlay", groupName: "Cash_Thai" },
                    },
                    {
                        from: { operatorId: "ONEworksVGCash", groupName: "Cash_Indo" },
                        to: { operatorId: "SabaPlay", groupName: "Cash_Indo" },
                    },
                    {
                        from: { operatorId: "ONEworksVGCash", groupName: "Cash_Korea" },
                        to: { operatorId: "SabaPlay", groupName: "Cash_Korea" },
                    },
                    {
                        from: { operatorId: "ONEworksVGCash", groupName: "Cash_0.1Base" },
                        to: { operatorId: "SabaPlay", groupName: "Cash_0.1Base" },
                    },
                    {
                        from: { operatorId: "ONEworksVGCash", groupName: "Cash_EGP" },
                        to: { operatorId: "SabaPlay", groupName: "Cash_EGP" },
                    },
                    {
                        from: { operatorId: "ONEworksVGCash", groupName: "Cash_2Base" },
                        to: { operatorId: "SabaPlay", groupName: "Cash_2Base" },
                    },
                    {
                        from: { operatorId: "ONEworksVGCash", groupName: "Cash_5Base" },
                        to: { operatorId: "SabaPlay", groupName: "Cash_5Base" },
                    },
                    {
                        from: { operatorId: "ONEworksVGCash", groupName: "Cash_10Base" },
                        to: { operatorId: "SabaPlay", groupName: "Cash_USD" },
                    },
                    {
                        from: { operatorId: "ONEworksVGCash", groupName: "Cash_EURO" },
                        to: { operatorId: "SabaPlay", groupName: "Cash_EURO" },
                    },
                ],
            },
            {
                $lookup: {
                    from: "currency_groups",
                    localField: "from.groupName",
                    foreignField: "name",
                    let: { operatorId: "$from.operatorId" },
                    pipeline: [{ $match: { $expr: { $eq: ["$partnerId", "$$operatorId"] } } }, { $project: { _id: 1, name: 1, partnerId: 1 } }],
                    as: "from",
                },
            },
            { $unwind: "$from" },
            {
                $lookup: {
                    from: "currency_groups",
                    localField: "to.groupName",
                    foreignField: "name",
                    let: { operatorId: "$to.operatorId" },
                    pipeline: [{ $match: { $expr: { $eq: ["$partnerId", "$$operatorId"] } } }, { $project: { _id: 1, name: 1, partnerId: 1 } }],
                    as: "to",
                },
            },
            { $unwind: "$to" },
            {
                $lookup: {
                    from: "currency_group_games",
                    localField: "from._id",
                    foreignField: "groupId",
                    pipeline: [{ $project: { _id: 0 } }],
                    as: "cgg",
                },
            },
            { $unwind: "$cgg" },
            { $set: { "cgg.groupId": "$to._id" } },
            { $replaceWith: "$cgg" },
            {
                $merge: {
                    into: "currency_group_games",
                    on: ["groupId", "gameId"],
                    whenMatched: "keepExisting",
                    whenNotMatched: "insert",
                },
            },
        ])
        .toArray();

    console.log(res);
}
