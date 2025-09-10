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
                            time: { $gte: ISODate("2025-01-01") },
                            currency: { $nin: ["UUS"] },
                        },
                    }, // -
                    { $project: { _id: 0, time: { $dateTrunc: { date: "$time", unit: "week", startOfWeek: "friday" } }, playerId: 1 } },
                    {
                        $group: {
                            _id: {
                                timeNo: { $week: { $dateAdd: { startDate: "$time", unit: "day", amount: 6 } } },
                                time: "$time",
                                player: "$playerId",
                            },
                        },
                    },
                    {
                        $group: {
                            _id: "$_id.timeNo",
                            timeStart: { $first: "$_id.time" },
                            players: { $addToSet: "$_id.player" },
                        },
                    },
                    {
                        $setWindowFields: {
                            partitionBy: "",
                            sortBy: { _id: -1 },
                            output: {
                                lastPlayers: { $shift: { output: "$players", by: 1, default: [] } },
                                lastNo: { $shift: { output: "$_id", by: 1, default: [] } },
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            timeNo: "$_id",
                            timeStart: { $substrCP: [{ $toString: "$timeStart" }, 0, 10] },
                            lastPlayers: { $size: "$lastPlayers" },
                            repeatPlayers: { $size: { $setIntersection: ["$players", "$lastPlayers"] } },
                        },
                    },
                    { $sort: { timeNo: 1 } },
                ]),
            )
        ).forEach(({ timeNo, timeStart, lastPlayers, repeatPlayers }) => {
            const timeData = data.get(timeNo) || new Map();

            if (!data.has(timeNo)) {
                data.set(timeNo, timeData);
            }

            timeData.set(system, { timeStart, lastPlayers, repeatPlayers });
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
                const { timeStart, lastPlayers, repeatPlayers } = systemData.get(system);
                entry.timeStart = entry.timeStart || timeStart; // Use the first timeStart we encounter
                entry[`${system}_lastPlayers`] = lastPlayers;
                entry[`${system}_repeatPlayers`] = repeatPlayers;
                entry[`${system}_retentionRate`] = lastPlayers > 0 ? repeatPlayers / lastPlayers : 0;
            } else {
                entry[`${system}_lastPlayers`] = 0;
                entry[`${system}_repeatPlayers`] = 0;
                entry[`${system}_retentionRate`] = 0;
            }
        }

        // Calculate total across all systems
        entry.total_lastPlayers = (entry.SG_lastPlayers || 0) + (entry.VG_lastPlayers || 0) + (entry.XD_lastPlayers || 0);
        entry.total_repeatPlayers = (entry.SG_repeatPlayers || 0) + (entry.VG_repeatPlayers || 0) + (entry.XD_repeatPlayers || 0);
        entry.total_retentionRate = entry.total_repeatPlayers / entry.total_lastPlayers;

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
                            time: { $gte: ISODate("2025-01-01") },
                            currency: { $nin: ["UUS"] },
                        },
                    }, // -
                    { $project: { _id: 0, time: { $dateTrunc: { date: "$time", unit: "week", startOfWeek: "friday" } }, playerId: 1 } },
                    {
                        $group: {
                            _id: {
                                timeNo: { $week: { $dateAdd: { startDate: "$time", unit: "day", amount: 6 } } },
                                time: "$time",
                                player: "$playerId",
                            },
                        },
                    },
                    {
                        $group: {
                            _id: "$_id.timeNo",
                            timeStart: { $first: "$_id.time" },
                            players: { $addToSet: "$_id.player" },
                        },
                    },
                    {
                        $setWindowFields: {
                            partitionBy: "",
                            sortBy: { _id: -1 },
                            output: {
                                lastPlayers: { $shift: { output: "$players", by: 1, default: [] } },
                                lastNo: { $shift: { output: "$_id", by: 1, default: [] } },
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            timeNo: "$_id",
                            timeStart: { $substrCP: [{ $toString: "$timeStart" }, 0, 10] },
                            lastPlayers: { $size: "$lastPlayers" },
                            repeatPlayers: { $size: { $setIntersection: ["$players", "$lastPlayers"] } },
                        },
                    },
                    { $sort: { timeNo: 1 } },
                ]),
            )
        ).forEach(({ timeNo, timeStart, lastPlayers, repeatPlayers }) => {
            const timeData = data.get(timeNo) || new Map();

            if (!data.has(timeNo)) {
                data.set(timeNo, timeData);
            }

            timeData.set(system, { timeStart, lastPlayers, repeatPlayers });
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
                const { timeStart, lastPlayers, repeatPlayers } = systemData.get(system);
                entry.timeStart = entry.timeStart || timeStart; // Use the first timeStart we encounter
                entry[`${system}_lastPlayers`] = lastPlayers;
                entry[`${system}_repeatPlayers`] = repeatPlayers;
                entry[`${system}_retentionRate`] = lastPlayers > 0 ? repeatPlayers / lastPlayers : 0;
            } else {
                entry[`${system}_lastPlayers`] = 0;
                entry[`${system}_repeatPlayers`] = 0;
                entry[`${system}_retentionRate`] = 0;
            }
        }

        // Calculate total across all systems
        entry.total_lastPlayers = (entry.SG_lastPlayers || 0) + (entry.VG_lastPlayers || 0) + (entry.XD_lastPlayers || 0);
        entry.total_repeatPlayers = (entry.SG_repeatPlayers || 0) + (entry.VG_repeatPlayers || 0) + (entry.XD_repeatPlayers || 0);
        entry.total_retentionRate = entry.total_repeatPlayers / entry.total_lastPlayers;

        return entry;
    });

    // Sort by timeNo for consistent output
    result.sort((a, b) => a.timeNo - b.timeNo);

    console.table(result);
    console.log(JSON.stringify(result));
})();
