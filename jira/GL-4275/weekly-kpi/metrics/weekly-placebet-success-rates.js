(async () => {
    const data = new Map();

    const tasks = [
        { dbs: l1_pro_arc, system: "SG" },
        { dbs: l2_pro_arc, system: "VG" },
        { dbs: l4_pro_arc, system: "XD" },
    ].map(async ({ dbs, system }) => {
        (
            await dbs.log_arc.failed_requests_bk.aggregate(
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
                                timeNo: { $week: { $dateAdd: { startDate: "$time", unit: "day", amount: 6 } } },
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
        console.log(dbs, "failed_requests");

        (
            await dbs.log_arc.bets_bk.aggregate(
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
                                timeNo: { $week: { $dateAdd: { startDate: "$time", unit: "day", amount: 6 } } },
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
        console.log(dbs, "bets");
    });

    await Promise.all(tasks);

    // Flatten data to array of JSON objects
    const result = Array.from(data.entries()).map(([timeNo, systemData]) => {
        const entry = { timeNo, timeStart: null };

        // Add data for each system (SG, VG, XD)
        for (const [system, { timeStart, successCount, failedCount }] of systemData.entries()) {
            entry.timeStart = entry.timeStart || timeStart; // Use the first timeStart we encounter
            entry[`${system}_success`] = successCount || 0;
            entry[`${system}_failed`] = failedCount || 0;

            // Calculate success rate for each system
            const total = entry[`${system}_success`] + entry[`${system}_failed`];
            entry[`${system}_success_rate`] = total > 0 ? entry[`${system}_success`] / total : 0;
        }

        // Calculate totals across all systems
        entry.total_success = entry.SG_success + entry.VG_success + entry.XD_success;
        entry.total_failed = entry.SG_failed + entry.VG_failed + entry.XD_failed;

        // Calculate total success rate
        const totalAttempts = entry.total_success + entry.total_failed;
        entry.total_success_rate = totalAttempts > 0 ? entry.total_success / totalAttempts : 0;

        return entry;
    });

    // Sort by timeNo for consistent output
    result.sort((a, b) => a.timeNo - b.timeNo);

    console.table(result);
    console.log(JSON.stringify(result));
})();
