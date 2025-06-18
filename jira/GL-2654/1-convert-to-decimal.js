// [l1, l1p, l1pp, l1ppp, l2, l2p, l2pp, l4, l4p].forEach((dbs) => {
// [l1_sit, l2_sit, l4_sit].forEach((dbs) => {
// [l1_uat, l2_uat, l4_uat].forEach((dbs) => {
// [l1_pro].forEach((dbs) => {
// [l2_pro].forEach((dbs) => {
[l4_pro].forEach((dbs) => {
    [
        dbs.minigame.ticket_silos, // -
        dbs.summary.round_summaries,
        dbs.summary.hourly_summaries,
        dbs.summary.daily_summaries,
        dbs.summary.hourly_statements,
        dbs.summary.daily_statements,
    ].forEach((coll) => {
        console.log(ISODate().toISOString(), dbs, "Update", coll);

        const res = coll.updateMany({}, [
            {
                $set: {
                    stake: { $toDecimal: { $round: ["$stake", 4] } },
                    payout: { $toDecimal: { $round: ["$payout", 4] } },
                    winloss: { $toDecimal: { $round: ["$winloss", 4] } },
                    refund: { $toDecimal: { $round: ["$refund", 4] } },
                    win: { $toDecimal: { $round: ["$win", 4] } },
                    loss: { $toDecimal: { $round: ["$loss", 4] } },

                    "USD.stake": { $toDecimal: { $round: ["$USD.stake", 4] } },
                    "USD.payout": { $toDecimal: { $round: ["$USD.payout", 4] } },
                    "USD.winloss": { $toDecimal: { $round: ["$USD.winloss", 4] } },
                    "USD.refund": { $toDecimal: { $round: ["$USD.refund", 4] } },
                    "USD.win": { $toDecimal: { $round: ["$USD.win", 4] } },
                    "USD.loss": { $toDecimal: { $round: ["$USD.loss", 4] } },

                    "VND.stake": { $toDecimal: { $round: ["$VND.stake", 4] } },
                    "VND.payout": { $toDecimal: { $round: ["$VND.payout", 4] } },
                    "VND.winloss": { $toDecimal: { $round: ["$VND.winloss", 4] } },
                    "VND.refund": { $toDecimal: { $round: ["$VND.refund", 4] } },
                    "VND.win": { $toDecimal: { $round: ["$VND.win", 4] } },
                    "VND.loss": { $toDecimal: { $round: ["$VND.loss", 4] } },
                },
            },
        ]);
        console.log(ISODate().toISOString(), dbs, "Update", coll, ": ", res);
    });
});

// [l5].forEach((dbs) => {
// [l5_sit].forEach((dbs) => {
// [l5_uat].forEach((dbs) => {
[l5_pro].forEach((dbs) => {
    [
        dbs.hotdog_minigame.ticket_silos,
        dbs.hotdog_summary.round_summaries,
        dbs.hotdog_summary.hourly_summaries,
        dbs.hotdog_summary.daily_summaries,
        dbs.hotdog_summary.hourly_statements,
        dbs.hotdog_summary.daily_statements,
    ].forEach((coll) => {
        console.log(ISODate().toISOString(), dbs, "Update", coll.collectionName);

        const res = coll.updateMany({}, [
            {
                $set: {
                    stake: { $toDecimal: { $round: ["$stake", 4] } },
                    payout: { $toDecimal: { $round: ["$payout", 4] } },
                    winloss: { $toDecimal: { $round: ["$winloss", 4] } },
                    refund: { $toDecimal: { $round: ["$refund", 4] } },
                    win: { $toDecimal: { $round: ["$win", 4] } },
                    loss: { $toDecimal: { $round: ["$loss", 4] } },

                    "USD.stake": { $toDecimal: { $round: ["$USD.stake", 4] } },
                    "USD.payout": { $toDecimal: { $round: ["$USD.payout", 4] } },
                    "USD.winloss": { $toDecimal: { $round: ["$USD.winloss", 4] } },
                    "USD.refund": { $toDecimal: { $round: ["$USD.refund", 4] } },
                    "USD.win": { $toDecimal: { $round: ["$USD.win", 4] } },
                    "USD.loss": { $toDecimal: { $round: ["$USD.loss", 4] } },

                    "VND.stake": { $toDecimal: { $round: ["$VND.stake", 4] } },
                    "VND.payout": { $toDecimal: { $round: ["$VND.payout", 4] } },
                    "VND.winloss": { $toDecimal: { $round: ["$VND.winloss", 4] } },
                    "VND.refund": { $toDecimal: { $round: ["$VND.refund", 4] } },
                    "VND.win": { $toDecimal: { $round: ["$VND.win", 4] } },
                    "VND.loss": { $toDecimal: { $round: ["$VND.loss", 4] } },
                },
            },
        ]);
        console.log(ISODate().toISOString(), dbs, "Update", coll.collectionName, ": ", res);
    });
});
