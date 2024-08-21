{
    const db = l2_uat.minigame;
    const log = (...args) => console.log(new Date().toISOString(), db, ...args);

    {
        log("NON-JACKPOT GAMES");
        // const gameIds = [63];
        const gameIds = [63, 64, 65, 68, 69];

        log(
            db.game_configs.updateMany({ gameId: { $in: gameIds } }, [
                {
                    $set: {
                        "slotsConfig.stakeLevels": "$$REMOVE",
                        // "slotsConfig.betLevels": [1000, 1500, 1650, 1750, 2000, 2500, 3000, 5000, 5500, 10000],
                        "slotsConfig.betLevels": [0.1, 0.2, 0.5, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4, 5],
                    },
                },
            ])
        );

        log(
            db.currency_group_games.aggregate([
                { $match: { gameId: 74 } },
                {
                    $project: {
                        _id: 0,
                        groupId: 1,
                        gameId: { $literal: gameIds },
                        betLevels: 1,
                        defaultBetLevel: 1,
                    },
                },
                { $unwind: "$gameId" },
                {
                    $merge: {
                        into: "currency_group_games",
                        on: ["groupId", "gameId"],
                        whenNotMatched: "discard",
                    },
                },
            ])
        );

        log(
            db.currency_group_games.updateMany({ gameId: { $in: gameIds } }, [
                {
                    $set: {
                        stakeLevels: "$$REMOVE",
                    },
                },
            ])
        );
    }

    {
        log("JACKPOT GAMES");
        const gameIds = [70, 76, 74];

        log(
            db.game_configs.updateMany({ gameId: { $in: gameIds } }, [
                {
                    $set: {
                        "slotsConfig.stakeLevels": "$$REMOVE",
                        "slotsConfig.betLevels": [1000, 1500, 1650, 1750, 2000, 2500, 3000, 5000, 5500, 10000],
                        "slotsConfig.jackpot.pools": {
                            minor: {
                                init: 5000000,
                                contribute: 0.03,
                                bot: 0.01,
                                w: 80,
                                playerSettings: { contrib: 0.05, alloc: 0 },
                                botSettings: { contrib: 0.06, alloc: 47 },
                            },
                            major: {
                                init: 25000000,
                                contribute: 0.015,
                                bot: 0.01,
                                w: 10,
                                playerSettings: { contrib: 0.03, alloc: 0 },
                                botSettings: { contrib: 0.04, alloc: 37.5 },
                            },
                            grand: {
                                init: 50000000,
                                contribute: 0.01,
                                bot: 0.025,
                                w: 5,
                                playerSettings: { contrib: 0.01, alloc: 0 },
                                botSettings: { contrib: 0.02, alloc: 17.7 },
                            },
                        },
                    },
                },
            ])
        );

        log(
            db.currency_group_games.aggregate([
                { $match: { gameId: 76 } },
                {
                    $project: {
                        _id: 0,
                        groupId: 1,
                        gameId: { $literal: gameIds },
                        betLevels: 1,
                        defaultBetLevel: 1,
                    },
                },
                { $unwind: "$gameId" },
                {
                    $merge: {
                        into: "currency_group_games",
                        on: ["groupId", "gameId"],
                        whenNotMatched: "discard",
                    },
                },
            ])
        );

        log(
            db.currency_group_games.updateMany({ gameId: { $in: gameIds } }, [
                {
                    $set: {
                        stakeLevels: "$$REMOVE",
                    },
                },
            ])
        );

        log(
            db.jackpots.updateMany({ gameId: { $in: gameIds }, pool: 1000 }, { $set: { prize: "minor" } }),
            db.jackpots.updateMany({ gameId: { $in: gameIds }, pool: 5000 }, { $set: { prize: "major" } }),
            db.jackpots.updateMany({ gameId: { $in: gameIds }, pool: 10000 }, { $set: { prize: "grand" } })
        );
    }
}
