[l2pp].forEach((dbs) => {
    const db = dbs.minigame;
    const coll = db.getCollection("game_configs");

    console.log(dbs, coll.updateMany({}, { $set: { exchangeReload: true } }));
});
