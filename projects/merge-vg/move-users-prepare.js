{
  const VG3 = l3c;
  const VG2 = l2p;

  {
    const collections = ["users", "userinfos"];
    /** Cleanup old copies */

    const filter = {
      users: { "local.memberId": { $gt: 0 } },
      userinfos: { type: false },
    };

    console.log("\n === Clone users & userinfos ===");
    for (const coll of collections) {
      const fromColl = VG3.minigame.getCollection(coll);
      const toColl = VG3.MergeVG.getCollection(coll);

      console.log(toColl, "dropped", toColl.drop());

      fromColl.aggregate([
        { $match: filter[coll] ?? {} },
        { $merge: { into: { db: "MergeVG", coll } } },
      ]);

      console.log(toColl, toColl.countDocuments());
    }

    console.log("\n === Create clone indexes ===");
    {
      const usersColl = VG3.MergeVG.users;
      const userinfosColl = VG3.MergeVG.userinfos;

      console.log(userinfosColl, userinfosColl.createIndex({ id: 1 }));
    }

    console.log("\n === Verify integrity ===");
    {
      const usersColl = VG3.MergeVG.users;
      const userinfosColl = VG3.MergeVG.userinfos;

      console.log(usersColl);
      console.table(
        usersColl.aggregate([
          { $project: { _id: 0, operatorId: { $ifNull: ["$local.partnerId", "$local.clientId"] }, isCash: "$local.isCash", sid: { $toString: "$_id" } } },
          { $lookup: { from: "userinfos", localField: "sid", foreignField: "id", as: "info" } },
          { $unwind: { path: "$info", preserveNullAndEmptyArrays: true } },
          { $group: {
              _id: "$operatorId",
              total: { $sum: 1 },
              hasUserInfo: { $sum: { $cond: [{ $toBool: "$info" }, 1, 0] } },
              noUserInfo: { $sum: { $cond: [{ $toBool: "$info" }, 0, 1] } },
              credit: { $sum: { $cond: ["$isCash", 0, 1] } },
              cash: { $sum: { $cond: ["$isCash", 1, 0] } },
            },
          },
          { $sort: { _id: 1 } },
        ]).toArray()
      );

      console.log(userinfosColl);
      console.table(
        userinfosColl.aggregate([
          { $project: { _id: 0, uid: { $toObjectId: "$id" } } },
          { $lookup: { from: "users", localField: "uid", foreignField: "_id", as: "user" } },
          { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
          { $group: {
              _id: { $ifNull: ["$user.local.partnerId", "$user.local.clientId"] },
              total: { $sum: 1 },
              hasUser: { $sum: { $cond: [{ $toBool: "$user" }, 1, 0] } },
              noUser: { $sum: { $cond: [{ $toBool: "$user" }, 0, 1] } },
            },
          },
          { $sort: { _id: 1 } },
        ]).toArray()
      );
    }

    {
      console.log("\n === Migrate operator ===");
      let operatorId;

      operatorId = "ONEworksVGCash";
      console.log(`Migrate isCash = true [${operatorId}]`,
        VG3.MergeVG.users.updateMany(
          { operatorId: { $in: ["ONEworks_VG", "gamesimulator"] }, "local.isCash": true },
          [{ $set: {
            operatorId: "ONEworksVGCash",
            "local.partnerId": "ONEworksVGCash",
            "local.username": { $concat: ["ONEworksVGCash_", { $toString: "$local.memberId" }] },
            "local.clientId": "$$REMOVE",
          } }],
        )
      );

      operatorId = "ONEworks_VG";
      console.log(`Migrate isCash = false [${operatorId}]`,
        VG3.MergeVG.users.updateMany(
          { operatorId: { $in: ["ONEworks_VG", "gamesimulator"] }, "local.isCash": false },
          [
            { $set: {
              operatorId: "ONEworks_VG",
              "local.partnerId": "ONEworks_VG",
              "local.username": { $concat: ["ONEworks_VG_", { $toString: "$local.memberId" }] },
              "local.clientId": "$$REMOVE",
            } },
          ],
        )
      );
    }

    console.table(VG3.MergeVG.users.aggregate([
      { $group: { _id: { operatorId: "$operatorId", isCash: "$local.isCash" }, cnt: { $sum: 1 } } },
      { $project: { _id: 0, operatorId: "$_id.operatorId", isCash: "$_id.isCash", count: "$cnt" } },
      { $sort: { operatorId: 1, isCash: 1 } }
    ]).toArray());

    console.log("\n === Check max avatarId ===");
    {
      const userinfosFrom = VG3.MergeVG.userinfos;
      const userinfosTo = VG2.minigame.userinfos;

      console.log(VG3.toString(), userinfosFrom,
        userinfosFrom.aggregate([{ $group: { _id: 0, maxAvatarId: { $max: "$avatarId" } } }]).toArray()[0].maxAvatarId
      );

      console.log(VG2.toString(), userinfosTo,
        userinfosTo.aggregate([{ $group: { _id: 0, maxAvatarId: { $max: "$avatarId" } } }]).toArray()[0].maxAvatarId
      );
    }
  }

  {
    console.log("\n === Check unique ===");
    let field, collation;
    {
      field = "_id";
      collation = { locale: "simple" };
      console.log(`users.${field}`,
        VG2.minigame.users.find({ [field]: { $in: VG3.MergeVG.users.find({}, { [field]: 1 }).map((_) => _[field]).toArray() } }, { _id: 1 }, { collation }).toArray().length
      );

      field = "local.username";
      collation = { locale: "en", strength: 2 };
      console.log(`users.${field}`,
        VG2.minigame.users.find({ [field]: { $in: VG3.MergeVG.users.find({}, { [field]: 1 }).map((_) => _.local.username).toArray() } }, { _id: 1 }, { collation }).toArray().length
      );
      console.table(
        VG2.minigame.users.find({ [field]: { $in: VG3.MergeVG.users.find({}, { [field]: 1 }).map((_) => _.local.username).toArray() } }, {}, { collation }).map(_ => _.local).toArray()
      );



      field = "id";
      collation = { locale: "en", strength: 2 };
      console.log(`userinfos.${field}`,
        VG2.minigame.userinfos.find({ [field]: { $in: VG3.MergeVG.userinfos.find({}, { [field]: 1 }).map((_) => _[field]).toArray() } }, { _id: 1 }, { collation }).toArray().length
      );

      field = "name";
      collation = { locale: "en", strength: 2 };
      console.log(`userinfos.${field}`,
        VG2.minigame.userinfos.find({ [field]: { $in: VG3.MergeVG.userinfos.find({}, { [field]: 1 }).map((_) => _[field]).toArray() } }, { _id: 1 }, { collation }).toArray().length
      );

      field = "UID";
      collation = { locale: "simple" };
      console.log(`userinfos.${field}`,
        VG2.minigame.userinfos.find({ [field]: { $in: VG3.MergeVG.userinfos.find({}, { [field]: 1 }).map((_) => _[field]).toArray() } }, { _id: 1 }, { collation }).toArray().length
      );
    }
  }
}
