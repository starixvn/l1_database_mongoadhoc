{
    const db = l1_pro_arc.minigame_arc;

    const games = [
        { type: 0, name: "kenowest", gameId: 17 },
        { type: 0, name: "kenosouth", gameId: 18 },
        { type: 0, name: "kenonorth", gameId: 19 },
        { type: 0, name: "kenomini2", gameId: 15 },
        { type: 0, name: "kenomini", gameId: 14 },
        { type: 0, name: "kenoeast", gameId: 16 },
    ];

    games.forEach((game) => {
        const betColl = db.getCollection(`${game.name}_ones_bk`);

        const data = betColl.aggregate([
            {
                $group: {
                    _id: null,
                    tickets: { $sum: 1 },
                    big: { $sum: "$big" },
                    bigCnt: { $sum: { $cond: [{ $eq: ["$big", 0] }, 0, 1] } },
                    small: { $sum: "$small" },
                    smallCnt: { $sum: { $cond: [{ $eq: ["$small", 0] }, 0, 1] } },
                    even: { $sum: "$even" },
                    evenCnt: { $sum: { $cond: [{ $eq: ["$even", 0] }, 0, 1] } },
                    odd: { $sum: "$odd" },
                    oddCnt: { $sum: { $cond: [{ $eq: ["$odd", 0] }, 0, 1] } },
                    earth: { $sum: "$earth" },
                    earthCnt: { $sum: { $cond: [{ $eq: ["$earth", 0] }, 0, 1] } },
                    fire: { $sum: "$fire" },
                    fireCnt: { $sum: { $cond: [{ $eq: ["$fire", 0] }, 0, 1] } },
                    gold: { $sum: "$gold" },
                    goldCnt: { $sum: { $cond: [{ $eq: ["$gold", 0] }, 0, 1] } },
                    water: { $sum: "$water" },
                    waterCnt: { $sum: { $cond: [{ $eq: ["$water", 0] }, 0, 1] } },
                    wood: { $sum: "$wood" },
                    woodCnt: { $sum: { $cond: [{ $eq: ["$wood", 0] }, 0, 1] } },
                },
            },
            { $project: { _id: 0 } },
        ]).toArray();

        console.log(game);
        console.log(JSON.stringify(data));
        console.table(data);
        console.log("--------------------------------");
    });
}

{
    const db = l1_pro_arc.minigame_arc;

    const games = [
        { type: 0, name: "kenopromax", gameId: 8 },
    ];

    games.forEach((game) => {
        const betColl = db.getCollection(`${game.name}_cuocs_bk`);

        const data = betColl.aggregate([
            {
                $group: {
                    _id: null,
                    tickets: { $sum: 1 },
                    big: { $sum: "$big" },
                    bigCnt: { $sum: { $cond: [{ $eq: ["$big", 0] }, 0, 1] } },
                    small: { $sum: "$small" },
                    smallCnt: { $sum: { $cond: [{ $eq: ["$small", 0] }, 0, 1] } },
                    even: { $sum: "$even" },
                    evenCnt: { $sum: { $cond: [{ $eq: ["$even", 0] }, 0, 1] } },
                    odd: { $sum: "$odd" },
                    oddCnt: { $sum: { $cond: [{ $eq: ["$odd", 0] }, 0, 1] } },
                    earth: { $sum: "$earth" },
                    earthCnt: { $sum: { $cond: [{ $eq: ["$earth", 0] }, 0, 1] } },
                    fire: { $sum: "$fire" },
                    fireCnt: { $sum: { $cond: [{ $eq: ["$fire", 0] }, 0, 1] } },
                    gold: { $sum: "$gold" },
                    goldCnt: { $sum: { $cond: [{ $eq: ["$gold", 0] }, 0, 1] } },
                    water: { $sum: "$water" },
                    waterCnt: { $sum: { $cond: [{ $eq: ["$water", 0] }, 0, 1] } },
                    wood: { $sum: "$wood" },
                    woodCnt: { $sum: { $cond: [{ $eq: ["$wood", 0] }, 0, 1] } },
                },
            },
            { $project: { _id: 0 } },
        ]).toArray();

        console.log(game);
        console.log(JSON.stringify(data));
        console.table(data);
        console.log("--------------------------------");
    });
}
