{
    const db = l2_pro.minigame;
    const dbArc = l2_pro_arc.minigame_arc;
    const collName = "userinfos";
    const cutOffTime = ISODate("2024-05-01");

    let data = [];
    db.getCollection(collName)
        .find({
            $expr: {
                $lt: [{ $toDate: "$_id" }, cutOffTime],
            },
        })
        .forEach((_) => {
            data.push(_);
            if (data.length === 10_000) {
                try {
                    dbArc.getCollection(`${collName}_bk`).insertMany(data, { ordered: false });
                } catch (err) {
                    console.log(err);
                } finally {
                    console.log(dbArc.getCollection(`${collName}_bk`).stats().count);
                    data = [];
                }
            }
        });
    try {
        dbArc.getCollection(`${collName}_bk`).insertMany(data, { ordered: false });
    } catch (err) {
        console.log(err);
    } finally {
        console.log(dbArc.getCollection(`${collName}_bk`).stats().count);
        data = [];
    }
}
