(async () => {
    const data = new Map();

    const tasks = [
        [l1_pro, "SG"],
        [l2_pro, "VG"],
        [l4_pro, "XD"],
    ].map(async ([dbs, system]) => {
        (
            await dbs.minigame.user_silos.aggregate(
                /** @type { CollectionAggregationPipeline } */ ([
                    {
                        $match: {
                            joinTime: { $gte: ISODate("2025-07-01") },
                            currency: { $nin: ["UUS"] },
                        },
                    }, // -
                    { $project: { _id: 0, time: 1, playerId: 1, operatorId: 1 } },
                    {
                        $lookup: {
                            from: "ticket_silos",
                            localField: "playerId",
                            foreignField: "playerId",
                            let: {
                                operatorId: "$operatorId",
                                startTime: "$time",
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$operatorId", "$$operatorId"] }, // -
                                                { $gte: ["$time", "$$startTime"] },
                                            ],
                                        },
                                    },
                                }, // -
                                { $sort: { time: 1 } },
                                { $project: { _id: 0, time: 1 } },
                                { $limit: 1 },
                            ],
                            as: "D0",
                        },
                    },
                    { $unwind: { path: "$D0", preserveNullAndEmptyArrays: true } },
                    { $set: { D0: { $dateTrunc: { date: "$D0.time", unit: "day" } } } },
                    {
                        $lookup: {
                            from: "ticket_silos",
                            localField: "playerId",
                            foreignField: "playerId",
                            let: {
                                operatorId: "$operatorId",
                                startTime: { $dateAdd: { startDate: "$D0", unit: "day", amount: 7 } },
                                endTime: { $dateAdd: { startDate: "$D0", unit: "day", amount: 8 } },
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$operatorId", "$$operatorId"] }, // -
                                                { $gte: ["$time", "$$startTime"] },
                                                { $lt: ["$time", "$$endTime"] },
                                            ],
                                        },
                                    },
                                }, // -
                                { $sort: { time: 1 } },
                                { $project: { _id: 0, time: 1 } },
                                { $limit: 1 },
                            ],
                            as: "D7",
                        },
                    },
                    {
                        $set: {
                            D0: { $dateTrunc: { date: "$D0", unit: "week", startOfWeek: "friday" } },
                            D7: { $size: "$D7" },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                timeNo: { $week: { $dateAdd: { startDate: "$D0", unit: "day", amount: 6 } } },
                                time: "$D0",
                            },
                            count: { $sum: 1 },
                            D7: { $sum: "$D7" },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            timeNo: "$_id.timeNo",
                            timeStart: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                            count: 1,
                            D7: 1,
                        },
                    },
                    { $sort: { timeNo: 1 } },
                ]),
            )
        ).forEach(({ timeNo, timeStart, count, D7 }) => {
            const timeData = data.get(timeNo) || new Map();

            if (!data.has(timeNo)) {
                data.set(timeNo, timeData);
            }

            timeData.set(system, { timeStart, count, D7 });
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
                const { timeStart, count, D7 } = systemData.get(system);
                entry.timeStart = entry.timeStart || timeStart; // Use the first timeStart we encounter
                entry[system] = count;
                entry[`${system}_D7`] = D7;
                entry[`${system}_D7_rate`] = count > 0 ? D7 / count : 0;
            } else {
                entry[system] = 0; // Ensure the system property exists even if no data
                entry[`${system}_D7`] = 0;
                entry[`${system}_D7_rate`] = 0;
            }
        }

        // Calculate totals across all systems
        entry.total = (entry.SG || 0) + (entry.VG || 0) + (entry.XD || 0);
        entry.total_D7 = (entry.SG_D7 || 0) + (entry.VG_D7 || 0) + (entry.XD_D7 || 0);
        entry.total_D7_rate = entry.total > 0 ? entry.total_D7 / entry.total : 0;

        return entry;
    });

    // Sort by timeNo for consistent output
    result.sort((a, b) => a.timeNo - b.timeNo);

    console.table(result);
    console.log(JSON.stringify(result));
})();
