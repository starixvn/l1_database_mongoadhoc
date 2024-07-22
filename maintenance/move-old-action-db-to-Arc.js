{
    ["AdjustStakeLevel_1684724175108", "AdjustStakeLevel_1684724551132"].forEach((dbName) => {
        const dbs = l2_pro;
        const dbsArc = l2_pro_arc;

        const db = dbs.getDB(dbName);
        const dbArc = dbsArc.getDB(dbName);

        db.getCollectionNames().forEach((collName) => {
            let data = [];

            const coll = db.getCollection(collName);
            const collArc = dbArc.getCollection(collName);

            coll.find().forEach((doc) => {
                data.push(doc);

                if (data.length === 10_000) {
                    try {
                        collArc.insertMany(data, { ordered: false });
                    } catch (err) {
                        console.log(dbName, collName, "-----------------", err.code, err.name);
                    } finally {
                        console.log(dbName, collName, coll.stats().count, collArc.stats().count);
                        data = [];
                    }
                }
            });

            try {
                collArc.insertMany(data, { ordered: false });
            } catch (err) {
                console.log(dbName, collName, "-----------------", err.code, err.name);
            } finally {
                console.log(dbName, collName, coll.stats().count, collArc.stats().count);
                data = [];
            }

            const cnt = coll.countDocuments();
            const cntArc = collArc.countDocuments();
            console.log(dbName, collName, "Pre-DEL", cnt, cntArc);

            if (cnt === cntArc) {
                console.log(dbName, collName, coll.drop());
            }
        });
    });
}
