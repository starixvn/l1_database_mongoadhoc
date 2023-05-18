deploy: {
  const dbs = l1;
  // const dbs = l2p;
  const testDB = dbs.AdjustStakeLevel;
  const realDB = dbs.minigame;
  const backupDB = dbs[`AdjustStakeLevel_${Date.now()}`];

  const currencyGroupNames = ["GrUSD", "GrTEST"]
  // const currencyGroupNames = ["Cash_INH"];

  const data = [
    [ { stake: 0.1 }, { stake: 0.1 } ],
    [ { stake: 1 }, { stake: 0.2 } ],
    [ { stake: 5 }, { stake: 1 } ],
  ];

  // const data = [
  //   [ { stake: 1, jackpot: 5_000 }, { stake: 1, jackpot: 5_000 } ],
  //   [ { stake: 10, jackpot: 50_000 }, { stake: 5, jackpot: 25_000 } ],
  //   [ { stake: 50, jackpot: 250_000 }, { stake: 10, jackpot: 50_000 } ],
  // ];

  const execDB = realDB;


  {
    console.log("=== Clone data ===");

    const srcDB = realDB;
    const execDB = backupDB;

    const clone = (coll) => {
      const tmpColl = execDB.getCollection(coll);
      console.log(coll, tmpColl.drop());
      const data = srcDB.getCollection(coll).find().toArray();
      if (data.length === 0) {
        console.log(coll, 0);
        return;
      }
      console.log(coll, tmpColl.insertMany(data).acknowledged);
      console.log(coll, tmpColl.countDocuments());
    };

    ["game_configs", "currency_groups", "currency_group_games", "jackpots"].forEach(clone);

    const gameConfigs = execDB.game_configs.find({ type: 2 }).toArray();
    gameConfigs.forEach((game) => {
      clone(`${game.name}_rounds`);
      clone(`${game.name}_freespins`);
    });
  }

  {
    console.log("=== Check freespins ===");

    const colls = execDB.game_configs.find({ type: 2 }, { _id: 0, name: 1 }).map(_ => `${_.name}_freespins`).toArray();
    const dataLengths = colls.map(coll => {
      const data = execDB.getCollection(coll).find({ available: { $ne: 0 } }).toArray();
      if (data.length > 0) {
        console.log(coll, data);
      }
      return data.length;
    });
    if (dataLengths.some(value => value !== 0)) {
      console.log("ABORT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      break deploy;
    }
    console.log("OK");
  }

  {
    console.log("=== Update stake levels ===");

    { const collName = "game_configs";
      console.log(`--- ${collName} ---`)

      const coll =  execDB.getCollection(collName);
      const filter = { type: 2 };

      console.log(coll, "before", coll.find({ ...filter }, { _id: 0, gameId: 1, name: 1, 'slotsConfig.stakeLevels': 1 }).map(EJSON.stringify).toArray());

      data.forEach(([from, to], idx) => {
        console.log(idx, from, to);

        console.log(coll, "enabled", `[ ${from.stake}]`, EJSON.stringify(coll.updateMany(
          { ...filter, [`slotsConfig.stakeLevels.${idx}.stake`]: from.stake, [`slotsConfig.stakeLevels.${idx}.jackpot`]: from.jackpot ?? 0, 'slotsConfig.jackpot.enabled': true },
          { $set: { [`slotsConfig.stakeLevels.${idx}.stake`]: to.stake, [`slotsConfig.stakeLevels.${idx}.jackpot`]: to.jackpot ?? 0 } },
        )));
        console.log(coll, "disabled", `[ ${from.stake}]`, EJSON.stringify(coll.updateMany(
          { ...filter, [`slotsConfig.stakeLevels.${idx}.stake`]: from.stake, 'slotsConfig.jackpot.enabled': false },
          { $set: { [`slotsConfig.stakeLevels.${idx}.stake`]: to.stake, [`slotsConfig.stakeLevels.${idx}.jackpot`]: 0 } },
        )));
      });

      console.log(coll, "after", coll.find({ ...filter }, { _id: 0, gameId: 1, name: 1, 'slotsConfig.stakeLevels': 1 }).map(EJSON.stringify).toArray());
    }

    { const collName = "currency_group_games";
      console.log(`--- ${collName} ---`)

      const coll =  execDB.getCollection(collName);
      const filter = {
        groupId: { $in: currencyGroupNames.map(name => execDB.currency_groups.findOne({ name }, { _id: 1 })?._id).filter(Boolean) },
        gameId: { $in: execDB.game_configs.find({ type: 2 }, { _id: 0, gameId: 1 }).map(_ => _.gameId).toArray() },
      };

      console.log(coll, "before", coll.find({ ...filter }, { _id: 0, gameId: 1, gameName: 1, groupId: 1, stakeLevels: 1 }).map(EJSON.stringify).toArray());

      data.forEach(([from, to], idx) => {
        console.log(idx, from, to);

        console.log(coll, `[ ${from.stake}]`, EJSON.stringify(coll.updateMany(
          { ...filter, [`stakeLevels.${idx}.stake`]: from.stake },
          { $set: { [`stakeLevels.${idx}.stake`]: to.stake } },
        )));
      });

      console.log(coll, "after", coll.find({ ...filter }, { _id: 0, gameId: 1, gameName: 1, groupId: 1, stakeLevels: 1 }).map(EJSON.stringify).toArray());
    }

    { const collName = "jackpots";
      console.log(`--- ${collName} ---`)

      const coll =  execDB.getCollection(collName);
      const filter = {
        gameId: { $in: execDB.game_configs.find({ type: 2 }, { _id: 0, gameId: 1 }).map(_ => _.gameId).toArray() },
        hitAt: null,
      };

      console.log(coll, "before", coll.find(
        { ...filter },
        { _id: 0, gameId: 1, gameName: 1, amount: 1, pool: 1, initAmount: 1, createdAt: 1 },
      ).map(EJSON.stringify).toArray());

      data.forEach(([from, to]) => {
        console.log(from, to);

        try {
          console.log(coll, `[ ${from.stake}]`, EJSON.stringify(coll.updateOne(
            { ...filter, pool: from.stake, initAmount: from.jackpot ?? 0 },
            { $set: { pool: to.stake } },
          )));
        } catch (e) {
          console.log(coll, "ERROR", e);
        }
      });

      console.log(coll, "after", coll.find(
        { ...filter },
        { _id: 0, gameId: 1, gameName: 1, amount: 1, pool: 1, initAmount: 1, createdAt: 1 },
      ).map(EJSON.stringify).toArray());
    }
  }
}
