{
    const db = l1_uat.minigame;
    const log = (...args) => console.log(new Date().toISOString(), db, ...args.map((_) => util.inspect(_, false, null, true)));

    const gameIds = [63, 64, 65, 68, 69, 70, 74, 76];

    db.game_configs.aggregate([
        { $match: { gameId: { $in: gameIds } } }, //
        { $set: { _id: "$$REMOVE" } },
        { $merge: { into: { db: "minigame_rm", coll: "game_configs_rm" } } },
    ]);

    log(
        "game_configs",
        db.game_configs.updateMany({ "slotsConfig.stakeLevels": { $ne: null }, gameId: { $in: gameIds } }, [
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

    db.currency_group_games.aggregate([
        { $match: { gameId: { $in: gameIds } } }, //
        { $set: { _id: "$$REMOVE" } },
        { $merge: { into: { db: "minigame_rm", coll: "currency_group_games_rm" } } },
    ]);

    log(
        "currency_group_games",
        db.currency_group_games.updateMany({ stakeLevels: { $ne: null }, gameId: { $in: gameIds } }, [
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
}
