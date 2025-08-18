(async () => {
    const data = new Map();

    const tasks = [
        [l1_pro_arc, "SG"],
        [l2_pro_arc, "VG"],
        [l4_pro_arc, "XD"],
    ].map(async ([dbs, system]) => {
        (
            await dbs.minigame_arc.usersessions_bk.aggregate(
                /** @type { CollectionAggregationPipeline } */ ([
                    {
                        $match: {
                            ssoTime: { $gte: ISODate("2025-01-01") },
                            currencyName: { $nin: ["UUS"] },
                        },
                    }, // -
                    {
                        $project: {
                            _id: 0,
                            ssoTime: 1,
                            recheckInTime: 1,
                            playerId: 1,
                            operatorId: 1,
                            sessionId: 1,
                            startTime: "$ssoTime",
                            endTime: { $dateAdd: { startDate: "$recheckInTime", unit: "second", amount: 60 } },
                            duration: { $add: [{ $dateDiff: { startDate: "$ssoTime", endDate: "$recheckInTime", unit: "second" } }, 60] },
                        },
                    },
                    {
                        $lookup: {
                            from: "ticket_silos_bk",
                            localField: "playerId",
                            foreignField: "playerId",
                            let: {
                                operatorId: "$operatorId",
                                startTime: "$startTime",
                                endTime: "$endTime",
                            },
                            pipeline: [
                                {
                                    $match: {
                                        time: { $gte: ISODate("2025-01-01") },
                                        $expr: {
                                            $and: [
                                                { $eq: ["$operatorId", "$$operatorId"] }, // -
                                                { $gte: ["$time", "$$startTime"] },
                                                { $lte: ["$time", "$$endTime"] },
                                            ],
                                        },
                                    },
                                }, // -
                                { $sort: { _id: 1 } },
                                { $project: { _id: 1 } },
                            ],
                            as: "bets",
                        },
                    },
                    {
                        $set: {
                            bets: { $size: "$bets" },
                            time: { $dateTrunc: { date: "$startTime", unit: "week", startOfWeek: "friday" } },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                timeNo: { $week: { $dateAdd: { startDate: "$time", unit: "day", amount: 6 } } },
                                time: "$time",
                            },
                            count: { $sum: 1 },
                            bets: { $sum: "$bets" },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            timeNo: "$_id.timeNo",
                            timeStart: { $substrCP: [{ $toString: "$_id.time" }, 0, 10] },
                            count: 1,
                            bets: 1,
                        },
                    },
                    { $sort: { timeNo: 1 } },
                ]),
            )
        ).forEach(({ timeNo, timeStart, count, bets }) => {
            const timeData = data.get(timeNo) || new Map();

            if (!data.has(timeNo)) {
                data.set(timeNo, timeData);
            }

            timeData.set(system, { timeStart, count, bets });
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
                const { timeStart, count, bets } = systemData.get(system);
                entry.timeStart = entry.timeStart || timeStart; // Use the first timeStart we encounter
                entry[system] = count;
                entry[`${system}_bets`] = bets;
                entry[`${system}_betsPerSession`] = count > 0 ? bets / count : 0;
            } else {
                entry[system] = 0; // Ensure the system property exists even if no data
                entry[`${system}_bets`] = 0;
                entry[`${system}_betsPerSession`] = 0;
            }
        }

        // Calculate totals across all systems
        entry.total = (entry.SG || 0) + (entry.VG || 0) + (entry.XD || 0);
        entry.total_bets = (entry.SG_bets || 0) + (entry.VG_bets || 0) + (entry.XD_bets || 0);
        entry.total_betsPerSession = entry.total > 0 ? entry.total_bets / entry.total : 0;

        return entry;
    });

    // Sort by timeNo for consistent output
    result.sort((a, b) => a.timeNo - b.timeNo);

    console.table(result);
    console.log(JSON.stringify(result));
})();
