{
  const VG3 = l3c;
  const VG2 = l2p;

  {
    console.log("\n === Backup data ===");

    const colls = ["users", "userinfos"];
    for (const coll of colls) {
      console.log(coll, VG2.minigame.getCollection(coll).aggregate([
        { $merge: { into: { db: 'MergeVG_bk', coll } } },
      ]), VG2.MergeVG_bk.getCollection(coll).countDocuments());
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
  }

  {
    console.log("\n === Exclude duplicate data ===");
    let coll;
    const collation = { locale: "en", strength: 2 };

    {
      coll = "users";
      console.log(coll, VG2.MergeVG.getCollection(`${coll}_dup`).drop());

      VG2.MergeVG.getCollection(coll).aggregate([
        { $match: { "local.username": { $in:
            VG2.minigame.getCollection(coll).find({}, { _id: 0, "local.username": 1 }).map(_ => _.local.username).toArray()
          } },
        },
        { $merge: `${coll}_dup` },
      ], { collation });
      console.log(coll, VG2.MergeVG.getCollection(`${coll}_dup`).countDocuments());

      console.log(coll, VG2.MergeVG.getCollection(coll).deleteMany({ _id: { $in:
        VG2.MergeVG.getCollection(`${coll}_dup`).find({}, { _id: 1 }).map(_ => _._id).toArray()
      } }));
    }

    {
      coll = "userinfos";
      console.log(coll, VG2.MergeVG.getCollection(`${coll}_dup`).drop());

      VG2.MergeVG.getCollection(coll).aggregate([
        { $match: { UID: { $in:
            VG2.minigame.getCollection(coll).find({}, { _id: 0, UID: 1 }).map(_ => _.UID).toArray()
          } },
        },
        { $merge: `${coll}_dup` },
      ], { collation });
      console.log(coll, VG2.MergeVG.getCollection(`${coll}_dup`).countDocuments());

      VG2.MergeVG.getCollection(coll).aggregate([
        { $match: { name: { $in:
            VG2.minigame.getCollection(coll).find({}, { _id: 0, name: 1 }).map(_ => _.name).toArray()
          } },
        },
        { $merge: `${coll}_dup` },
      ], { collation });
      console.log(coll, VG2.MergeVG.getCollection(`${coll}_dup`).countDocuments());

      VG2.MergeVG.getCollection(coll).aggregate([
        { $match: { id: { $in:
            VG2.minigame.getCollection(coll).find({}, { _id: 0, id: 1 }).map(_ => _.id).toArray()
          } },
        },
        { $merge: `${coll}_dup` },
      ], { collation });
      console.log(coll, VG2.MergeVG.getCollection(`${coll}_dup`).countDocuments());

      console.log(coll, VG2.MergeVG.getCollection(coll).deleteMany({ _id: { $in:
        VG2.MergeVG.getCollection(`${coll}_dup`).find({}, { _id: 1 }).map(_ => _._id).toArray()
      } }));
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
