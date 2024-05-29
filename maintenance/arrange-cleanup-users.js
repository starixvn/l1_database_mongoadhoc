{
    console.log("BANNED BOT");

    const db = l1_pro_arc.cleanupUsers;

    db.userinfos.aggregate([{ $match: { type: true, banned: true } }, { $merge: { into: "removeUserInfos.bannedBot" } }]);

    db.userinfos.deleteMany({
        _id: {
            $in: db.removeUserInfos.bannedBot
                .find({}, { _id: 1 })
                .map((_) => _._id)
                .toArray(),
        },
    });

    db.removeUserInfos.bannedBot.aggregate([
        { $project: { _id: { $toObjectId: "$id" } } },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "u",
            },
        },
        { $unwind: "$u" },
        { $replaceWith: "$u" },
        { $merge: { into: "removeUsers.bannedBot" } },
    ]);

    db.users.deleteMany({
        _id: {
            $in: db.removeUsers.bannedBot
                .find({}, { _id: 1 })
                .map((_) => _._id)
                .toArray(),
        },
    });
}

{
    console.log("NO USERINFOS");

    const db = l1_pro_arc.cleanupUsers;

    db.users.aggregate([
        { $set: { _id_: { $toString: "$_id" } } },
        {
            $lookup: {
                from: "userinfos",
                localField: "_id_",
                foreignField: "id",
                as: "ui",
            },
        },
        { $match: { $expr: { $eq: [{ $size: "$ui" }, 0] } } },
        { $unset: ["_id_", "ui"] },
        { $merge: { into: "removeUsers.noUserInfo" } },
    ]);

    db.users.deleteMany({
        _id: {
            $in: db.removeUsers.noUserInfo
                .find({}, { _id: 1 })
                .map((_) => _._id)
                .toArray(),
        },
    });
}

{
    console.log("GET STATS SIGNIN");

    const db = l2_pro_arc.log_arc;

    db.signin_requests_bk.aggregate([
        {
            $project: {
                _id: 0,
                time: { $toDate: "$requestTimeStamp" },
                playerId: { $toString: { $ifNull: ["$request.playerId", "$request.memberId", "$request.obCustId"] } },
                operatorId: { $ifNull: ["$request.auth.operatorId", "$request.auth.partnerId", "$request.auth.clientId"] },
            },
        },
        {
            $group: {
                _id: { playerId: "$playerId" },
                firstSignInTime: { $min: "$time" },
                lastSignInTime: { $max: "$time" },
                count: { $sum: 1 },
                operatorId: { $addToSet: "$operatorId" },
            },
        },
        { $set: { _id: "$$REMOVE", playerId: "$_id.playerId" } },
        {
            $merge: {
                into: { db: "cleanupUsers", coll: "statistics.signin" },
            },
        },
    ]);
}

{
    console.log("STATS SIGNIN");

    const db = l2_pro_arc.cleanupUsers;

    db.statistics.signin.createIndex({ playerId: 1 });

    db.users.aggregate([
        { $match: { playerId: { $ne: null } } },
        { $project: { _id: 1, playerId: 1 } },
        {
            $lookup: {
                from: "statistics.signin",
                localField: "playerId",
                foreignField: "playerId",
                as: "s",
                pipeline: [{ $project: { _id: 0, firstSignInTime: 1, lastSignInTime: 1, count: 1 } }, { $limit: 1 }],
            },
        },
        { $unwind: "$s" },
        {
            $set: {
                s: "$$REMOVE",
                playerId: "$$REMOVE",
                __firstSignInTime: "$s.firstSignInTime",
                __lastSignInTime: "$s.lastSignInTime",
                __signInCount: "$s.count",
            },
        },
        {
            $merge: {
                into: "users",
                on: "_id",
                whenMatched: "merge",
                whenNotMatched: "discard",
            },
        },
    ]);

    db.userinfos.aggregate([
        { $match: { betLimitModifiedDate: { $ne: null } } },
        {
            $project: {
                _id: { $toObjectId: "$id" },
                __betLimitModifiedTime: "$betLimitModifiedDate",
            },
        },
        {
            $merge: {
                into: "users",
                on: "_id",
                whenMatched: "merge",
                whenNotMatched: "discard",
            },
        },
    ]);
}

{
    console.log("GET STATS BET");

    const db = l1_pro_arc.log_arc;

    db.bets_bk.aggregate([
        {
            $project: {
                _id: 0,
                time: { $toDate: "$requestTimeStamp" },
                playerId: { $toString: { $ifNull: ["$call.playerId", "$call.memberId", "$call.obCustId"] } },
                operatorId: { $ifNull: ["$call.operatorId", "$call.partnerId", "$call.clientId"] },
            },
        },
        {
            $group: {
                _id: { playerId: "$playerId" },
                firstBetTime: { $min: "$time" },
                lastBetTime: { $max: "$time" },
                count: { $sum: 1 },
                operatorId: { $addToSet: "$operatorId" },
            },
        },
        { $set: { _id: "$$REMOVE", playerId: "$_id.playerId" } },
        {
            $merge: {
                into: { db: "cleanupUsers", coll: "statistics.bet" },
            },
        },
    ]);
}

{
    console.log("STATS BET");

    const db = l2_pro_arc.cleanupUsers;

    db.statistics.bet.createIndex({ playerId: 1 });

    db.users.aggregate([
        { $match: { playerId: { $ne: null } } },
        { $project: { _id: 1, playerId: 1 } },
        {
            $lookup: {
                from: "statistics.bet",
                localField: "playerId",
                foreignField: "playerId",
                as: "b",
                pipeline: [{ $project: { _id: 0, firstBetTime: 1, lastBetTime: 1, count: 1 } }, { $limit: 1 }],
            },
        },
        { $unwind: "$b" },
        {
            $set: {
                b: "$$REMOVE",
                playerId: "$$REMOVE",
                __firstBetTime: "$b.firstBetTime",
                __lastBetTime: "$b.lastBetTime",
                __betReqCount: "$b.count",
            },
        },
        {
            $merge: {
                into: "users",
                on: "_id",
                whenMatched: "merge",
                whenNotMatched: "discard",
            },
        },
    ]);
}

{
    l1_pro_arc.cleanupUsers.statistics.ticket.createIndex({ playerId: 1, coll: 1 }, { unique: true });
}

{
    console.log("GET TICKET");

    const betColls = l2_pro.ops_configs.summary_configs
        .find({}, { _id: 0, coll: { $concat: ["$gameConfigs.name", { $ifNull: ["$coll.bet", "$coll.round"] }, "_bk"] } })
        .map((_) => _.coll)
        .toArray();

    const db = l2_pro_arc.minigame_arc;

    betColls.forEach((collName) => {
        const coll = db.getCollection(collName);

        console.log(collName);
        coll.aggregate([
            {
                $project: {
                    _id: 0,
                    playerId: { $toString: { $ifNull: ["$playerId", "$memberId"] } },
                    time: 1,
                },
            },
            { $match: { playerId: { $ne: null } } },
            {
                $group: {
                    _id: "$playerId",
                    minTime: { $min: "$time" },
                    maxTime: { $max: "$time" },
                    count: { $sum: 1 },
                },
            },
            {
                $set: {
                    _id: "$$REMOVE",
                    playerId: "$_id",
                    coll: { $literal: collName },
                },
            },
            {
                $merge: {
                    into: { db: "cleanupUsers", coll: "statistics.ticket" },
                    on: ["playerId", "coll"],
                },
            },
        ]);
    });
}

{
    console.log("STATS TICKET");
    const db = l1_pro_arc.cleanupUsers;

    db.statistics.ticket.aggregate([
        {
            $group: {
                _id: "$playerId",
                count: { $sum: "$count" },
                minTime: { $min: "$minTime" },
                maxTime: { $max: "$maxTime" },
            },
        },
        { $set: { playerId: "$_id", _id: "$$REMOVE" } },
        {
            $merge: {
                into: { db: "cleanupUsers", coll: "statistics.ticketGroup" },
            },
        },
    ]);

    db.statistics.ticketGroup.createIndex({ playerId: 1 });

    db.users.aggregate([
        { $match: { playerId: { $ne: null } } },
        { $project: { _id: 1, playerId: 1 } },
        {
            $lookup: {
                from: "statistics.ticketGroup",
                localField: "playerId",
                foreignField: "playerId",
                as: "t",
                pipeline: [{ $project: { _id: 0, minTime: 1, maxTime: 1, count: 1 } }, { $limit: 1 }],
            },
        },
        { $unwind: "$t" },
        {
            $set: {
                t: "$$REMOVE",
                playerId: "$$REMOVE",
                __firstTicketTime: "$t.minTime",
                __lastTicketTime: "$t.maxTime",
                __betCount: "$t.count",
            },
        },
        {
            $merge: {
                into: "users",
                on: "_id",
                whenMatched: "merge",
                whenNotMatched: "discard",
            },
        },
    ]);
}

{
    console.log("GET USERSESSION");

    const dbs = l3_pro_arc;
    const db = dbs.minigame_arc;

    db.usersessions_bk.aggregate([
        {
            $project: {
                _id: 0,
                ssoTime: 1,
                recheckInTime: 1,
                playerId: { $toString: { $ifNull: ["$playerId", "$memberId"] } },
                operatorId: { $ifNull: ["$operatorId", "$partnerId", "$clientId"] },
            },
        },
        {
            $group: {
                _id: { playerId: "$playerId" },
                firstSsoTime: { $min: "$ssoTime" },
                lastSsoTime: { $max: "$ssoTime" },
                firstRecheckInTime: { $min: "$recheckInTime" },
                lastRecheckInTime: { $max: "$recheckInTime" },
                count: { $sum: 1 },
                operatorId: { $addToSet: "$operatorId" },
            },
        },
        { $set: { _id: "$$REMOVE", playerId: "$_id.playerId" } },
        {
            $merge: {
                into: { db: "cleanupUsers", coll: "statistics.session" },
            },
        },
    ]);
}

{
    console.log("STATS USERSESSION");

    const db = l2_pro_arc.cleanupUsers;

    db.statistics.session.createIndex({ playerId: 1 });

    db.users.aggregate([
        { $match: { playerId: { $ne: null } } },
        { $project: { _id: 1, playerId: 1 } },
        {
            $lookup: {
                from: "statistics.session",
                localField: "playerId",
                foreignField: "playerId",
                as: "s",
                pipeline: [
                    {
                        $group: {
                            _id: "$playerId",
                            count: { $sum: "$count" },
                            firstSsoTime: { $min: "$firstSsoTime" },
                            lastSsoTime: { $max: "$lastSsoTime" },
                            firstRecheckInTime: { $min: "$firstRecheckInTime" },
                            lastRecheckInTime: { $max: "$lastRecheckInTime" },
                        },
                    },
                ],
            },
        },
        { $unwind: "$s" },
        {
            $set: {
                s: "$$REMOVE",
                playerId: "$$REMOVE",
                __firstSsoTime: "$s.firstSsoTime",
                __lastSsoTime: "$s.lastSsoTime",
                __firstRecheckInTime: "$s.firstRecheckInTime",
                __lastRecheckInTime: "$s.lastRecheckInTime",
                __sessionCount: "$s.count",
            },
        },
        {
            $merge: {
                into: "users",
                on: "_id",
                whenMatched: "merge",
                whenNotMatched: "discard",
            },
        },
    ]);
}

{
    console.log("NO ACTIVITY");
    const db = l1_pro_arc.cleanupUsers;

    db.users.aggregate([
        {
            $match: {
                playerId: { $ne: null },
                __firstTicketTime: null,
                __firstBetTime: null,
                __firstSignInTime: null,
                __betLimitModifiedTime: null,
                __firstSsoTime: null,
                __firstRecheckInTime: null,
            },
        },
        { $merge: { into: "removeUsers.noActivity" } },
    ]);

    db.users.deleteMany({
        _id: {
            $in: db.removeUsers.noActivity
                .find({}, { _id: 1 })
                .map((_) => _._id)
                .toArray(),
        },
    });

    db.removeUsers.noActivity.aggregate([
        { $project: { _id: { $toString: "$_id" } } },
        {
            $lookup: {
                from: "userinfos",
                localField: "_id",
                foreignField: "id",
                as: "ui",
            },
        },
        { $unwind: "$ui" },
        { $replaceWith: "$ui" },
        { $merge: { into: "removeUserInfos.noActivity" } },
    ]);

    db.userinfos.deleteMany({
        _id: {
            $in: db.removeUserInfos.noActivity
                .find({}, { _id: 1 })
                .map((_) => _._id)
                .toArray(),
        },
    });
}

{
    console.log("NO ACTIVITY AFTER 2022");
    const db = l2_pro_arc.cleanupUsers;

    db.users.aggregate([
        {
            $match: {
                playerId: { $ne: null },
                $expr: {
                    $lt: [
                        { $max: ["$__lastTicketTime", "$__lastBetTime", "$__lastSignInTime", "$__betLimitModifiedTime", "$__lastSsoTime", "$__lastRecheckInTime"] },
                        ISODate("2022-01-01"),
                    ],
                },
            },
        },
        { $merge: { into: "removeUsers.noActivity.y2022" } },
    ]);

    db.users.deleteMany({
        _id: {
            $in: db.removeUsers.noActivity.y2022
                .find({}, { _id: 1 })
                .map((_) => _._id)
                .toArray(),
        },
    });

    db.removeUsers.noActivity.y2022.aggregate([
        { $project: { _id: { $toString: "$_id" } } },
        {
            $lookup: {
                from: "userinfos",
                localField: "_id",
                foreignField: "id",
                as: "ui",
            },
        },
        { $unwind: "$ui" },
        { $replaceWith: "$ui" },
        { $merge: { into: "removeUserInfos.noActivity.y2022" } },
    ]);

    db.userinfos.deleteMany({
        _id: {
            $in: db.removeUserInfos.noActivity.y2022
                .find({}, { _id: 1 })
                .map((_) => _._id)
                .toArray(),
        },
    });
}

{
    console.log("NO ACTIVITY AFTER 2023");
    const db = l1_pro_arc.cleanupUsers;

    db.users.aggregate([
        {
            $match: {
                playerId: { $ne: null },
                $expr: {
                    $lt: [
                        { $max: ["$__lastTicketTime", "$__lastBetTime", "$__lastSignInTime", "$__betLimitModifiedTime", "$__lastSsoTime", "$__lastRecheckInTime"] },
                        ISODate("2023-01-01"),
                    ],
                },
            },
        },
        { $merge: { into: "removeUsers.noActivity.y2023" } },
    ]);

    db.users.deleteMany({
        _id: {
            $in: db.removeUsers.noActivity.y2023
                .find({}, { _id: 1 })
                .map((_) => _._id)
                .toArray(),
        },
    });

    db.removeUsers.noActivity.y2023.aggregate([
        { $project: { _id: { $toString: "$_id" } } },
        {
            $lookup: {
                from: "userinfos",
                localField: "_id",
                foreignField: "id",
                as: "ui",
            },
        },
        { $unwind: "$ui" },
        { $replaceWith: "$ui" },
        { $merge: { into: "removeUserInfos.noActivity.y2023" } },
    ]);

    db.userinfos.deleteMany({
        _id: {
            $in: db.removeUserInfos.noActivity.y2023
                .find({}, { _id: 1 })
                .map((_) => _._id)
                .toArray(),
        },
    });
}

{
    console.log("NO ACTIVITY AFTER 2024");
    const db = l2_pro_arc.cleanupUsers;

    db.users.aggregate([
        {
            $match: {
                playerId: { $ne: null },
                $expr: {
                    $lt: [
                        { $max: ["$__lastTicketTime", "$__lastBetTime", "$__lastSignInTime", "$__betLimitModifiedTime", "$__lastSsoTime", "$__lastRecheckInTime"] },
                        ISODate("2024-01-01"),
                    ],
                },
            },
        },
        { $merge: { into: "removeUsers.noActivity.y2024" } },
    ]);

    db.users.deleteMany({
        _id: {
            $in: db.removeUsers.noActivity.y2024
                .find({}, { _id: 1 })
                .map((_) => _._id)
                .toArray(),
        },
    });

    db.removeUsers.noActivity.y2024.aggregate([
        { $project: { _id: { $toString: "$_id" } } },
        {
            $lookup: {
                from: "userinfos",
                localField: "_id",
                foreignField: "id",
                as: "ui",
            },
        },
        { $unwind: "$ui" },
        { $replaceWith: "$ui" },
        { $merge: { into: "removeUserInfos.noActivity.y2024" } },
    ]);

    db.userinfos.deleteMany({
        _id: {
            $in: db.removeUserInfos.noActivity.y2024
                .find({}, { _id: 1 })
                .map((_) => _._id)
                .toArray(),
        },
    });
}
