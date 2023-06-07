{
  const dbs = l2p;
  const db = dbs.minigame;

  console.log("dbs.test.jackpots_update", dbs.test.jackpots_update.drop());

  db.jackpots.aggregate([
    { $match: { hitAt: { $gt: 0 } } },
    {
      $project: {
        hitAt: 1,
        hitTime: 1,
        currency: "$__archive.currency",
        operatorId: {
          $ifNull: ["$operatorId", { $literal: "ONEworksVGCash" }],
        },
      },
    },
    {
      $lookup: {
        from: "currencies",
        let: { currency: "$currency", operatorId: "$operatorId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$name", "$$currency"] },
                  { $eq: ["$partnerId", "$$operatorId"] },
                ],
              },
            },
          },
          { $project: { code: 1, multiplier: 1 } },
          { $limit: 1 },
        ],
        as: "code",
      },
    },
    { $unwind: { path: "$code", preserveNullAndEmptyArrays: true } },
    {
      $set: {
        code: { $ifNull: ["$code.code", { $literal: "VND" }] },
        multiplier: { $ifNull: ["$code.multiplier", { $literal: 1000 }] },
      },
    },
    {
      $lookup: {
        from: "exchange_rates",
        let: { hitTime: "$hitTime", code: "$code" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [{ $lt: ["$time", "$$hitTime"] }, { $eq: ["$exId", 1] }],
              },
            },
          },
          { $sort: { time: -1 } },
          { $limit: 1 },
          {
            $set: {
              code: {
                $filter: {
                  input: { $objectToArray: "$code" },
                  as: "c",
                  cond: { $eq: ["$$c.k", "$$code"] },
                },
              },
            },
          },
          { $unwind: { path: "$code", preserveNullAndEmptyArrays: true } },
          { $set: { code: { $ifNull: ["$code.v", { $literal: 1 }] } } },
          { $project: { _id: 0, exId: 1, time: 1, code: 1 } },
        ],
        as: "ex",
      },
    },
    { $unwind: { path: "$ex", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        currency: 1,
        rate: { $toDouble: { $multiply: ["$multiplier", "$ex.code"] } },
        exchangeRateId: "$ex.exId",
      },
    },
    { $merge: { into: { db: "test", coll: "jackpots_update" } } },
  ]);

  dbs.test.jackpots_update.aggregate([
    { $merge: { into: { db: "minigame", coll: "jackpots" } } },
  ]);
}
