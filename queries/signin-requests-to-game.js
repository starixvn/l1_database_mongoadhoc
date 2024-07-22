{
    const db = l2_pro_arc.log_arc;

    const data = db.signin_requests_bk
        .aggregate([
            {
                $group: {
                    _id: {
                        gameId: "$request.gameTypeId",
                        playerId: { $toString: { $ifNull: ["$request.playerId", "$request.memberId", "$request.obCustId"] } },
                        date: { $substrCP: ["$requestTimeStamp", 0, 10] },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: {
                        gameId: "$_id.gameId",
                        date: "$_id.date",
                    },
                    count: { $sum: "$count" },
                    players: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    gameId: "$_id.gameId",
                    date: "$_id.date",
                    count: 1,
                    players: 1,
                },
            },
        ])
        .toArray();

    console.log(fs.writeFileSync("/home/admin/vg-signin-game-day.json", JSON.stringify(data)));
}

{
    const db = l2_pro_arc.log_arc;

    const data = db.signin_requests_bk
        .aggregate([
            {
                $group: {
                    _id: {
                        gameId: "$request.gameTypeId",
                        playerId: { $toString: { $ifNull: ["$request.playerId", "$request.memberId", "$request.obCustId"] } },
                        month: { $concat: [{ $substrCP: ["$requestTimeStamp", 0, 8] }, "01"] },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: {
                        gameId: "$_id.gameId",
                        month: "$_id.month",
                    },
                    count: { $sum: "$count" },
                    players: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    gameId: "$_id.gameId",
                    month: "$_id.month",
                    count: 1,
                    players: 1,
                },
            },
        ])
        .toArray();

    console.log(fs.writeFileSync("/home/admin/vg-signin-game-month.json", JSON.stringify(data)));
}

{
    const db = l2_pro_arc.log_arc;

    const data = db.signin_requests_bk
        .aggregate([
            {
                $group: {
                    _id: {
                        gameId: "$request.gameTypeId",
                        playerId: { $toString: { $ifNull: ["$request.playerId", "$request.memberId", "$request.obCustId"] } },
                        year: { $concat: [{ $substrCP: ["$requestTimeStamp", 0, 5] }, "01-01"] },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: {
                        gameId: "$_id.gameId",
                        year: "$_id.year",
                    },
                    count: { $sum: "$count" },
                    players: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    gameId: "$_id.gameId",
                    year: "$_id.year",
                    count: 1,
                    players: 1,
                },
            },
        ])
        .toArray();

    console.log(fs.writeFileSync("/home/admin/vg-signin-game-year.json", JSON.stringify(data)));
}
