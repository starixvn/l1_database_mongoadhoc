{
    const dbsArc = l2_uat_arc;
    const dbs = l2_uat;

    const log = (...args) => console.log(new Date().toISOString(), dbs, dbsArc, ...args);

    log("Drop user_silos_tmp", dbsArc.minigame_arc.user_silos_tmp.drop());
    log(
        "Extract usersession_bk",
        dbsArc.minigame_arc.usersessions_bk
            .aggregate([
                { $match: { currencyGroupId: { $ne: null } } },
                { $sort: { _id: -1 } },
                {
                    $group: {
                        _id: { $toObjectId: "$userId" },
                        currency: { $first: "$currencyName" },
                        currencyCode: { $first: "$currencyCode" },
                        currencyGroupId: { $first: { $toObjectId: "$currencyGroupId" } },
                        disableJackpotGames: { $first: "$disableJackpotGames" },
                        isTestCurrency: { $first: "$isTestCurrency" },
                        language: { $first: "$language" },
                        lastRecheckInTime: { $max: "$recheckInTime" },
                        lastSsoTime: { $max: "$ssoTime" },
                        operatorId: { $first: { $ifNull: ["$operatorId", "$partnerId"] } },
                        playerId: { $first: { $ifNull: ["$playerId", "$memberId"] } },
                        playerName: { $first: { $ifNull: ["$playerName", "$memberName"] } },
                        siteId: { $first: "$siteId" },
                        siteName: { $first: "$siteName" },
                        system: { $first: "$system" },
                    },
                },
                { $set: { disableJackpotGames: { $ifNull: ["$disableJackpotGames", true] } } },
                { $merge: { into: { db: "minigame_arc", coll: "user_silos_tmp" } } },
            ])
            .toArray()
    );
    {
        let data = [];
        dbsArc.minigame_arc.user_silos_tmp.find().forEach((doc) => {
            data.push(doc);
            if (data.length >= 100_000) {
                log("Move data to active", Object.entries(dbs.minigame.user_silos_tmp.insertMany(data, { ordered: false }).insertedIds).length);
                data = [];
            }
        });
        log("Move data to active", Object.entries(dbs.minigame.user_silos_tmp.insertMany(data, { ordered: false }).insertedIds).length);
    }

    log(
        "Collect user info",
        dbs.minigame.user_silos_tmp
            .aggregate([
                { $project: { _id: 1 } },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 0, "local.regDate": 1, operatorPlayerId: 1 } }, { $limit: 1 }],
                        as: "__user",
                    },
                },
                { $unwind: { path: "$__user", preserveNullAndEmptyArrays: true } },
                {
                    $set: {
                        regTime: "$__user.local.regDate",
                        operatorPlayerId: "$__user.operatorPlayerId",
                        __user: "$$REMOVE",
                    },
                },

                { $set: { __userinfo: { $toString: "$_id" } } },
                {
                    $lookup: {
                        from: "userinfos",
                        localField: "__userinfo",
                        foreignField: "id",
                        pipeline: [{ $project: { _id: 0, name: 1, joinedOn: 1 } }, { $limit: 1 }],
                        as: "__userinfo",
                    },
                },
                {
                    $unwind: {
                        path: "$__userinfo",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $set: {
                        nickName: "$__userinfo.name",
                        joinTime: "$__userinfo.joinedOn",
                        __userinfo: "$$REMOVE",
                    },
                },
                { $merge: { into: "user_silos_tmp" } },
            ])
            .toArray()
    );

    log(
        "Merge to current user silo",
        dbs.minigame.user_silos_tmp
            .aggregate([
                { $match: { regTime: { $ne: null }, joinTime: { $ne: null } } },
                {
                    $merge: {
                        into: "user_silos",
                        whenMatched: "keepExisting",
                    },
                },
            ])
            .toArray()
    );
    log("Count imported user_silos", dbs.minigame.user_silos.countDocuments({ __v: null }));

    log("Drop user_silos_tmp", dbs.minigame.user_silos_tmp.drop());
    log("Drop user_silos_tmp", dbsArc.minigame_arc.user_silos_tmp.drop());
}
