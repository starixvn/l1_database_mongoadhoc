/** @type {DBs[]} */ (local).forEach((dbs) => {
    const code = "LKR";
    const db = dbs.minigame;

    const rate = {
        USD: Decimal128("0.00341"),
        VND: Decimal128("87.33471"),
    };

    const base = db.global_configs.findOne({ type: "exchange_codes", "configs.codes": code }, { _id: 0, base: 1 });

    if (!base) {
        console.log(dbs, `[${code}] has not been configured`);
        return;
    }

    const res = db.exchange_rates.updateMany({ [`code.${code}`]: null }, { $set: { [`code.${code}`]: rate[base.base] } });

    console.log(dbs, res);
});
