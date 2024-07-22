[l1_pro, l2_pro].forEach((dbs) => {
    const db = dbs.minigame;

    const gameIds = db.game_configs
        .find({ type: 3 }, { _id: 0, gameId: 1 })
        .map((_) => _.gameId)
        .toArray();

    console.table(db.currency_group_games.find({ gameId: { $in: gameIds } }).toArray());

    const res = db.currency_group_games.updateMany({ gameId: { $in: gameIds } }, [{ $set: { defaultCoinValue: { $min: "$coinValues" } } }]);

    console.table(res);

    console.table(db.currency_group_games.find({ gameId: { $in: gameIds } }).toArray());
});
