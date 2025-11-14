(async () => {
    const data = [
        { before: "NOVA88_SLOT_WELCOME_88_FREE_SPINS", after: "WELCOME88FS" }, // -
        { before: "NOVA88_SLOT_WELCOME_50_FREE_SPIN", after: "WELCOME50FS" },
        { before: "NOVA88_SLOT_WELCOME_20_FREE_SPIN", after: "WELCOME20FS" },
    ];

    const dbs = l2_pro;

    data.forEach(({ before, after }) => {
        const data = dbs.minigame.game_promotions.findOne({ code: before });

        console.log(data._id, data.code);
        console.log(dbs.minigame_rm.game_promotions_rm.insertOne({ backupId: "GL-6215", data }));
        console.log(dbs.minigame.game_promotions.updateOne({ _id: data._id }, { $set: { code: after } }));

        console.log(dbs.minigame.game_promotions.findOne({ _id: data._id }));
    });
})();
