{
    const srcDb = l2_pro.log;
    const systemRegex = /^system/;

    srcDb
        .getCollectionNames()
        .sort()
        .forEach((collName) => {
            if (systemRegex.test(collName)) {
                return;
            }

            console.log(collName);
            const srcColl = srcDb.getCollection(collName);

            console.log(collName, srcColl.createIndex({ "__archive.eventtime": 2 }, { name: "TTL_earlyArchivedRemoval", expireAfterSeconds: 60 }));
        });
}

{
    const srcDb = l2_pro.log;
    const systemRegex = /^system/;

    srcDb
        .getCollectionNames()
        .sort()
        .forEach((collName) => {
            if (systemRegex.test(collName)) {
                return;
            }

            console.log(collName);
            const srcColl = srcDb.getCollection(collName);

            console.log(collName, srcColl.countDocuments());
        });
}

{
    const srcDb = l2_pro.log;
    const systemRegex = /^system/;

    srcDb
        .getCollectionNames()
        .sort()
        .forEach((collName) => {
            if (systemRegex.test(collName)) {
                return;
            }

            console.log(collName);
            const srcColl = srcDb.getCollection(collName);

            console.log(collName, srcColl.dropIndex("TTL_earlyArchivedRemoval"));
        });
}
