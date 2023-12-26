{
    const dbs = l2pp;

    ["playerId", "memberId", "winnerId", "local.memberId"].forEach((field) => {
        [dbs.minigame, dbs.member].forEach((database) => {
            database
                .getCollectionNames()
                .filter((collName) => !/^system/.test(collName))
                .sort()
                .forEach((collName) => {
                    const coll = database.getCollection(collName);

                    const metadata = coll.exists();
                    if (metadata.type === "view") {
                        return;
                    }

                    const countExists = coll.countDocuments({ [field]: { $exists: true } });
                    if (countExists === 0) {
                        return;
                    }

                    const filter = { $expr: { $eq: [{ $isNumber: `$${field}` }, true] } };

                    const countUpdates = coll.countDocuments(filter);
                    console.log(ISODate().toISOString(), "BEFORE", field, coll, countExists, countUpdates);

                    if (countUpdates === 0) {
                        return;
                    }

                    const updateRes = coll.updateMany(filter, [{ $set: { [field]: { $toString: `$${field}` } } }], { oredered: false });

                    console.log(ISODate().toISOString(), " AFTER", field, coll, updateRes);
                });
        });
    });

    ["call.playerId", "result.playerId"].forEach((field) => {
        [dbs.log].forEach((database) => {
            database
                .getCollectionNames()
                .filter((collName) => !/^system/.test(collName))
                .sort()
                .forEach((collName) => {
                    const coll = database.getCollection(collName);

                    const metadata = coll.exists();
                    if (metadata.type === "view") {
                        return;
                    }

                    const countExists = coll.countDocuments({ [field]: { $exists: true } });
                    if (countExists === 0) {
                        return;
                    }

                    const filter = { $expr: { $eq: [{ $isNumber: `$${field}` }, true] } };

                    const countUpdates = coll.countDocuments(filter);
                    console.log(ISODate().toISOString(), "BEFORE", field, coll, countExists, countUpdates);

                    if (countUpdates === 0) {
                        return;
                    }

                    const updateRes = coll.updateMany(filter, [{ $set: { [field]: { $toString: `$${field}` } } }], { oredered: false });

                    console.log(ISODate().toISOString(), " AFTER", field, coll, updateRes);
                });
        });
    });
}
