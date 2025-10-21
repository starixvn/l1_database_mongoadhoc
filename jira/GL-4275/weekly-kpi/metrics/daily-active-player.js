(async () => {
    const data = new Map();

    const tasks = [
        [l1_pro_arc, "SG"],
        [l2_pro_arc, "VG"],
        [l4_pro_arc, "XD"],
    ].map(async ([dbs, system]) => {
        (
            await dbs.summary_arc.daily_statements_bk.aggregate(
                /** @type { CollectionAggregationPipeline } */ ([
                    {
                        $match: {
                            time: { $gte: ISODate("2025-08-01") },
                            currency: { $nin: ["UUS"] },
                        },
                    }, // -
                    { $project: { _id: 0, time: { $dateTrunc: { date: "$time", unit: "day" } }, playerId: 1 } },
                    {
                        $group: {
                            _id: {
                                timeNo: { $add: [{ $multiply: [{ $year: "$time" }, 1000] }, { $dayOfYear: "$time" }] },
                                time: "$time",
                                player: "$playerId",
                            },
                        },
                    },
                    {
                        $group: {
                            _id: "$_id.timeNo",
                            timeStart: { $first: "$_id.time" },
                            count: { $sum: 1 },
                            // players: { $addToSet: "$_id.player" },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            timeNo: "$_id",
                            timeStart: { $substrCP: [{ $toString: "$timeStart" }, 0, 10] },
                            count: 1,
                        },
                    },
                    { $sort: { timeNo: 1 } },
                ]),
            )
        ).forEach(({ timeNo, timeStart, count }) => {
            const timeData = data.get(timeNo) || new Map();

            if (!data.has(timeNo)) {
                data.set(timeNo, timeData);
            }

            timeData.set(system, { timeStart, count });
        });
    });

    await Promise.all(tasks);

    // Flatten data to array of JSON objects
    const result = Array.from(data.entries()).map(([timeNo, systemData]) => {
        const entry = { timeNo, timeStart: null };

        // Add data for each system in specific order: SG, VG, XD
        const systemOrder = ["SG", "VG", "XD"];
        for (const system of systemOrder) {
            if (systemData.has(system)) {
                const { timeStart, count } = systemData.get(system);
                entry.timeStart = entry.timeStart || timeStart; // Use the first timeStart we encounter
                entry[system] = count;
            } else {
                entry[system] = 0; // Ensure the system property exists even if no data
            }
        }

        // Calculate total across all systems
        entry.total = (entry.SG || 0) + (entry.VG || 0) + (entry.XD || 0);

        return entry;
    });

    // Sort by timeNo for consistent output
    result.sort((a, b) => a.timeNo - b.timeNo);

    console.table(result);
    console.log(JSON.stringify(result));
})();

(async () => {
    const data = new Map();

    const tasks = [
        [l1_pro, "SG"],
        [l2_pro, "VG"],
        [l4_pro, "XD"],
    ].map(async ([dbs, system]) => {
        (
            await dbs.summary.daily_statements.aggregate(
                /** @type { CollectionAggregationPipeline } */ ([
                    {
                        $match: {
                            time: { $gte: ISODate("2025-08-01") },
                            currency: { $nin: ["UUS"] },
                        },
                    }, // -
                    { $project: { _id: 0, time: { $dateTrunc: { date: "$time", unit: "day" } }, playerId: 1 } },
                    {
                        $group: {
                            _id: {
                                timeNo: { $add: [{ $multiply: [{ $year: "$time" }, 1000] }, { $dayOfYear: "$time" }] },
                                time: "$time",
                                player: "$playerId",
                            },
                        },
                    },
                    {
                        $group: {
                            _id: "$_id.timeNo",
                            timeStart: { $first: "$_id.time" },
                            count: { $sum: 1 },
                            // players: { $addToSet: "$_id.player" },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            timeNo: "$_id",
                            timeStart: { $substrCP: [{ $toString: "$timeStart" }, 0, 10] },
                            count: 1,
                        },
                    },
                    { $sort: { timeNo: 1 } },
                ]),
            )
        ).forEach(({ timeNo, timeStart, count }) => {
            const timeData = data.get(timeNo) || new Map();

            if (!data.has(timeNo)) {
                data.set(timeNo, timeData);
            }

            timeData.set(system, { timeStart, count });
        });
    });

    await Promise.all(tasks);
    // Flatten data to array of JSON objects
    const result = Array.from(data.entries()).map(([timeNo, systemData]) => {
        const entry = { timeNo, timeStart: null };

        // Add data for each system in specific order: SG, VG, XD
        const systemOrder = ["SG", "VG", "XD"];
        for (const system of systemOrder) {
            if (systemData.has(system)) {
                const { timeStart, count } = systemData.get(system);
                entry.timeStart = entry.timeStart || timeStart; // Use the first timeStart we encounter
                entry[system] = count;
            } else {
                entry[system] = 0; // Ensure the system property exists even if no data
            }
        }

        // Calculate total across all systems
        entry.total = (entry.SG || 0) + (entry.VG || 0) + (entry.XD || 0);

        return entry;
    });

    // Sort by timeNo for consistent output
    result.sort((a, b) => a.timeNo - b.timeNo);

    console.table(result);
    console.log(JSON.stringify(result));
})();

(async () => {
    const data = new Map();

    const tasks = [
        [l5_pro_arc, "SP-HD"], // -
    ].map(async ([dbs, system]) => {
        (
            await dbs.hotdog_summary_arc.daily_statements_bk.aggregate(
                /** @type { CollectionAggregationPipeline } */ ([
                    {
                        $match: {
                            time: { $gte: ISODate("2025-01-01") },
                            currency: { $nin: ["UUS"] },
                        },
                    }, // -
                    { $project: { _id: 0, time: { $dateTrunc: { date: "$time", unit: "day" } }, playerId: 1 } },
                    {
                        $group: {
                            _id: {
                                timeNo: { $add: [{ $multiply: [{ $year: "$time" }, 1000] }, { $dayOfYear: "$time" }] },
                                time: "$time",
                                player: "$playerId",
                            },
                        },
                    },
                    {
                        $group: {
                            _id: "$_id.timeNo",
                            timeStart: { $first: "$_id.time" },
                            count: { $sum: 1 },
                            // players: { $addToSet: "$_id.player" },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            timeNo: "$_id",
                            timeStart: { $substrCP: [{ $toString: "$timeStart" }, 0, 10] },
                            count: 1,
                        },
                    },
                    { $sort: { timeNo: 1 } },
                ]),
            )
        ).forEach(({ timeNo, timeStart, count }) => {
            const timeData = data.get(timeNo) || new Map();

            if (!data.has(timeNo)) {
                data.set(timeNo, timeData);
            }

            timeData.set(system, { timeStart, count });
        });
    });

    await Promise.all(tasks);

    // Flatten data to array of JSON objects
    const result = Array.from(data.entries()).map(([timeNo, systemData]) => {
        const entry = { timeNo, timeStart: null };

        // Add data for each system in specific order: SG, VG, XD
        const systemOrder = ["SP-HD"];
        for (const system of systemOrder) {
            if (systemData.has(system)) {
                const { timeStart, count } = systemData.get(system);
                entry.timeStart = entry.timeStart || timeStart; // Use the first timeStart we encounter
                entry[system] = count;
            } else {
                entry[system] = 0; // Ensure the system property exists even if no data
            }
        }

        // Calculate total across all systems

        return entry;
    });

    // Sort by timeNo for consistent output
    result.sort((a, b) => a.timeNo - b.timeNo);

    console.table(result);
    console.log(JSON.stringify(result));
})();

(async () => {
    const data = new Map();

    const tasks = [
        [l5_pro, "SP-HD"], // -
    ].map(async ([dbs, system]) => {
        (
            await dbs.hotdog_summary.daily_statements.aggregate(
                /** @type { CollectionAggregationPipeline } */ ([
                    {
                        $match: {
                            time: { $gte: ISODate("2025-01-01") },
                            currency: { $nin: ["UUS"] },
                        },
                    }, // -
                    { $project: { _id: 0, time: { $dateTrunc: { date: "$time", unit: "day" } }, playerId: 1 } },
                    {
                        $group: {
                            _id: {
                                timeNo: { $add: [{ $multiply: [{ $year: "$time" }, 1000] }, { $dayOfYear: "$time" }] },
                                time: "$time",
                                player: "$playerId",
                            },
                        },
                    },
                    {
                        $group: {
                            _id: "$_id.timeNo",
                            timeStart: { $first: "$_id.time" },
                            count: { $sum: 1 },
                            // players: { $addToSet: "$_id.player" },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            timeNo: "$_id",
                            timeStart: { $substrCP: [{ $toString: "$timeStart" }, 0, 10] },
                            count: 1,
                        },
                    },
                    { $sort: { timeNo: 1 } },
                ]),
            )
        ).forEach(({ timeNo, timeStart, count }) => {
            const timeData = data.get(timeNo) || new Map();

            if (!data.has(timeNo)) {
                data.set(timeNo, timeData);
            }

            timeData.set(system, { timeStart, count });
        });
    });

    await Promise.all(tasks);
    // Flatten data to array of JSON objects
    const result = Array.from(data.entries()).map(([timeNo, systemData]) => {
        const entry = { timeNo, timeStart: null };

        // Add data for each system in specific order: SG, VG, XD
        const systemOrder = ["SP-HD"];
        for (const system of systemOrder) {
            if (systemData.has(system)) {
                const { timeStart, count } = systemData.get(system);
                entry.timeStart = entry.timeStart || timeStart; // Use the first timeStart we encounter
                entry[system] = count;
            } else {
                entry[system] = 0; // Ensure the system property exists even if no data
            }
        }

        // Calculate total across all systems
        entry.total = entry["SP-HD"] || 0;

        return entry;
    });

    // Sort by timeNo for consistent output
    result.sort((a, b) => a.timeNo - b.timeNo);

    console.table(result);
    console.log(JSON.stringify(result));
})();
