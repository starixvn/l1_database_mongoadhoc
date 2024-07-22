{
    l2_pro.log.signin_requests.aggregate([
        {
            $project: {
                _id: 0,
                signInDate: { $toDate: { $substrCP: ["$requestTimeStamp", 0, 10] } },
                operatorId: "$request.auth.operatorId",
                userAgent: "$request.browserUserAgent",
                currency: "$request.currency",
                UA: {
                    $regexFind: {
                        input: "$request.browserUserAgent",
                        regex: /^.* \(([^;)]*); ([^)]*)\).*\([^)]*\).*$/,
                    },
                },
            },
        },
        {
            $group: {
                _id: { date: "$signInDate", operatorId: "$operatorId", curreny: "$currency", device: { $arrayElemAt: ["$UA.captures", 0] } },
                cnt: { $sum: 1 },
                UAs: { $addToSet: "$userAgent" },
            },
        },
    ]);
}

{
    const res = l2_pro_arc.log_arc.signin_requests_bk
        .aggregate([
            { $match: { requestTimeStamp: { $gte: "2024-06-10" } } },
            {
                $project: {
                    _id: 0,
                    signInDate: { $toDate: { $substrCP: ["$requestTimeStamp", 0, 10] } },
                    operatorId: "$request.auth.operatorId",
                    userAgent: "$request.browserUserAgent",
                    currency: "$request.currency",
                    UA: {
                        $regexFind: {
                            input: "$request.browserUserAgent",
                            regex: /^.* \((iPhone; CPU ([^)]*) like [^)]*|Linux;[^()]* (Android [^;()]*)[^()]*|[^()]*(Windows NT [^;()]*);?[^()]*|(Android[^;()]*);[^()]*|Mac[^()]*(Mac OS[^()]*)|iPad; CPU ([^)]*) like [^)]*|(X11)[^()]*|SMART-TV[^()]*; ([^;()]*)|[^()]*)\) (?:Apple|Gecko).*(?:\([^)]*\))?.*$/,
                        },
                    },
                },
            },
            {
                $group: {
                    _id: {
                        date: "$signInDate",
                        operatorId: "$operatorId",
                        currency: "$currency",
                        osv: {
                            $ifNull: [
                                { $arrayElemAt: ["$UA.captures", 1] },
                                { $arrayElemAt: ["$UA.captures", 2] },
                                { $arrayElemAt: ["$UA.captures", 3] },
                                { $arrayElemAt: ["$UA.captures", 4] },
                                { $arrayElemAt: ["$UA.captures", 5] },
                                { $arrayElemAt: ["$UA.captures", 6] },
                                { $arrayElemAt: ["$UA.captures", 7] },
                                { $arrayElemAt: ["$UA.captures", 8] },
                            ],
                        },
                    },
                    cnt: { $sum: 1 },
                    UAs: { $addToSet: "$userAgent" },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    operatorId: "$_id.operatorId",
                    currency: "$_id.currency",
                    osv: "$_id.osv",
                    cnt: 1,
                    // UAs: 1,
                },
            },
            { $sort: { date: 1, operatorId: 1, currency: 1, device: 1 } },
        ])
        .toArray();

    console.table(res);
    console.log(fs.writeFileSync("/home/admin/20240624-useragent-VG.json", JSON.stringify(res)));
}

{
    const res = l2_pro_arc.log_arc.signin_requests_bk
        .aggregate([
            { $match: { requestTimeStamp: { $gte: "2024-06-10" } } },
            {
                $project: {
                    _id: 0,
                    signInDate: { $toDate: { $substrCP: ["$requestTimeStamp", 0, 10] } },
                    operatorId: "$request.auth.operatorId",
                    userAgent: "$request.browserUserAgent",
                    currency: "$request.currency",
                    UA: {
                        $regexFind: {
                            input: "$request.browserUserAgent",
                            regex: /^.* \((iPhone; CPU ([^)]*) like [^)]*|Linux;[^()]* (Android [^;()]*)[^()]*|[^()]*(Windows NT [^;()]*);?[^()]*|(Android[^;()]*);[^()]*|Mac[^()]*(Mac OS[^()]*)|iPad; CPU ([^)]*) like [^)]*|(X11)[^()]*|SMART-TV[^()]*; ([^;()]*)|[^()]*)\) (?:Apple|Gecko).*(?:\([^)]*\))?.*$/,
                        },
                    },
                },
            },
            {
                $group: {
                    _id: {
                        date: "$signInDate",
                        operatorId: "$operatorId",
                        currency: "$currency",
                        osv: {
                            $ifNull: [
                                { $arrayElemAt: ["$UA.captures", 1] },
                                { $arrayElemAt: ["$UA.captures", 2] },
                                { $arrayElemAt: ["$UA.captures", 3] },
                                { $arrayElemAt: ["$UA.captures", 4] },
                                { $arrayElemAt: ["$UA.captures", 5] },
                                { $arrayElemAt: ["$UA.captures", 6] },
                                { $arrayElemAt: ["$UA.captures", 7] },
                                { $arrayElemAt: ["$UA.captures", 8] },
                            ],
                        },
                    },
                    cnt: { $sum: 1 },
                    UAs: { $addToSet: "$userAgent" },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    operatorId: "$_id.operatorId",
                    currency: "$_id.currency",
                    osv: "$_id.osv",
                    cnt: 1,
                    // UAs: 1,
                },
            },
            { $sort: { date: 1, operatorId: 1, currency: 1, device: 1 } },
        ])
        .toArray();

    console.table(res);
    console.log(fs.writeFileSync("/home/admin/20240624-useragent-VG.json", JSON.stringify(res)));
}




{
    l2_pro_arc.log_arc.signin_requests_bk.aggregate([
        { $match: { requestTimeStamp: { $gte: "2024-06-10" } } },
        {
            $project: {
                _id: 0,
                signInDate: { $toDate: { $substrCP: ["$requestTimeStamp", 0, 10] } },
                operatorId: "$request.auth.operatorId",
                userAgent: "$request.browserUserAgent",
                currency: "$request.currency",
                UA: {
                    $regexFind: {
                        input: "$request.browserUserAgent",
                        regex: /^.* \((iPhone; CPU ([^)]*) like [^)]*|Linux;[^()]* (Android [^;()]*)[^()]*|[^()]*(Windows NT [^;()]*);?[^()]*|(Android[^;()]*);[^()]*|Mac[^()]*(Mac OS[^()]*)|iPad; CPU ([^)]*) like [^)]*|(X11)[^()]*|SMART-TV[^()]*; ([^;()]*)|[^()]*)\) (?:Apple|Gecko).*(?:\([^)]*\))?.*$/,
                    },
                },
            },
        },
        {
            $set: {
                UA: "$UA.captures",
                device: {
                    $ifNull: [
                        { $arrayElemAt: ["$UA.captures", 1] },
                        { $arrayElemAt: ["$UA.captures", 2] },
                        { $arrayElemAt: ["$UA.captures", 3] },
                        { $arrayElemAt: ["$UA.captures", 4] },
                        { $arrayElemAt: ["$UA.captures", 5] },
                        { $arrayElemAt: ["$UA.captures", 6] },
                        { $arrayElemAt: ["$UA.captures", 7] },
                        { $arrayElemAt: ["$UA.captures", 8] },
                    ],
                },
            },
        },
        { $match: { device: null } },
    ]);
}
