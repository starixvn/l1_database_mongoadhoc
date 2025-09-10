(async () => {
    const data = new Map();

    const tasks = [
        [l1_pro_arc, "SG"],
        [l2_pro_arc, "VG"],
        [l4_pro_arc, "XD"],
    ].map(async ([dbs, system]) => {
        (
            await dbs.summary_arc.daily_summaries_bk.aggregate(
                /** @type { CollectionAggregationPipeline } */ ([
                    {
                        $match: {
                            time: { $gte: ISODate("2024-01-01"), $lt: ISODate("2025-01-07") },
                            currency: { $nin: ["UUS"] },
                        },
                    }, // -
                    { $project: { _id: 0, time: { $dateTrunc: { date: "$time", unit: "week", startOfWeek: "friday" } }, winloss: "$USD.winloss" } },
                    {
                        $group: {
                            _id: {
                                timeNo: {
                                    $add: [
                                        { $multiply: [{ $year: { $dateAdd: { startDate: "$time", unit: "day", amount: 6 } } }, 100] },
                                        { $week: { $dateAdd: { startDate: "$time", unit: "day", amount: 6 } } },
                                    ],
                                },
                                time: "$time",
                            },
                            ggr: { $sum: { $subtract: [0, "$winloss"] } },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            timeNo: "$_id.timeNo",
                            timeStart: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                            ggr: { $toDouble: { $round: ["$ggr", 4] } },
                        },
                    },
                    { $sort: { timeNo: 1 } },
                ]),
            )
        ).forEach(({ timeNo, timeStart, ggr }) => {
            const timeData = data.get(timeNo) || new Map();

            if (!data.has(timeNo)) {
                data.set(timeNo, timeData);
            }

            timeData.set(system, { timeStart, ggr });
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
                const { timeStart, ggr } = systemData.get(system);
                entry.timeStart = entry.timeStart || timeStart; // Use the first timeStart we encounter
                entry[system] = ggr;
            } else {
                entry[system] = 0; // Ensure the system property exists even if no data
            }
        }

        // Calculate total across all systems
        entry.total = Number(((entry.SG || 0) + (entry.VG || 0) + (entry.XD || 0)).toFixed(4));

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
        [l1_pro_arc, "SG"],
        [l2_pro_arc, "VG"],
        [l4_pro_arc, "XD"],
    ].map(async ([dbs, system]) => {
        (
            await dbs.summary_arc.daily_summaries_bk.aggregate(
                /** @type { CollectionAggregationPipeline } */ ([
                    {
                        $match: {
                            time: { $gte: ISODate("2025-01-01") },
                            currency: { $nin: ["UUS"] },
                        },
                    }, // -
                    { $project: { _id: 0, time: { $dateTrunc: { date: "$time", unit: "week", startOfWeek: "friday" } }, winloss: "$USD.winloss" } },
                    {
                        $group: {
                            _id: {
                                timeNo: {
                                    $add: [
                                        { $multiply: [{ $year: { $dateAdd: { startDate: "$time", unit: "day", amount: 6 } } }, 100] },
                                        { $week: { $dateAdd: { startDate: "$time", unit: "day", amount: 6 } } },
                                    ],
                                },
                                time: "$time",
                            },
                            ggr: { $sum: { $subtract: [0, "$winloss"] } },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            timeNo: "$_id.timeNo",
                            timeStart: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                            ggr: { $toDouble: { $round: ["$ggr", 4] } },
                        },
                    },
                    { $sort: { timeNo: 1 } },
                ]),
            )
        ).forEach(({ timeNo, timeStart, ggr }) => {
            const timeData = data.get(timeNo) || new Map();

            if (!data.has(timeNo)) {
                data.set(timeNo, timeData);
            }

            timeData.set(system, { timeStart, ggr });
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
                const { timeStart, ggr } = systemData.get(system);
                entry.timeStart = entry.timeStart || timeStart; // Use the first timeStart we encounter
                entry[system] = ggr;
            } else {
                entry[system] = 0; // Ensure the system property exists even if no data
            }
        }

        // Calculate total across all systems
        entry.total = Number(((entry.SG || 0) + (entry.VG || 0) + (entry.XD || 0)).toFixed(4));

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
            await dbs.summary.daily_summaries.aggregate(
                /** @type { CollectionAggregationPipeline } */ ([
                    {
                        $match: {
                            time: { $gte: ISODate("2025-01-01") },
                            currency: { $nin: ["UUS"] },
                        },
                    }, // -
                    { $project: { _id: 0, time: { $dateTrunc: { date: "$time", unit: "week", startOfWeek: "friday" } }, winloss: "$USD.winloss" } },
                    {
                        $group: {
                            _id: {
                                timeNo: {
                                    $add: [
                                        { $multiply: [{ $year: { $dateAdd: { startDate: "$time", unit: "day", amount: 6 } } }, 100] },
                                        { $week: { $dateAdd: { startDate: "$time", unit: "day", amount: 6 } } },
                                    ],
                                },
                                time: "$time",
                            },
                            ggr: { $sum: { $subtract: [0, "$winloss"] } },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            timeNo: "$_id.timeNo",
                            timeStart: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                            ggr: { $toDouble: { $round: ["$ggr", 4] } },
                        },
                    },
                    { $sort: { timeNo: 1 } },
                ]),
            )
        ).forEach(({ timeNo, timeStart, ggr }) => {
            const timeData = data.get(timeNo) || new Map();

            if (!data.has(timeNo)) {
                data.set(timeNo, timeData);
            }

            timeData.set(system, { timeStart, ggr });
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
                const { timeStart, ggr } = systemData.get(system);
                entry.timeStart = entry.timeStart || timeStart; // Use the first timeStart we encounter
                entry[system] = ggr;
            } else {
                entry[system] = 0; // Ensure the system property exists even if no data
            }
        }

        // Calculate total across all systems
        entry.total = Number(((entry.SG || 0) + (entry.VG || 0) + (entry.XD || 0)).toFixed(4));

        return entry;
    });

    // Sort by timeNo for consistent output
    result.sort((a, b) => a.timeNo - b.timeNo);

    console.table(result);
    console.log(JSON.stringify(result));
})();
