{
    const db = l1_pro.cleanupUsers;
    const dbArc = l1_pro_arc.cleanupUsers;

    dbArc
        .getCollectionNames()
        .filter((_) => /^removeUser/.test(_))
        .filter((_) => !/[.]y2024$/.test(_))
        .sort()
        .forEach((collName) => {
            const coll = db.getCollection(collName);
            const collArc = dbArc.getCollection(collName);

            let data = [];
            collArc.find({}, { _id: 1 }).forEach((doc) => {
                data.push(doc);
                if (data.length === 10_000) {
                    try {
                        coll.insertMany(data, { ordered: false });
                    } catch (err) {
                        console.log(collName, err.code, err.name);
                    } finally {
                        console.log(collName, coll.stats().count);
                        data = [];
                    }
                }
            });

            try {
                coll.insertMany(data, { ordered: false });
            } catch (err) {
                console.log(collName, err.code, err.name);
            } finally {
                console.log(collName, coll.stats().count);
                data = [];
            }
        });
}
