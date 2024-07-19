(async () => {
    const actDB = l1.minigame;
    const arcDB = l1.minigame_arc;

    const results = {
        notArchived: [],
        count: {},
        missingActiveDoc: {},
        missingArchivedDoc: {},
        diff: {},
    };

    const A_DAY = 24 * 3600 * 1000;
    const cutoffTime = new Date((Math.floor(Date.now() / A_DAY) - 7) * A_DAY);

    const tasks = actDB
        .getCollectionNames()
        .filter((name) => !/^system/.test(name) && !/_tmp/.test(name))
        .sort()
        .map(async (collName) => {
            const startTime = Date.now();

            const actColl = actDB.getCollection(collName);
            const arcColl = arcDB.getCollection(`${collName}_bk`);

            if (!arcColl.exists()) {
                results.notArchived.push(collName);
                return;
            }

            const startId = await actColl.findOne({ "__archive.v": 2, "__archive.eventtime": { $gte: cutoffTime } }, { _id: 1 }, { sort: { _id: 1 } })._id;

            const actCursor = actColl.find({ _id: { $gte: startId } }, { __archive: 0 }, { sort: { _id: 1 } });
            const arcCursor = arcColl.find({ _id: { $gte: startId } }, { __archive: 0 }, { sort: { _id: 1 } });

            let actDoc, arcDoc;

            while (true) {
                const hasAct = await actCursor.hasNext();
                const hasArc = await arcCursor.hasNext();

                if (!hasAct && !hasArc) {
                    break;
                }

                if (hasAct) {
                    actDoc = await actCursor.next();
                    results.count[collName] ??= [0, 0];
                    results.count[collName][0]++;
                }

                if (hasArc) {
                    arcDoc = await arcCursor.next();
                    results.count[collName] ??= [0, 0];
                    results.count[collName][1]++;
                }

                if (!hasArc || actDoc._id < arcDoc._id) {
                    results.missingArchivedDoc[collName] ??= [];
                    results.missingArchivedDoc[collName].push(actDoc._id);
                    continue;
                }
                if (!hasAct || actDoc._id > arcDoc._id) {
                    results.missingActiveDoc[collName] ??= [];
                    results.missingActiveDoc[collName].push(arcDoc._id);
                    continue;
                }

                const missingFieldsArc = {};
                const diffFields = {};

                for (const [key, value] of Object.entries(actDoc)) {
                    if (EJSON.stringify(value) === EJSON.stringify(arcDoc[key])) {
                        delete actDoc[key];
                        delete arcDoc[key];
                    } else if (arcDoc[key] == null) {
                        missingFieldsArc[key] = value;
                        delete actDoc[key];
                    } else {
                        diffFields[key] = [value, arcDoc[key]];
                        delete actDoc[key];
                        delete arcDoc[key];
                    }
                }

                results.diff[collName] ??= {};
                if (Object.keys(missingFieldsArc).length > 0) {
                    results.diff[collName].missingFieldsArc = missingFieldsArc;
                }
                if (Object.keys(diffFields).length > 0) {
                    results.diff[collName].diffFields = diffFields;
                }
                if (Object.keys(arcDoc).length > 0) {
                    results.diff[collName].leftover = arcDoc;
                }
            }

            console.log(ISODate().toISOString(), collName, Date.now() - startTime);
        });

    await Promise.allSettled(tasks);

    Object.entries(results).forEach(([key, data]) => {
        console.log(key);
        console.table(data);
        console.log();
    });
})();
