{
    const __rm = "20240806";
    const filter = { partnerId: "SabaPlay" };

    const dbs = l2_sit;
    const srcDbs = l2_pro;

    const db = dbs.minigame;
    const rmDb = dbs.minigame_rm;
    const srcDb = srcDbs.minigame;

    console.log(ISODate().toISOString(), "BACKUP DATA TO RM");

    db.currency_groups.aggregate([
        { $match: filter }, //
        { $set: { __rm } },
        { $merge: { into: { db: "minigame_rm", coll: "currency_groups_rm" } } },
    ]);

    const groupIds = rmDb.currency_groups_rm
        .find({ __rm }, { _id: 1 })
        .map(({ _id }) => _id)
        .toArray();

    db.currencies.aggregate([
        { $match: { groupId: { $in: groupIds } } }, //
        { $set: { __rm } },
        { $merge: { into: { db: "minigame_rm", coll: "currencies_rm" } } },
    ]);

    db.currencies.aggregate([
        { $match: filter }, //
        { $set: { __rm: `${__rm}-invalid` } },
        { $merge: { into: { db: "minigame_rm", coll: "currencies_rm" } } },
    ]);

    const currencyIds = rmDb.currencies_rm
        .find({ __rm }, { _id: 1 })
        .map(({ _id }) => _id)
        .toArray();

    db.currency_group_games.aggregate([
        { $match: { groupId: { $in: groupIds } } }, //
        { $set: { __rm } },
        { $merge: { into: { db: "minigame_rm", coll: "currency_group_games_rm" } } },
    ]);

    const groupGameIds = rmDb.currency_group_games_rm
        .find({ __rm }, { _id: 1 })
        .map(({ _id }) => _id)
        .toArray();

    console.log(ISODate().toISOString(), "REMOVE DATA");

    console.log(
        ISODate().toISOString(),
        "currency_groups",
        JSON.stringify(
            db.currency_groups.deleteMany({ _id: { $in: groupIds } }) //
        )
    );

    console.log(
        ISODate().toISOString(),
        "currencies",
        JSON.stringify(
            db.currencies.deleteMany({ _id: { $in: currencyIds } }) //
        )
    );

    console.log(
        ISODate().toISOString(),
        "currency_group_games",
        JSON.stringify(
            db.currency_group_games.deleteMany({ _id: { $in: groupGameIds } }) //
        )
    );

    console.log(ISODate().toISOString(), "SYNC DATA");

    const syncGroupIds = srcDb.currency_groups
        .find(filter, { _id: 1 })
        .map(({ _id }) => _id)
        .toArray();

    console.log(
        ISODate().toISOString(),
        "currency_groups",
        JSON.stringify(
            db.currency_groups.insertMany(
                srcDb.currency_groups.find({ _id: { $in: syncGroupIds } }).toArray() //
            )
        )
    );

    console.log(
        ISODate().toISOString(),
        "currencies",
        JSON.stringify(
            db.currencies.insertMany(
                srcDb.currencies.find({ groupId: { $in: syncGroupIds } }).toArray() //
            )
        )
    );

    console.log(
        ISODate().toISOString(),
        "currency_group_games",
        JSON.stringify(
            db.currency_group_games.insertMany(
                srcDb.currency_group_games.find({ groupId: { $in: syncGroupIds } }).toArray() //
            )
        )
    );
}
