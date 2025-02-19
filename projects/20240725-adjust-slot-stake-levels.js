// ["game_configs", "currency_groups", "currency_group_games"].forEach(_ => { l2.minigame.getCollection(_).aggregate([{ $merge: { into: { db: "test", coll: _ } } }]) })

{
    const db = l2_pro.minigame;

    const currencyGroupIds = db.currency_groups
        .find({ name: "Credit_PHP" }, { _id: 1 })
        .map((_) => _._id)
        .toArray();

    const gameIds = db.game_configs
        .find(
            {
                name: {
                    $in: [
                        "dragonball",
                        "onepiece",
                        "transformers",
                        "blackpink",
                        "missionimpossible",
                        "djclub",
                        "happyfish",
                        "magicforest",
                        "fortunecat",
                        "heroesslot",
                        "nightclub",
                        "waytogoal",
                    ],
                },
            },
            { _id: 0, gameId: 1, name: 1 }
        )
        .map(({ gameId, name }) => {
            console.log(JSON.stringify({ gameId, name }));
            return gameId;
        })
        .toArray();

    console.log("\nBEFORE");
    db.currency_group_games
        .find({ gameId: { $in: gameIds }, groupId: { $in: currencyGroupIds } })
        .map(EJSON.stringify)
        .forEach(console.log);

    try {
        console.log("\nUPDATE");
        // throw new Error("DRY RUN");
        const res = db.currency_group_games.bulkWrite([
            {
                updateMany: {
                    filter: { gameId: { $in: gameIds }, groupId: { $in: currencyGroupIds } },
                    update: {
                        $set: {
                            "stakeLevels.$[low].stake": 0.2,
                            "stakeLevels.$[mid].stake": 1,
                            "stakeLevels.$[high].stake": 5,
                        },
                    },
                    arrayFilters: [{ "low.stake": 1 }, { "mid.stake": 5 }, { "high.stake": 10 }],
                },
            },
        ]);

        console.log(EJSON.stringify(res));
    } catch (e) {
        console.log(e);
    }

    console.log("\nAFTER");
    db.currency_group_games
        .find({ gameId: { $in: gameIds }, groupId: { $in: currencyGroupIds } })
        .map(EJSON.stringify)
        .forEach(console.log);
}
