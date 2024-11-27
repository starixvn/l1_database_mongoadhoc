Promise.allSettled(
    [l2_uat].map(async (dbs) => {
        const UPDATE = true;
        const db = dbs.minigame;
        // const gameIds = [76];
        // const gameIds = [63, 64, 65, 68, 69, 70, 74];
        // const gameIds = [62];
        // const gameIds = [46];
        const gameIds = [38];
        // const gameIds = [29];
        const groupIdNull = ObjectId("000000000000000000000000");

        const data = [
            { partnerId: "ONEworksVGCash", name: "Cash_GrTEST", betLevels: [0.04, 0.06, 0.4, 0.8, 5, 10, 15, 20, 25, 50, 60, 70, 80, 90, 100], groupId: groupIdNull },
            { partnerId: "ONEworksVGCash", name: "Cash_INH", betLevels: [0.04, 0.06, 0.4, 0.8, 5, 10, 15, 20, 25, 50, 60, 70, 80, 90, 100], groupId: groupIdNull },
            { partnerId: "ONEworksVGCash", name: "Cash_Korea", betLevels: [5, 6, 7, 9, 50, 100, 200, 400, 800, 1000, 1500, 2000, 2500, 3500, 5000], groupId: groupIdNull },
            { partnerId: "ONEworksVGCash", name: "Cash_0.1Base", betLevels: [0.2, 0.3, 0.5, 0.6, 0.7, 0.8, 1, 5, 10, 15, 20, 50, 100, 200, 400], groupId: groupIdNull },
            { partnerId: "ONEworksVGCash", name: "Cash_Indo", betLevels: [0.02, 0.06, 0.4, 0.8, 5, 10, 15, 20, 25, 50, 60, 70, 80, 90, 100], groupId: groupIdNull },
            { partnerId: "ONEworksVGCash", name: "Cash_Asia", betLevels: [0.01, 0.02, 0.03, 0.04, 0.4, 0.6, 1, 2, 3, 4, 6, 8, 12, 16, 20], groupId: groupIdNull },
            { partnerId: "ONEworksVGCash", name: "Cash_2Base", betLevels: [0.04, 0.06, 0.4, 0.8, 5, 10, 15, 20, 25, 50, 60, 70, 80, 90, 100], groupId: groupIdNull },
            { partnerId: "ONEworksVGCash", name: "Cash_5Base", betLevels: [0.01, 0.02, 0.03, 0.04, 0.4, 0.6, 1, 2, 3, 4, 6, 8, 12, 16, 20], groupId: groupIdNull },
            { partnerId: "ONEworksVGCash", name: "Cash_10Base", betLevels: [0.01, 0.02, 0.03, 0.04, 0.4, 0.6, 1, 2, 3, 4, 6, 8, 9, 10, 12], groupId: groupIdNull },
            { partnerId: "ONEworksVGCash", name: "Cash_EURO", betLevels: [0.01, 0.02, 0.03, 0.04, 0.4, 0.6, 1, 2, 3, 4, 6, 8, 9, 10, 12], groupId: groupIdNull },
            { partnerId: "ONEworksVGCash", name: "Cash_15Base", betLevels: [0.01, 0.02, 0.03, 0.04, 0.4, 0.6, 1, 2, 3, 4, 6, 8, 9, 10, 12], groupId: groupIdNull },
            { partnerId: "ONEworksVGCash", name: "Cash_Thai", betLevels: [0.03, 0.06, 0.4, 0.8, 5, 10, 15, 20, 25, 50, 60, 70, 80, 90, 100], groupId: groupIdNull },
            { partnerId: "ONEworksVGCash", name: "Cash_EGP", betLevels: [0.04, 0.06, 0.4, 0.8, 5, 10, 15, 20, 25, 50, 60, 70, 80, 90, 100], groupId: groupIdNull },
            { partnerId: "ONEworks_VG", name: "Credit_Indo", betLevels: [0.02, 0.06, 0.4, 0.8, 5, 10, 15, 20, 25, 50, 60, 70, 80, 90, 100], groupId: groupIdNull },
            { partnerId: "ONEworks_VG", name: "Credit_Thai", betLevels: [0.03, 0.06, 0.4, 0.8, 5, 10, 15, 20, 25, 50, 60, 70, 80, 90, 100], groupId: groupIdNull },
            { partnerId: "ONEworks_VG", name: "Credit_Korea", betLevels: [5, 6, 7, 9, 50, 100, 200, 400, 800, 1000, 1500, 2000, 2500, 3500, 5000], groupId: groupIdNull },
            { partnerId: "ONEworks_VG", name: "Credit_Asia", betLevels: [0.01, 0.02, 0.03, 0.04, 0.4, 0.6, 1, 2, 3, 4, 6, 8, 12, 16, 20], groupId: groupIdNull },
            { partnerId: "ONEworks_VG", name: "Credit_EURO", betLevels: [0.01, 0.02, 0.03, 0.04, 0.4, 0.6, 1, 2, 3, 4, 6, 8, 9, 10, 12], groupId: groupIdNull },
            { partnerId: "ONEworks_VG", name: "Credit_PHP", betLevels: [0.04, 0.1, 0.2, 0.3, 5, 10, 15, 20, 25, 30, 35, 40, 50, 100, 200], groupId: groupIdNull },
            { partnerId: "ONEworks_VG", name: "Credit_GrTEST", betLevels: [0.03, 0.06, 0.4, 0.8, 5, 10, 15, 20, 25, 50, 60, 70, 80, 90, 100], groupId: groupIdNull },
            { partnerId: "SabaPlay", name: "Cash_VN", betLevels: [0.04, 0.06, 0.4, 0.8, 5, 10, 15, 20, 25, 50, 60, 70, 80, 90, 100], groupId: groupIdNull },
            { partnerId: "SabaPlay", name: "Cash_PHP", betLevels: [0.04, 0.1, 0.2, 0.3, 5, 10, 15, 20, 25, 30, 35, 40, 50, 100, 200], groupId: groupIdNull },
            { partnerId: "SabaPlay", name: "Cash_CN", betLevels: [0.01, 0.02, 0.03, 0.04, 0.4, 0.6, 1, 2, 3, 4, 6, 8, 12, 16, 20], groupId: groupIdNull },
            { partnerId: "SabaPlay", name: "Credit_Indo", betLevels: [0.02, 0.06, 0.4, 0.8, 5, 10, 15, 20, 25, 50, 60, 70, 80, 90, 100], groupId: groupIdNull },
            { partnerId: "SabaPlay", name: "Cash_Thai", betLevels: [0.03, 0.06, 0.4, 0.8, 5, 10, 15, 20, 25, 50, 60, 70, 80, 90, 100], groupId: groupIdNull },
            { partnerId: "SabaPlay", name: "Cash_Bangladesh", betLevels: [0.2, 0.3, 0.5, 0.6, 0.7, 0.8, 1, 5, 10, 15, 20, 50, 100, 200, 400], groupId: groupIdNull },
            { partnerId: "SabaPlay", name: "Cash_Indian", betLevels: [0.2, 0.3, 0.5, 0.6, 0.7, 0.8, 1, 5, 10, 15, 20, 50, 100, 200, 400], groupId: groupIdNull },
            { partnerId: "SabaPlay", name: "Cash_BRL", betLevels: [0.04, 0.06, 0.4, 0.8, 5, 10, 15, 20, 25, 50, 60, 70, 80, 90, 100], groupId: groupIdNull },
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
            }),
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
