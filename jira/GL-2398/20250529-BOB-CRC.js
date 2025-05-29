/** @type {DBs[]} */ (uat).forEach((dbs) => {
    const code = "BOB";
    const db = dbs.minigame;

    const rate = {
        USD: Decimal128("0.14849"),
        VND: Decimal128("3855.84216"),
    };

    const base = db.global_configs.findOne({ type: "exchange_codes", "configs.codes": code }, { _id: 0, base: 1 });

    if (!base) {
        console.log(dbs, `[${code}] has not been configured`);
        return;
    }

    {
        const res = db.exchange_rates.updateMany({ [`code.${code}`]: null }, { $set: { [`code.${code}`]: rate[base.base] } });
        console.log(dbs, `Update ${code} rate`, res);
    }

    {
        const res = db.game_configs.updateMany({}, { $set: { exchangeReload: true } });
        console.log(dbs, "Reload exchange", res);
    }
});

/** @type {DBs[]} */ (uat).forEach((dbs) => {
    const code = "CRC";
    const db = dbs.minigame;

    const rate = {
        USD: Decimal128("0.00199"),
        VND: Decimal128("51.74093"),
    };

    const base = db.global_configs.findOne({ type: "exchange_codes", "configs.codes": code }, { _id: 0, base: 1 });

    if (!base) {
        console.log(dbs, `[${code}] has not been configured`);
        return;
    }

    {
        const res = db.exchange_rates.updateMany({ [`code.${code}`]: null }, { $set: { [`code.${code}`]: rate[base.base] } });
        console.log(dbs, `Update ${code} rate`, res);
    }

    {
        const res = db.game_configs.updateMany({}, { $set: { exchangeReload: true } });
        console.log(dbs, "Reload exchange", res);
    }
});
