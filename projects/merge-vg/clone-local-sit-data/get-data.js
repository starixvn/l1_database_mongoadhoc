{
  l2p.minigame.currencies.aggregate([
      { $project: { _id: 0 } },
      {
        $lookup: {
          from: "currency_groups",
          localField: "groupId",
          foreignField: "_id",
          as: "cg",
        },
      },
      { $unwind: "$cg" },
      {
        $project: {
          "cg._id": 0,
          "cg.enabled": 0,
          "cg.fractionalOddsFormat": 0,
        },
      },
    ])
    .toArray();

  l2p.minigame.currency_group_games
    .aggregate([
      { $project: { _id: 0 } },
      {
        $lookup: {
          from: "currency_groups",
          localField: "groupId",
          foreignField: "_id",
          as: "cg",
        },
      },
      { $unwind: "$cg" },
      {
        $project: {
          "cg._id": 0,
          "cg.enabled": 0,
          "cg.fractionalOddsFormat": 0,
        },
      },
    ])
    .toArray();

  l2p.minigame.lobbies
    .aggregate([
      { $project: { _id: 0 } },
      { $unwind: "$currencyGroupIds" },
      { $set: { currencyGroupIds: { $toObjectId: "$currencyGroupIds" } } },
      {
        $lookup: {
          from: "currency_groups",
          localField: "currencyGroupIds",
          foreignField: "_id",
          as: "currencyGroupIds",
        },
      },
      { $unwind: "$currencyGroupIds" },
      {
        $unset: [
          "currencyGroupIds._id",
          "currencyGroupIds.enabled",
          "currencyGroupIds.fractionalOddsFormat",
        ],
      },
      {
        $group: {
          _id: {
            time: "$time",
            __v: "$__v",
            name: "$name",
            miniPanelGameIds: "$miniPanelGameIds",
            categories: "$categories",
            banners: "$banners",
          },
          currencyGroupIds: { $addToSet: "$currencyGroupIds" },
        },
      },
      {
        $set: {
          "_id.currencyGroupIds": "$currencyGroupIds",
          currencyGroupIds: "$$REMOVE",
        },
      },
      { $replaceWith: "$_id" },
    ])
    .toArray();
}
