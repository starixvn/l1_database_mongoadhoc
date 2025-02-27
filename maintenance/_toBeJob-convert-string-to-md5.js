// l1p.minigame_arc.getCollection("baucua_results_bk").createIndex({ "encryptedResult.iv": 1 }, { partialFilterExpression: { "encryptedResult.iv": { $type: 2 } } });
// l1p.minigame_arc.getCollection("baucua_results_bk").createIndex({ "encryptedResult.iv": -1 }, { partialFilterExpression: { "encryptedResult.iv": { $not: { $type: 5 } } } });

/**
 *  CONFIG:
 *      - collection name
 *      - field list
 *          + is string { $type: 2 }
 *          + to be indexed
 *          + will be converted to binary data MD5 { $type: 5 }
 */

(async () => {
    const configs = [
        {
            namespace: { db: "minigame_arc", coll: "taixiu_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "xocxoc_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "baucua_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "txturbo_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "minisedie_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "baccarat_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "kenomax_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "kenomax2_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "kenomini_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "kenomini2_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "kenoeast_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "kenowest_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "kenosouth_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "kenonorth_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "vipsedie_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "sicbo_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "vipbaccarat_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "unbalancedbigsmall1_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "unbalancedbigsmall2_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "megakeno_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "megakeno2_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "unbalancedbigsmall3_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "unbalancedbigsmall4_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "minisedie2_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "minisedie3_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "minisedie4_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "fantan_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "winthreecards_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "dragontigerfight_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "spaceflight_results_bk" },
            fields: ["finalHash", "serverSeedHash"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bandarqiuqiu_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "footballdice_results_bk" },
            fields: ["finalHash", "serverSeedHash"],
        },
        {
            namespace: { db: "minigame_arc", coll: "cointoss_results_bk" },
            fields: ["finalHash", "serverSeedHash"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac81_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac82_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac83_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac84_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac85_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac86_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac87_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac88_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac89_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac90_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac91_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac92_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "footballcointoss_results_bk" },
            fields: ["finalHash", "serverSeedHash"],
        },
        {
            namespace: { db: "minigame_arc", coll: "sedie3_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "karakrus_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac97_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac98_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac100_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "bac101_results_bk" },
            fields: ["shoe.encryptedShoe.iv", "shoe.encryptedShoe.content", "shoe.encryptedShoeHash.iv", "shoe.encryptedShoeHash.content"],
        },
        {
            namespace: { db: "minigame_arc", coll: "sevenupdown_results_bk" },
            fields: ["encryptedResultHash.iv", "encryptedResultHash.content", "encryptedResult.iv", "encryptedResult.content"],
        },
    ];

    /**
     * @param { unknown } obj
     * @param { string } ref
     */
    const getValue = (obj, ref) => {
        if (typeof obj !== "object") {
            return null;
        }
        if (obj == null) {
            return null;
        }
        // @ts-ignore
        return obj[`${ref}`] ?? null;
    };

    /**
     * @param { unknown } obj
     * @param { string } ref
     */
    const dotNotation = (obj, ref) => ref.split(".").reduce(getValue, obj);

    /** @param { string } field */
    const fieldToFilter = (field) => ({ [field]: { $type: "string" } });

    // for (const dbs of local) {
    for (const dbs of [l1p]) {
        /** @param { unknown[] } args */
        const log = (...args) => console.log(new Date(), dbs.toString(), ...args);

        for (const { namespace, fields } of configs) {
            const { db, coll } = namespace;
            const collection = dbs[db].getCollection(coll);

            const filter = { $or: fields.map(fieldToFilter) };
            log(db, coll, JSON.stringify(filter));

            const res = await collection.createIndex(
                Object.fromEntries(fields.map((_) => [_, 1])), //
                {
                    name: `#FIX_${coll}_MD5`,
                    partialFilterExpression: filter,
                },
            );
            log(db, coll, res);

            /** @type { AnyBulkWriteOperation[] } */
            let bulkOps = [];
            for await (const doc of await collection.find(filter)) {
                const { _id } = doc;

                /** @type { AnyBulkWriteOperation } */
                const op = {
                    updateOne: {
                        filter: { _id },
                        update: { $set: {} },
                    },
                };

                for (const field of fields) {
                    const value = /** @type { string } */ (dotNotation(doc, field));
                    if (value == null) {
                        continue;
                    }
                    if (typeof value == "string") {
                        op.updateOne.update["$set"][field] = MD5(value);
                    }
                }

                // log(db, coll, EJSON.stringify(op));

                bulkOps.push(op);
                if (bulkOps.length >= 1000) {
                    const res = await collection.bulkWrite(bulkOps, { ordered: false });
                    log(db, coll, JSON.stringify(res));
                    bulkOps = [];
                }
            }
            if (bulkOps.length >= 0) {
                const res = await collection.bulkWrite(bulkOps, { ordered: false });
                log(db, coll, JSON.stringify(res));
            }
        }
    }
})();
