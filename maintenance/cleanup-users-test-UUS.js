{
    const playerIds = ["14563049", "14563803", "42585946", "43165423", "43472998"];

    const users_ids = l1_pro.minigame.users
        .find({ playerId: { $in: playerIds } }, { _id: 1 })
        .map((_) => _._id)
        .toArray();

    const userinfos_ids = l1_pro.minigame.userinfos
        .find({ id: { $in: users_ids.map((_) => _.toString()) } }, { _id: 1 })
        .map((_) => _._id)
        .toArray();

    console.log(playerIds.length, users_ids.length, userinfos_ids.length);

    if (playerIds.length === users_ids.length && playerIds.length === userinfos_ids.length) {
        l1_pro.minigame.users.aggregate([
            { $match: { _id: { $in: users_ids } } },
            {
                $merge: {
                    into: { db: "minigame_rm", coll: "users_rm" },
                },
            },
        ]);

        l1_pro.minigame.userinfos.aggregate([
            { $match: { _id: { $in: userinfos_ids } } },
            {
                $merge: {
                    into: { db: "minigame_rm", coll: "userinfos_rm" },
                },
            },
        ]);

        if (l1_pro.minigame_rm.userinfos_rm.countDocuments({ _id: { $in: userinfos_ids } }) === userinfos_ids.length) {
            console.log("rm userinfos", userinfos_ids.length, l1_pro.minigame.userinfos.deleteMany({ _id: { $in: userinfos_ids } }));
        }
        if (l1_pro.minigame_rm.users_rm.countDocuments({ _id: { $in: users_ids } }) === users_ids.length) {
            console.log("rm users", users_ids.length, l1_pro.minigame.users.deleteMany({ _id: { $in: users_ids } }));
        }
    }
}

{
    const filter = [
        {playerId: "45683692", operatorId: "ONEworks_VG"},
        {playerId: "51025545", operatorId: "ONEworksVGCash"},
        {playerId: "51025558", operatorId: "ONEworksVGCash"},
        {playerId: "33733762", operatorId: "ONEworks1"},
        {playerId: "43348296", operatorId: "ONEworks_VG"},
        {playerId: "48438613", operatorId: "ONEworks_VG"},
    ];

    const users_ids = l2_pro.minigame.users
        .find({ $or: filter }, { _id: 1 })
        .map((_) => _._id)
        .toArray();

    const userinfos_ids = l2_pro.minigame.userinfos
        .find({ id: { $in: users_ids.map((_) => _.toString()) } }, { _id: 1 })
        .map((_) => _._id)
        .toArray();

    console.log(filter.length, users_ids.length, userinfos_ids.length);

    if (filter.length === users_ids.length && filter.length === userinfos_ids.length) {
        l2_pro.minigame.users.aggregate([
            { $match: { _id: { $in: users_ids } } },
            {
                $merge: {
                    into: { db: "minigame_rm", coll: "users_rm" },
                },
            },
        ]);

        l2_pro.minigame.userinfos.aggregate([
            { $match: { _id: { $in: userinfos_ids } } },
            {
                $merge: {
                    into: { db: "minigame_rm", coll: "userinfos_rm" },
                },
            },
        ]);

        if (l2_pro.minigame_rm.userinfos_rm.countDocuments({ _id: { $in: userinfos_ids } }) === userinfos_ids.length) {
            console.log("rm userinfos", userinfos_ids.length, l2_pro.minigame.userinfos.deleteMany({ _id: { $in: userinfos_ids } }));
        }
        if (l2_pro.minigame_rm.users_rm.countDocuments({ _id: { $in: users_ids } }) === users_ids.length) {
            console.log("rm users", users_ids.length, l2_pro.minigame.users.deleteMany({ _id: { $in: users_ids } }));
        }
    }
}

{
    const playerIds = ["66966249", "66966256"];

    const users_ids = l1_pro.minigame.users
        .find({ playerId: { $in: playerIds }, operatorId: "ONEworks1" }, { _id: 1 })
        .map((_) => _._id)
        .toArray();

    const userinfos_ids = l1_pro.minigame.userinfos
        .find({ id: { $in: users_ids.map((_) => _.toString()) } }, { _id: 1 })
        .map((_) => _._id)
        .toArray();

    console.log(playerIds.length, users_ids.length, userinfos_ids.length);

    if (playerIds.length === users_ids.length && playerIds.length === userinfos_ids.length) {
        l1_pro.minigame.users.aggregate([
            { $match: { _id: { $in: users_ids } } },
            {
                $merge: {
                    into: { db: "minigame_rm", coll: "users_rm" },
                },
            },
        ]);

        l1_pro.minigame.userinfos.aggregate([
            { $match: { _id: { $in: userinfos_ids } } },
            {
                $merge: {
                    into: { db: "minigame_rm", coll: "userinfos_rm" },
                },
            },
        ]);

        if (l1_pro.minigame_rm.userinfos_rm.countDocuments({ _id: { $in: userinfos_ids } }) === userinfos_ids.length) {
            console.log("rm userinfos", userinfos_ids.length, l1_pro.minigame.userinfos.deleteMany({ _id: { $in: userinfos_ids } }));
        }
        if (l1_pro.minigame_rm.users_rm.countDocuments({ _id: { $in: users_ids } }) === users_ids.length) {
            console.log("rm users", users_ids.length, l1_pro.minigame.users.deleteMany({ _id: { $in: users_ids } }));
        }
    }
}
