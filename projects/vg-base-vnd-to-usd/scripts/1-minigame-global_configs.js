// VND => USD

[l2_uat].forEach((dbs) => {
    const db = dbs.minigame;
    const coll = db.getCollection("global_configs");

    console.log(dbs, coll.findOne({ type: "exchange_codes" }));
    console.log(dbs, coll.updateOne({ type: "exchange_codes", base: "VND" }, { $set: { base: "USD" } }));
    console.log(dbs, coll.findOne({ type: "exchange_codes" }));
});
