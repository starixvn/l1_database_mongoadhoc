{
    const logger = (...args) => console.log(new ISODate(), ...args);

    const src = l2_sit.log_arc;
    const dst = l2_sit_arc.log_arc;

    const collNames = src.getCollectionNames().sort();
    const storageEngine = { wiredTiger: { configString: "block_compressor=zstd" } };
    const system = /^system/;

    for (const collName of collNames) {
        if (system.test(collName)) {
            continue;
        }

        if (dst.getCollection(collName).exists == null) {
            logger(collName, dst.createCollection(collName, { storageEngine }));
        }

        logger(collName, src.getCollection(collName).countDocuments(), "==>", dst.getCollection(collName).countDocuments());

        const srcColl = src.getCollection(collName);
        const dstColl = dst.getCollection(collName);
        let data = [];
        let total = 0;

        srcColl.find().forEach((doc) => {
            data.push(doc);

            if (data.length === 1000) {
                try {
                    const { acknowledged, insertedIds } = dstColl.insertMany(data);
                    const inserted = Object.keys(insertedIds).length;
                    total += inserted;
                    logger(collName, "INS", { acknowledged, inserted }, total);
                } catch (e) {
                    delete e.stack;
                    logger(collName, "INS-ERR", e);
                } finally {
                    data = [];
                }
            }
        });

        try {
            const { acknowledged, insertedIds } = dstColl.insertMany(data);
            const inserted = Object.keys(insertedIds).length;
            total += inserted;
            logger(collName, "INS", { acknowledged, inserted }, total);
        } catch (e) {
            delete e.stack;
            logger(collName, "INS-ERR", e);
        } finally {
            data = [];
        }

        const minId = srcColl.findOne({}, { _id: 1 }, { sort: { _id: 1 } });

        if (!minId) {
            continue;
        }

        data = [];
        total = 0;
        dstColl.find({ _id: { $gte: minId._id } }, { _id: 1 }).forEach(({ _id }) => {
            data.push(_id);

            if (data.length === 1000) {
                try {
                    const result = srcColl.deleteMany({ _id: { $in: data } });
                    total += result.deletedCount;
                    logger(collName, "DEL", result, total);
                } catch (e) {
                    delete e.stack;
                    logger(collName, "DEL-ERR", e);
                } finally {
                    data = [];
                }
            }
        });

        try {
            const result = srcColl.deleteMany({ _id: { $in: data } });
            total += result.deletedCount;
            logger(collName, "DEL", result, total);
        } catch (e) {
            delete e.stack;
            logger(collName, "DEL-ERR", e);
        } finally {
            data = [];
        }
    }
}

{
    const db = l2_sit.log_arc;

    const showStat = ({ ns, size, count, totalSize }) => console.log(ns, { size, count, totalSize });

    db.getCollectionNames()
        .sort()
        .forEach((collName) => {
            const coll = db.getCollection(collName);
            showStat(coll.stats(1024));
            console.log(collName, db.runCommand({ compact: collName, force: true }));
            showStat(coll.stats(1024));
        });

    db.stats(1024);
}
