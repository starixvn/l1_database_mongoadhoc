(async () => {
    const data = new Map();

    const tasks = [
        { db: l1_pro_arc.log_arc, system: "SG" },
        { db: l2_pro_arc.log_arc, system: "VG" },
        { db: l4_pro_arc.log_arc, system: "XD" },
        { db: l5_pro_arc.hotdog_log_arc, system: "SP-HD" },
    ].map(async ({ db, system }) => {
        (
            await db.failed_requests_bk.aggregate(
                /** @type { CollectionAggregationPipeline } */ ([
                    {
                        $match: {
                            requestTimeStamp: { $gte: "2025-01-01" },
                            "call._t": /PlaceBet/,
                            "call.currency": { $nin: ["UUS"] },
                        },
                    }, // -
                    { $project: { _id: 0, time: { $dateTrunc: { date: { $toDate: "$requestTimeStamp" }, unit: "week", startOfWeek: "friday" } } } },
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
                            failedCount: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            timeNo: "$_id.timeNo",
                            timeStart: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                            failedCount: 1,
                        },
                    },
                    { $sort: { timeNo: 1 } },
                ]),
            )
        ).forEach(({ timeNo, timeStart, failedCount }) => {
            const timeData = data.get(timeNo) || new Map();

            if (!data.has(timeNo)) {
                data.set(timeNo, timeData);
            }

            const systemData = timeData.get(system) || {};

            if (!timeData.has(system)) {
                timeData.set(system, systemData);
            }

            systemData.timeStart = systemData.timeStart || timeStart;
            systemData.failedCount = failedCount;
        });
        console.log(db, "failed_requests");

        (
            await db.bets_bk.aggregate(
                /** @type { CollectionAggregationPipeline } */ ([
                    {
                        $match: {
                            requestTimeStamp: { $gte: "2025-01-01" },
                            "call.currency": { $nin: ["UUS"] },
                        },
                    }, // -
                    { $project: { _id: 0, time: { $dateTrunc: { date: { $toDate: "$requestTimeStamp" }, unit: "week", startOfWeek: "friday" } } } },
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
                            successCount: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            timeNo: "$_id.timeNo",
                            timeStart: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                            successCount: 1,
                        },
                    },
                    { $sort: { timeNo: 1 } },
                ]),
            )
        ).forEach(({ timeNo, timeStart, successCount }) => {
            const timeData = data.get(timeNo) || new Map();

            if (!data.has(timeNo)) {
                data.set(timeNo, timeData);
            }

            const systemData = timeData.get(system) || {};

            if (!timeData.has(system)) {
                timeData.set(system, systemData);
            }

            systemData.timeStart = systemData.timeStart || timeStart;
            systemData.successCount = successCount;
        });
        console.log(db, "bets");
    });

    await Promise.all(tasks);
    // Flatten data to array of JSON objects
    const result = Array.from(data.entries()).map(([timeNo, systemData]) => {
        const entry = { timeNo, timeStart: null };

        // Add data for each system in specific order: SG, VG, XD
        const systemOrder = ["SG", "VG", "XD", "SP-HD"];
        for (const system of systemOrder) {
            const data = systemData.get(system) || {};
            const timeStart = data.timeStart;
            const successCount = data.successCount || 0;
            const failedCount = data.failedCount || 0;
            const total = successCount + failedCount;
            const successRate = total > 0 ? successCount / total : 0;

            entry.timeStart = entry.timeStart || timeStart; // Use the first timeStart we encounter
            entry[`${system}_success`] = successCount;
            entry[`${system}_failed`] = failedCount;
            entry[`${system}_total`] = total;
            entry[`${system}_success_rate`] = successRate;
        }

        // Calculate totals across all systems
        entry.total_success = (entry.SG_success || 0) + (entry.VG_success || 0) + (entry.XD_success || 0) + (entry["SP-HD_success"] || 0);
        entry.total_failed = (entry.SG_failed || 0) + (entry.VG_failed || 0) + (entry.XD_failed || 0) + (entry["SP-HD_failed"] || 0);
        entry.total = entry.total_success + entry.total_failed;
        entry.total_success_rate = entry.total > 0 ? entry.total_success / entry.total : 0;

        return entry;
    });

    // Sort by timeNo for consistent output
    result.sort((a, b) => a.timeNo - b.timeNo);

    console.table(result);
    console.log(JSON.stringify(result));
})();
