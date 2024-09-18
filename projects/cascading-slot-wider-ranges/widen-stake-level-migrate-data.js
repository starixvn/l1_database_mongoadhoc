[l1_sit, l2_sit].forEach((dbs) => {
    const db = dbs.minigame;
    const log = (...args) => console.log(new Date().toISOString(), dbs.toString(), db.getName(), ...args.map((_) => util.inspect(_, false, null, true)));

    // const gameIds = [63, 64, 65, 68, 69, 70, 74, 76];
    const gameIds = [62];

    log(
        "game_configs backup",
        db.game_configs
            .aggregate([
                { $match: { gameId: { $in: gameIds } } }, //
                { $set: { "__archive.milestone": 203, _id: "$$REMOVE" } }, //
                { $merge: { into: { db: "minigame_rm", coll: "game_configs_rb" } } },
            ])
            .toArray()
    );

    log(
        "game_configs",
        db.game_configs.updateMany({ "slotsConfig.stakeLevels": { $ne: null }, "slotsConfig.betLevels": null, gameId: { $in: gameIds } }, [
            {
                $set: {
                    "slotsConfig.stakeLevels": "$$REMOVE",
                    "slotsConfig.betLevels": {
                        $map: {
                            input: "$slotsConfig.stakeLevels",
                            as: "s",
                            in: "$$s.stake",
                        },
                    },
                    "slotsConfig.jackpot.pools": {
                        $cond: [
                            "$slotsConfig.jackpot.enabled",
                            {
                                $arrayToObject: [
                                    {
                                        $map: {
                                            input: "$slotsConfig.stakeLevels",
                                            as: "s",
                                            in: [
                                                {
                                                    $switch: {
                                                        branches: [
                                                            { case: { $eq: ["$$s.stake", 1000] }, then: "minor" },
                                                            { case: { $eq: ["$$s.stake", 5000] }, then: "major" },
                                                            { case: { $eq: ["$$s.stake", 10000] }, then: "grand" },
                                                        ],
                                                        default: { $toString: "$$s.stake" },
                                                    },
                                                },
                                                {
                                                    $switch: {
                                                        branches: [
                                                            {
                                                                case: { $eq: ["$$s.stake", 1000] },
                                                                then: {
                                                                    init: "$$s.jackpot",
                                                                    contribute: 0.03,
                                                                    bot: 0.01,
                                                                    w: 80,
                                                                    playerSettings: { contrib: 0.05, alloc: 0 },
                                                                    botSettings: { contrib: 0.06, alloc: 47 },
                                                                },
                                                            },
                                                            {
                                                                case: { $eq: ["$$s.stake", 5000] },
                                                                then: {
                                                                    init: "$$s.jackpot",
                                                                    contribute: 0.015,
                                                                    bot: 0.01,
                                                                    w: 10,
                                                                    playerSettings: { contrib: 0.03, alloc: 0 },
                                                                    botSettings: { contrib: 0.04, alloc: 37.5 },
                                                                },
                                                            },
                                                            {
                                                                case: { $eq: ["$$s.stake", 10000] },
                                                                then: {
                                                                    init: "$$s.jackpot",
                                                                    contribute: 0.01,
                                                                    bot: 0.025,
                                                                    w: 5,
                                                                    playerSettings: { contrib: 0.01, alloc: 0 },
                                                                    botSettings: { contrib: 0.02, alloc: 17.7 },
                                                                },
                                                            },
                                                        ],
                                                        default: { $toString: "$$s" },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                            "$$REMOVE",
                        ],
                    },
                },
            },
        ])
    );

    log(
        "currency_group_games backup",
        db.currency_group_games
            .aggregate([
                { $match: { gameId: { $in: gameIds } } }, //
                { $set: { "__archive.milestone": 203, _id: "$$REMOVE" } }, //
                { $merge: { into: { db: "minigame_rm", coll: "currency_group_games_rb" } } },
            ])
            .toArray()
    );

    log(
        "currency_group_games",
        db.currency_group_games.updateMany({ stakeLevels: { $ne: null }, betLevels: null, gameId: { $in: gameIds } }, [
            {
                $set: {
                    stakeLevels: "$$REMOVE",
                    betLevels: {
                        $map: {
                            input: "$stakeLevels",
                            as: "s",
                            in: "$$s.stake",
                        },
                    },
                },
            },
        ])
    );

    log(
        "currency_group_games",
        db.currency_group_games.updateMany({ defaultBetLevel: null, betLevels: { $ne: null }, gameId: { $in: gameIds } }, [
            {
                $set: {
                    defaultBetLevel: { $min: "$betLevels" },
                },
            },
        ])
    );

    log(
        "jackpots backup",
        db.jackpots
            .aggregate([
                { $match: { gameId: { $in: gameIds } } }, //
                { $set: { "__archive.milestone": 203, _id: "$$REMOVE" } }, //
                { $merge: { into: { db: "minigame_rm", coll: "jackpots_rb" } } },
            ])
            .toArray()
    );

    log(
        db.jackpots.updateMany({ gameId: { $in: gameIds }, prize: null, pool: 1000 }, { $set: { prize: "minor" } }),
        db.jackpots.updateMany({ gameId: { $in: gameIds }, prize: null, pool: 5000 }, { $set: { prize: "major" } }),
        db.jackpots.updateMany({ gameId: { $in: gameIds }, prize: null, pool: 10000 }, { $set: { prize: "grand" } })
    );
});
