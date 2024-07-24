/** STOP SERVICE */

/** Backup summaries data */
[l1ppp].forEach((dbs) => {
    try {
        dbs.minigame.ticket_silos.aggregate([{ $match: { time: { $gte: ISODate("2024-07-15") } } }, { $merge: { into: { db: "minigame_backup", coll: "bk_ticket_silos" } } }]);
    } catch (e) {
        console.log(dbs, "ticket_silos", e.name, e.errmsg);
    }

    ["daily_summaries", "hourly_summaries", "daily_statements", "hourly_statements", "round_summaries"].forEach((coll) => {
        try {
            dbs.summary.getCollection(coll).aggregate([{ $match: { time: { $gte: ISODate("2024-07-15") } } }, { $merge: { into: { db: "summary_backup", coll: `bk_${coll}` } } }]);
        } catch (e) {
            console.log(dbs, coll, e.name, e.errmsg);
        }
    });

    try {
        const bulkWrite = dbs.minigame_backup.bk_ticket_silos
            .find({}, { _id: 1 })
            .map(({ _id }) => ({ deleteOne: { filter: { _id } } }))
            .toArray();

        const res = dbs.minigame.ticket_silos.bulkWrite(bulkWrite, { ordered: false });
        console.log(dbs, "ticket_silos", JSON.stringify(res));
    } catch (e) {
        console.log(dbs, "ticket_silos", e.name, e.errmsg);
    }

    ["daily_summaries", "hourly_summaries", "daily_statements", "hourly_statements", "round_summaries"].forEach((coll) => {
        try {
            const bulkWrite = dbs.summary_backup
                .getCollection(`bk_${coll}`)
                .find({}, { _id: 1 })
                .map(({ _id }) => ({ deleteOne: { filter: { _id } } }))
                .toArray();

            const res = dbs.summary.getCollection(coll).bulkWrite(bulkWrite, { ordered: false });
            console.log(dbs, coll, JSON.stringify(res));
        } catch (e) {
            console.log(dbs, coll, e.name, e.errmsg);
        }
    });
});

/** DEPLOY INDEX */

/** DEPLOY SERVICE */

/** Re-summarize data */
[l1ppp].forEach((dbs) => {
    {
        const res = dbs.minigame.ticket_silos.deleteMany({ time: { $gte: ISODate("2024-07-15") } });
        console.log(dbs, "ticket_silos", JSON.stringify(res));
    }

    dbs.minigame
        .getCollectionNames()
        .sort()
        .forEach((coll) => {
            try {
                const res = dbs.minigame.getCollection(coll).updateMany({ "__archive.summarized": true }, { $unset: { "__archive.summarized": 1 } });

                console.log(dbs, coll, res.modifiedCount, JSON.stringify(res));
            } catch (e) {
                console.log(dbs, coll, e.name, e.errmsg);
            }
        });
});

/** Check silo */
[l1ppp].forEach((dbs) => {
    dbs.minigame_backup.bk_ticket_silos.find().forEach((backup) => {
        const { gameId, roundId, operatorId, playerId } = backup;
        const docs = dbs.minigame.ticket_silos.find({ gameId, roundId, operatorId, playerId }).toArray();

        if (!docs.length) {
            console.log("OLD ONLY", JSON.stringify(backup));
            console.log("OLD ONLY", JSON.stringify(dbs.minigame.ticket_silos.insertOne(backup)));
            return;
        }

        const { tickets, stake, payout, winloss, refund } = backup;

        const ok = [tickets === docs[0].tickets, stake === docs[0].stake, payout === docs[0].payout, winloss === docs[0].winloss, refund === docs[0].refund];

        if (!ok.every(Boolean)) {
            console.log(gameId, roundId, operatorId, playerId, ok);
            console.log("OLD", JSON.stringify(backup));
            docs.forEach((doc) => console.log("NEW", JSON.stringify(doc)));
        }
    });
});

/** Reset silo */
[l1ppp].forEach((dbs) => {
    const res = dbs.minigame.ticket_silos.updateMany({}, { $unset: { __archive: 1 } });
    console.log(JSON.stringify(res));
});

/** Check data */
[l1ppp].forEach((dbs) => {
    const coll = "round_summaries";
    dbs.summary_backup
        .getCollection(`bk_${coll}`)
        .find()
        .forEach((backup) => {
            const { gameId, roundId, operatorId, siteId, currency } = backup;
            const doc = dbs.summary.getCollection(coll).findOne({ gameId, roundId, operatorId, siteId, currency });

            if (!doc) {
                console.log("OLD ONLY", JSON.stringify(backup));
                return;
            }

            const { tickets, stake, payout, winloss, refund, players } = backup;

            const ok = [tickets === doc.tickets, stake === doc.stake, payout === doc.payout, winloss === doc.winloss, refund === doc.refund, players === doc.players];

            if (!ok.every(Boolean)) {
                console.log(gameId, roundId, operatorId, siteId, currency, ok);
                console.log("OLD", JSON.stringify(backup));
                console.log("NEW", JSON.stringify(doc));
            }
        });
});

/** Check data */
[l1ppp].forEach((dbs) => {
    // const coll = "daily_summaries";
    const coll = "hourly_summaries";
    dbs.summary_backup
        .getCollection(`bk_${coll}`)
        .find()
        .forEach((backup) => {
            const { gameId, time, operatorId, siteId, currency } = backup;
            const doc = dbs.summary.getCollection(coll).findOne({ gameId, time, operatorId, siteId, currency });

            if (!doc) {
                console.log("OLD ONLY", JSON.stringify(backup));
                return;
            }

            const { tickets, stake, payout, winloss, refund, players } = backup;

            const ok = [tickets === doc.tickets, stake === doc.stake, payout === doc.payout, winloss === doc.winloss, refund === doc.refund, players === doc.players];

            if (!ok.every(Boolean)) {
                console.log(gameId, time, operatorId, siteId, currency, ok);
                console.log("OLD", JSON.stringify(backup));
                console.log("NEW", JSON.stringify(doc));
            }
        });
});

/** Check data */
[l1ppp].forEach((dbs) => {
    const coll = "hourly_statements";
    dbs.summary_backup
        .getCollection(`bk_${coll}`)
        .find()
        .forEach((backup) => {
            const { gameId, time, operatorId, siteId, playerId } = backup;
            const doc = dbs.summary.getCollection(coll).findOne({ gameId, time, operatorId, siteId, playerId });

            if (!doc) {
                console.log("OLD ONLY", JSON.stringify(backup));
                return;
            }

            const { tickets, stake, payout, winloss, refund, players } = backup;

            const ok = [tickets === doc.tickets, stake === doc.stake, payout === doc.payout, winloss === doc.winloss, refund === doc.refund, players === doc.players];

            if (!ok.every(Boolean)) {
                console.log(gameId, time, operatorId, siteId, playerId, ok);
                console.log("OLD", JSON.stringify(backup));
                console.log("NEW", JSON.stringify(doc));
            }
        });
});
