
// [l1_sit_arc, l2_sit_arc, l4_sit_arc].forEach((dbs) => {
// [l1_uat_arc, l2_uat_arc, l4_uat_arc].forEach((dbs) => {
[l1_pro_arc, l2_pro_arc, l4_pro_arc].forEach((dbs) => {
    [
        dbs.minigame_arc.ticket_silos_bk, // -
        dbs.summary_arc.round_summaries_bk,
        dbs.summary_arc.hourly_summaries_bk,
        dbs.summary_arc.daily_summaries_bk,
        dbs.summary_arc.hourly_statements_bk,
        dbs.summary_arc.daily_statements_bk,
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

// [l5_sit_arc].forEach((dbs) => {
// [l5_uat_arc].forEach((dbs) => {
[l5_pro_arc].forEach((dbs) => {
    [
        dbs.hotdog_minigame_arc.ticket_silos_bk,
        dbs.hotdog_summary_arc.round_summaries_bk,
        dbs.hotdog_summary_arc.hourly_summaries_bk,
        dbs.hotdog_summary_arc.daily_summaries_bk,
        dbs.hotdog_summary_arc.hourly_statements_bk,
        dbs.hotdog_summary_arc.daily_statements_bk,
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
