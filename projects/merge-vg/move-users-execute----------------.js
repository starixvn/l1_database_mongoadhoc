{
  const VG3 = l3_pro;
  const VG2 = l2_pro;

  {
    console.log("\n === Backup data ===");

    const colls = ["users", "userinfos"];
    for (const coll of colls) {
      console.log(coll, VG2.minigame.getCollection(coll).aggregate([
        { $merge: { into: { db: 'MergeVG_bk', coll: `${coll}_20230511` } } },
      ]), VG2.MergeVG_bk.getCollection(`${coll}_20230511`).countDocuments());
    }
  }

  {
    console.log("\n === Move data ===");

    const colls = ["users", "userinfos"];
    for (const coll of colls) {
      console.log(coll,
        VG2.MergeVG.getCollection(coll).drop(),
        VG2.MergeVG.getCollection(coll).insertMany(
          VG3.MergeVG.getCollection(coll).find().toArray()
        ),
        VG2.MergeVG.getCollection(coll).countDocuments(),
      );
    }
    console.log("users Indexes",
      VG2.MergeVG.userinfos.createIndex({ "local.partnerId": 1 }),
      VG2.MergeVG.userinfos.createIndex({ "local.username": 1 }),
    );
    console.log("userinfos Indexes",
      VG2.MergeVG.userinfos.createIndex({ id: 1 }),
      VG2.MergeVG.userinfos.createIndex({ name: 1 }),
      VG2.MergeVG.userinfos.createIndex({ UID: 1 }),
    );
  }

  {
    console.log("\n === Exclude invalid operatorId ===");
    console.log("userinfos", VG2.MergeVG.userinfos.deleteMany(
      { id: { $in:
        VG2.MergeVG.users.find({ "local.partnerId": { $nin: ["ONEworks_VG", "ONEworksVGCash"] } }, { _id: 1 }).map(_ => _._id.toString()).toArray()
      } }
    ));
    console.log("users", VG2.MergeVG.users.deleteMany({ "local.partnerId": { $nin: ["ONEworks_VG", "ONEworksVGCash"] } }));
  }

  {
    console.log("\n === Exclude duplicate data ===");
    let coll;
    const collation = { locale: "en", strength: 2 };

    console.log("users_dup", VG2.MergeVG.users_dup.drop());
    console.log("userinfos_dup", VG2.MergeVG.userinfos_dup.drop());

    {
      VG2.MergeVG.users.aggregate([
        { $match: { "local.username": { $in:
            VG2.minigame.users.find({}, { _id: 0, "local.username": 1 }).map(_ => _.local.username).toArray()
          } },
        },
        { $merge: "users_dup" },
      ], { collation });
      console.log("users_dup", VG2.MergeVG.users_dup.countDocuments());

      VG2.MergeVG.userinfos.aggregate([
        { $match: { id: { $in:
          VG2.MergeVG.users_dup.find({}, { _id: 1 }).map(_ => _._id.toString()).toArray()
        } } },
        { $merge: "userinfos_dup" },
      ], { collation });
      console.log("users_dup > userinfos_dup", VG2.MergeVG.userinfos_dup.countDocuments());

      console.log("users_dup",
        VG2.MergeVG.users.deleteMany({ _id: { $in:
          VG2.MergeVG.users_dup.find({}, { _id: 1 }).map(_ => _._id).toArray()
        } }),
        VG2.MergeVG.userinfos.deleteMany({ id: { $in:
          VG2.MergeVG.users_dup.find({}, { _id: 1 }).map(_ => _._id.toString()).toArray()
        } }),
      );
    }

    {
      // VG2.MergeVG.userinfos.aggregate([
      //   { $match: { UID: { $in:
      //       VG2.minigame.userinfos.find({}, { _id: 0, UID: 1 }).map(_ => _.UID).toArray()
      //     } },
      //   },
      //   { $merge: "userinfos_dup" },
      // ], { collation });
      // console.log("userinfos_dup", VG2.MergeVG.userinfos_dup.countDocuments());

      VG2.MergeVG.userinfos.aggregate([
        { $match: { name: { $in:
            VG2.minigame.userinfos.find({}, { _id: 0, name: 1 }).map(_ => _.name).toArray()
          } },
        },
        { $merge: "userinfos_dup" },
      ], { collation });
      console.log("userinfos_dup", VG2.MergeVG.userinfos_dup.countDocuments());

      VG2.MergeVG.userinfos.aggregate([
        { $match: { id: { $in:
            VG2.minigame.userinfos.find({}, { _id: 0, id: 1 }).map(_ => _.id).toArray()
          } },
        },
        { $merge: "userinfos_dup" },
      ], { collation });
      console.log("userinfos_dup", VG2.MergeVG.userinfos_dup.countDocuments());

      console.log("userinfos_dup", VG2.MergeVG.userinfos.deleteMany({ _id: { $in:
        VG2.MergeVG.userinfos_dup.find({}, { _id: 1 }).map(_ => _._id).toArray()
      } }));
    }
  }

  {
    console.log("\n === Remap UID ===");

    /** Get userinfos count */
    const usrCnt = VG2.MergeVG.userinfos.countDocuments();
    console.log("UID: count", usrCnt);

    /** Get max UID */
    const maxUID = VG2.minigame.userinfos.findOne({}, { _id: 0, UID: 1 }, { sort: { UID: -1 } }).UID;
    console.log("UID: maxUID", maxUID);

    /** Insert mock max UID + count + 100 for safety */
    const anchorUID = maxUID + usrCnt + 100;
    console.log("UID: anchorUID", anchorUID, VG2.minigame.userinfos.insertOne({ UID: anchorUID }));

    /** Generate UID for merging userinfos */
    VG2.MergeVG.userinfos.aggregate([
      { $project: { _id: 1 } },
      { $group: { _id: 0, ids: { $addToSet: "$_id" } } },
      { $unwind: { path: "$ids", includeArrayIndex: "rn" } },
      { $project: { _id: "$ids", rn: { $toInt: "$rn" }, UID: { $toInt: { $add: [ "$rn", { $literal: 1 }, { $literal: maxUID } ] } } } },
      { $out: "userinfos_UID" },
    ]);

    /** Recheck UID unique */
    const dupUID = VG2.minigame.userinfos.find({ UID: { $in:
      VG2.MergeVG.userinfos_UID.find({}, { _id: 0, UID: 1 }).map(_ => _.UID).toArray()
    } }, { _id: 0, UID: 1 }).map(_ => _.UID).toArray();
    console.log("UID: check unique", dupUID);

    if (!dupUID.length) {
      VG2.MergeVG.userinfos_UID.aggregate([
        { $project: { _id: 1, UID: 1 } },
        { $merge: "userinfos" },
      ]);
    }
  }

  {
    console.log("\n === Merge data ===");

    const colls = ["users", "userinfos"];
    for (const coll of colls) {
      try {
        console.log(coll,
          VG2.MergeVG.getCollection(coll).aggregate([
            { $merge: { into: { db: "minigame", coll } } }
          ], {ordered: false})
        );
      } catch (e) {
        console.log(coll, e);
      }
    }
  }
}
