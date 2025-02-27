// MD5().buffer.toString("hex")

{
    const logger = (...args) => console.log(new Date().toISOString(), ...args);
    const db = l1p.minigame_arc;
    const test = new RegExp().test;

    const collNames = db
        .getCollectionNames()
        .filter(test.bind(/_results_bk$/))
        .sort();

    for (const collName of collNames) {
        const coll = db.getCollection(collName);
        const { size, count, storageSize } = coll.stats();
        logger(collName, count, size / 1024 ** 2, storageSize / 1024 ** 2);
        let cnt = 0;

        coll.find().forEach((data) => {
            const { _id, encryptedResult, encryptedResultHash } = data;
            let updated = false;

            if (encryptedResult) {
                const { iv, content } = encryptedResult;
                if (typeof iv === "string") {
                    encryptedResult.iv = MD5(iv);
                    updated = true;
                }
                if (typeof content === "string") {
                    encryptedResult.content = MD5(content);
                    updated = true;
                }
            }
            if (encryptedResultHash) {
                const { iv, content } = encryptedResultHash;
                if (typeof iv === "string") {
                    encryptedResultHash.iv = MD5(iv);
                    updated = true;
                }
                if (typeof content === "string") {
                    encryptedResultHash.content = MD5(content);
                    updated = true;
                }
            }

            if (updated) {
                const { modifiedCount } = coll.updateOne({ _id }, { $set: { encryptedResult, encryptedResultHash } });
                cnt += modifiedCount;
                if (cnt % 10_000 === 0) {
                    logger(collName, cnt);
                }
            }

            coll.updateOne({ _id }, { $set: { "__archive.md5": true } });
        });

        const { size: size_, count: count_, storageSize: storageSize_ } = coll.stats();
        logger(collName, count_, size_ / 1024 ** 2, storageSize_ / 1024 ** 2);
    }
}

{
    const logger = (...args) => console.log(new Date().toISOString(), ...args);
    const db = l1pp.minigame_arc;

    const collName = "blockchainbaccarat_results_bk";
    const coll = db.getCollection(collName);
    const { size, count, storageSize } = coll.stats();
    logger(collName, count, size / 1024 ** 2, storageSize / 1024 ** 2);
    let cnt = 0;

    coll.find({ "__archive.md5": { $ne: true } }).forEach((data) => {
        const { _id, chain } = data;
        let updated = false;

        if (chain) {
            for (const link of chain) {
                if (link) {
                    const { encryptedResult, encryptedResultHash, revealedRawValue } = link;

                    if (encryptedResult) {
                        const { iv, content } = encryptedResult;
                        if (typeof iv === "string") {
                            encryptedResult.iv = MD5(iv);
                            updated = true;
                        }
                        if (typeof content === "string") {
                            encryptedResult.content = MD5(content);
                            updated = true;
                        }
                    }
                    if (encryptedResultHash) {
                        const { iv, content } = encryptedResultHash;
                        if (typeof iv === "string") {
                            encryptedResultHash.iv = MD5(iv);
                            updated = true;
                        }
                        if (typeof content === "string") {
                            encryptedResultHash.content = MD5(content);
                            updated = true;
                        }
                    }
                    if (typeof revealedRawValue === "string") {
                        link.revealedRawValue = MD5(revealedRawValue);
                        updated = true;
                    }
                }
            }
        }

        if (updated) {
            const { modifiedCount } = coll.updateOne({ _id }, { $set: { chain } });
            cnt += modifiedCount;
            if (cnt % 1_000 === 0) {
                logger(collName, cnt);
            }
        }

        coll.updateOne({ _id }, { $set: { "__archive.md5": true } });
    });

    const { size: size_, count: count_, storageSize: storageSize_ } = coll.stats();
    logger(collName, count_, size_ / 1024 ** 2, storageSize_ / 1024 ** 2);
}
