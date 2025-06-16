{
    const db = l2_uat.minigame;

    const games = [
        { gameId: 29, name: "fourguardians" },
        { gameId: 70, name: "transformers" },
        { gameId: 74, name: "onepiece" },
        { gameId: 76, name: "dragonball" },
        { gameId: 122, name: "summerheat" },
        { gameId: 124, name: "nezhasrebellion" },
        { gameId: 133, name: "templeofcaishen" },
    ];

    games.forEach(({ gameId, name }) => {
        const result = db.getCollection(`${name}_fames`).updateMany({}, [
            {
                $set: {
                    operatorId: { $ifNull: ["$operatorId", "ONEworksVGCash"] },
                    siteName: { $ifNull: ["$siteName", null] },
                },
            }, // -
        ]);
        console.log(gameId, name, result);
    });
}
