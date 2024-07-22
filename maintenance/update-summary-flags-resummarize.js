local.forEach((dbs) => {
    dbs.minigame
        .getCollectionNames()
        .sort()
        .forEach((_) => {
            try {
                console.log(_, JSON.stringify(dbs.minigame.getCollection(_).updateMany({ "__archive.summarized": true }, { $unset: { "__archive.summarized": 1 } })));
            } catch (e) {
                console.log(_, e.name, e.errmsg);
            }
        });
});
