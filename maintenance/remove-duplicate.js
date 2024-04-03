{
    const logger = (...args) => console.log(new Date().toISOString(), ...args);

    const source = l1pp.minigame_arc;
    const target = l1ppp.minigame_arc;

    const collNames = source.getCollectionNames().filter((_) => !/^system/.test(_)).sort();

    for (const collName of collNames) {
        const srcColl = source.getCollection(collName);
        const tgtColl = target.getCollection(collName);

        if (!tgtColl.exists()) {
            continue;
        }

        const { count: srcCountBefore } = srcColl.stats();
        const { count: tgtCountBefore } = tgtColl.stats();

        logger(collName, srcCountBefore, tgtCountBefore);

        let i = 0;
        let cnt = 0;
        let ids = [];

        srcColl.find({}, { _id: 1 }).forEach((data) => {
            const { _id } = data;

            ids.push(_id);
            if (ids.length === 1000) {
                const { deletedCount } = tgtColl.deleteMany({ _id: { $in: ids } });
                cnt += deletedCount;
                ids = [];
            }
            i += 1;

            if (i % 10_000 === 0) {
                logger(collName, i, cnt);
            }
        });

        const { count: srcCountAfter } = srcColl.stats();
        const { count: tgtCountAfter } = tgtColl.stats();

        logger(collName, srcCountAfter, tgtCountAfter);
    }
}
