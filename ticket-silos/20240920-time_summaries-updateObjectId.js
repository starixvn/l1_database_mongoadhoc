{
    [l1].forEach((dbs) => {
        ["daily_statements", "hourly_statements"].forEach((collName) => {
            const coll = dbs.summary.getCollection(collName);

            /** @type { AnyBulkWriteOperation[] } */
            let ops = [];

            console.log(dbs.toString(), collName, coll.countDocuments());

            coll.aggregate([
                {
                    $set: {
                        __id: {
                            $toHashedIndexKey: {
                                gameId: "$gameId",
                                operatorId: "$operatorId",
                                playerId: "$playerId",
                                siteId: "$siteId",
                                time: "$time",
                            },
                        },
                    },
                },
                {
                    $set: {
                        __id: {
                            $toObjectId: {
                                $concat: [
                                    { $cond: [{ $lt: ["$__id", 0] }, "1", "0"] },
                                    { $substrCP: ["000000000000000000000000", 0, { $subtract: [23, { $strLenCP: { $toString: { $abs: "$__id" } } }] }] },
                                    { $toString: { $abs: "$__id" } },
                                ],
                            },
                        },
                    },
                },
                {
                    $match: {
                        $expr: {
                            $ne: [{ $toString: "$_id" }, { $toString: "$__id" }],
                        },
                    },
                },
            ]).forEach((document) => {
                const { _id, __id } = document;
                delete document.__id;
                document._id = __id;

                ops.push({ deleteOne: { filter: { _id } } });
                ops.push({ insertOne: { document } });

                if (ops.length % 10_000 === 0) {
                    const { insertedCount, deletedCount } = coll.bulkWrite(ops, { ordered: true });

                    console.log({ insertedCount, deletedCount });
                    ops = [];
                }
            });

            if (ops.length) {
                const { insertedCount, deletedCount } = coll.bulkWrite(ops, { ordered: true });

                console.log({ insertedCount, deletedCount });
            }
        });

        ["daily_summaries", "hourly_summaries"].forEach((collName) => {
            const coll = dbs.summary.getCollection(collName);

            /** @type { AnyBulkWriteOperation[] } */
            let ops = [];

            console.log(dbs.toString(), collName, coll.countDocuments());

            coll.aggregate([
                {
                    $set: {
                        __id: {
                            $toHashedIndexKey: {
                                gameId: "$gameId",
                                currency: "$currency",
                                operatorId: "$operatorId",
                                siteId: "$siteId",
                                time: "$time",
                            },
                        },
                    },
                },
                {
                    $set: {
                        __id: {
                            $toObjectId: {
                                $concat: [
                                    { $cond: [{ $lt: ["$__id", 0] }, "1", "0"] },
                                    { $substrCP: ["000000000000000000000000", 0, { $subtract: [23, { $strLenCP: { $toString: { $abs: "$__id" } } }] }] },
                                    { $toString: { $abs: "$__id" } },
                                ],
                            },
                        },
                    },
                },
                {
                    $match: {
                        $expr: {
                            $ne: [{ $toString: "$_id" }, { $toString: "$__id" }],
                        },
                    },
                },
            ]).forEach((document) => {
                const { _id, __id } = document;
                delete document.__id;
                document._id = __id;

                ops.push({ deleteOne: { filter: { _id } } });
                ops.push({ insertOne: { document } });

                if (ops.length % 10_000 === 0) {
                    const { insertedCount, deletedCount } = coll.bulkWrite(ops, { ordered: true });

                    console.log({ insertedCount, deletedCount });
                    ops = [];
                }
            });

            if (ops.length) {
                const { insertedCount, deletedCount } = coll.bulkWrite(ops, { ordered: true });

                console.log({ insertedCount, deletedCount });
            }
        });
    });
}

{
    [l1_pro].forEach((dbs) => {
        ["round_summaries"].forEach((collName) => {
            const coll = dbs.summary.getCollection(collName);

            /** @type { AnyBulkWriteOperation[] } */
            let ops = [];

            console.log(dbs.toString(), collName, coll.countDocuments());

            coll.aggregate([
                {
                    $set: {
                        __id: {
                            $toHashedIndexKey: {
                                gameId: "$gameId",
                                currency: "$currency",
                                operatorId: "$operatorId",
                                siteId: "$siteId",
                                roundId: "$roundId",
                            },
                        },
                    },
                },
                {
                    $set: {
                        __id: {
                            $toObjectId: {
                                $concat: [
                                    { $cond: [{ $lt: ["$__id", 0] }, "1", "0"] },
                                    { $substrCP: ["000000000000000000000000", 0, { $subtract: [23, { $strLenCP: { $toString: { $abs: "$__id" } } }] }] },
                                    { $toString: { $abs: "$__id" } },
                                ],
                            },
                        },
                    },
                },
            ]).forEach((document) => {
                const { _id, __id } = document;
                delete document.__id;
                document._id = __id;

                ops.push({ deleteOne: { filter: { _id } } });
                ops.push({ insertOne: { document } });

                if (ops.length % 10_000 === 0) {
                    const { insertedCount, deletedCount } = coll.bulkWrite(ops, { ordered: true });

                    console.log({ insertedCount, deletedCount });
                    ops = [];
                }
            });

            if (ops.length) {
                const { insertedCount, deletedCount } = coll.bulkWrite(ops, { ordered: true });

                console.log({ insertedCount, deletedCount });
            }
        });
    });
}

{
    [sn_pro].forEach((dbs) => {
        dbs.minigame.ticket_silos.aggregate([
            {
                $project: {
                    _id: 1,
                    "_ids.roundSummary": {
                        $toHashedIndexKey: {
                            gameId: "$gameId",
                            currency: "$currency",
                            operatorId: "$operatorId",
                            siteId: "$siteId",
                            roundId: "$roundId",
                        },
                    },
                    "_ids.hourlyStatement": {
                        $toHashedIndexKey: {
                            gameId: "$gameId",
                            operatorId: "$operatorId",
                            playerId: "$playerId",
                            siteId: "$siteId",
                            time: {
                                $dateFromParts: {
                                    year: { $year: "$roundTime" },
                                    month: { $month: "$roundTime" },
                                    day: { $dayOfMonth: "$roundTime" },
                                    hour: { $hour: "$roundTime" },
                                },
                            },
                        },
                    },
                    "_ids.dailyStatement": {
                        $toHashedIndexKey: {
                            gameId: "$gameId",
                            operatorId: "$operatorId",
                            playerId: "$playerId",
                            siteId: "$siteId",
                            time: {
                                $dateFromParts: {
                                    year: { $year: "$roundTime" },
                                    month: { $month: "$roundTime" },
                                    day: { $dayOfMonth: "$roundTime" },
                                },
                            },
                        },
                    },
                },
            },
            {
                $set: {
                    "_ids.roundSummary": {
                        $toObjectId: {
                            $concat: [
                                { $cond: [{ $lt: ["$_ids.roundSummary", 0] }, "1", "0"] },
                                { $substrCP: ["000000000000000000000000", 0, { $subtract: [23, { $strLenCP: { $toString: { $abs: "$_ids.roundSummary" } } }] }] },
                                { $toString: { $abs: "$_ids.roundSummary" } },
                            ],
                        },
                    },
                    "_ids.hourlyStatement": {
                        $toObjectId: {
                            $concat: [
                                { $cond: [{ $lt: ["$_ids.hourlyStatement", 0] }, "1", "0"] },
                                { $substrCP: ["000000000000000000000000", 0, { $subtract: [23, { $strLenCP: { $toString: { $abs: "$_ids.hourlyStatement" } } }] }] },
                                { $toString: { $abs: "$_ids.hourlyStatement" } },
                            ],
                        },
                    },
                    "_ids.dailyStatement": {
                        $toObjectId: {
                            $concat: [
                                { $cond: [{ $lt: ["$_ids.dailyStatement", 0] }, "1", "0"] },
                                { $substrCP: ["000000000000000000000000", 0, { $subtract: [23, { $strLenCP: { $toString: { $abs: "$_ids.dailyStatement" } } }] }] },
                                { $toString: { $abs: "$_ids.dailyStatement" } },
                            ],
                        },
                    },
                },
            },
            {
                $merge: {
                    into: "ticket_silos",
                    on: "_id",
                    whenMatched: "merge",
                    whenNotMatched: "discard",
                },
            },
        ]);
        dbs.summary.round_summaries.aggregate([
            {
                $project: {
                    "_ids.hourlySummary": {
                        $toHashedIndexKey: {
                            gameId: "$gameId",
                            currency: "$currency",
                            operatorId: "$operatorId",
                            siteId: "$siteId",
                            time: {
                                $dateFromParts: {
                                    year: { $year: "$time" },
                                    month: { $month: "$time" },
                                    day: { $dayOfMonth: "$time" },
                                    hour: { $hour: "$time" },
                                },
                            },
                        },
                    },
                    "_ids.dailySummary": {
                        $toHashedIndexKey: {
                            gameId: "$gameId",
                            currency: "$currency",
                            operatorId: "$operatorId",
                            siteId: "$siteId",
                            time: {
                                $dateFromParts: {
                                    year: { $year: "$time" },
                                    month: { $month: "$time" },
                                    day: { $dayOfMonth: "$time" },
                                },
                            },
                        },
                    },
                },
            },
            {
                $set: {
                    "_ids.hourlySummary": {
                        $toObjectId: {
                            $concat: [
                                { $cond: [{ $lt: ["$_ids.hourlySummary", 0] }, "1", "0"] },
                                { $substrCP: ["000000000000000000000000", 0, { $subtract: [23, { $strLenCP: { $toString: { $abs: "$_ids.hourlySummary" } } }] }] },
                                { $toString: { $abs: "$_ids.hourlySummary" } },
                            ],
                        },
                    },
                    "_ids.dailySummary": {
                        $toObjectId: {
                            $concat: [
                                { $cond: [{ $lt: ["$_ids.dailySummary", 0] }, "1", "0"] },
                                { $substrCP: ["000000000000000000000000", 0, { $subtract: [23, { $strLenCP: { $toString: { $abs: "$_ids.dailySummary" } } }] }] },
                                { $toString: { $abs: "$_ids.dailySummary" } },
                            ],
                        },
                    },
                },
            },
            {
                $merge: {
                    into: "round_summaries",
                    on: "_id",
                    whenMatched: "merge",
                    whenNotMatched: "discard",
                },
            },
        ]);
    });
}
