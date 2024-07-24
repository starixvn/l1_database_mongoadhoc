[l1].forEach((dbs) => {
    dbs.minigame
        .getCollectionNames()
        .sort()
        .forEach((collName) => {
            try {
                const coll = dbs.minigame.getCollection(collName);
                const res = coll.updateMany({ "__archive.summarized": true }, { $unset: { "__archive.summarized": 1 } });

                console.log(dbs, collName, res.modifiedCount, JSON.stringify(res));
            } catch (e) {
                console.log(dbs, collName, e.name, e.errmsg);
            }
        });
});
