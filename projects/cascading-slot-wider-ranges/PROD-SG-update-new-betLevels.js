Promise.allSettled(
    local.map(async (dbs) => {
        const UPDATE = true;
        const db = dbs.minigame;
        // const gameIds = [63, 64, 65, 68, 69, 70, 74, 76];
        // const gameIds = [62];
        // const gameIds = [46];
        // const gameIds = [38];
        const gameIds = [29];
        const groupIdNull = ObjectId("000000000000000000000000");

        const data = [
            { partnerId: "ONEworks1", name: "GrUSD", betLevels: [0.01, 0.02, 0.03, 0.04, 0.4, 0.6, 1, 2, 3, 4, 6, 8, 9, 10, 12], groupId: groupIdNull },
            { partnerId: "ONEworks1", name: "GrTEST", betLevels: [0.01, 0.02, 0.03, 0.04, 0.4, 0.6, 1, 2, 3, 4, 6, 8, 9, 10, 12], groupId: groupIdNull },
        ];

        console.log(data.length);

        await Promise.allSettled(
            data.map(async (doc) => {
                const { partnerId, name } = doc;
                const _id = await db.getCollection("currency_groups").findOne({ partnerId, name }, { _id: 1 });
                if (_id) {
                    console.log("MATCH", partnerId, name);
                    doc.groupId = _id._id;
                }
            }),``
        );

        console.table(data);

        console.table((await db.getCollection("currency_group_games").find({ gameId: { $in: gameIds } })).toArray());

        if (UPDATE) {
            await Promise.allSettled(
                data.map(async (doc) => {
                    const { partnerId, name, groupId, betLevels } = doc;
                    const res = await db
                        .getCollection("currency_group_games")
                        .updateMany({ groupId, gameId: { $in: gameIds } }, [{ $set: { betLevels, defaultBetLevel: { $min: betLevels } } }]);
                    console.log(gameIds, groupId, partnerId, name, JSON.stringify(res));
                }),
            );
            console.table((await db.getCollection("currency_group_games").find({ gameId: { $in: gameIds } })).toArray());
        }
    }),
);
