[l1].forEach((dbs) => {
    const bulkWrite = [];
    dbs.minigame.ticket_silos
        .find({ subRoundId: { $ne: null } }, { _id: 0, gameId: 1, roundId: 1, subRoundId: 1, operatorId: 1, playerId: 1 })
        .forEach(({ gameId, roundId, subRoundId, operatorId, playerId }) => {
            bulkWrite.push({
                deleteOne: {
                    filter: { gameId, roundId, subRoundId: null, operatorId, playerId },
                },
            });
            bulkWrite.push({
                updateOne: {
                    filter: { gameId, roundId, subRoundId, operatorId, playerId },
                    update: { $unset: { __archive: 1 } },
                },
            });
        });

    const res = dbs.minigame.ticket_silos.bulkWrite(bulkWrite, { ordered: false });
    console.log(res);
});

[l1].forEach((dbs) => {
    dbs.minigame.ticket_silos.aggregate([
        { $match: { subRoundId: { $ne: null } } },
        {
            $merge: {
                into: { db: "minigame_rm", coll: "ticket_silos_backup" },
            },
        },
    ]);
    const bulkWrite = dbs.minigame_rm.ticket_silos_backup
        .find({}, { _id: 1 })
        .map((_) => ({ deleteOne: { filter: { _id: _._id } } }))
        .toArray();
    const res = dbs.minigame.ticket_silos.bulkWrite(bulkWrite, { ordered: false });
    console.log(res);
});

// TODO: verify ticket_silos_backup data
l1.minigame_rm.ticket_silos_backup.find().forEach((doc) => {
    const { gameId, roundId, subRoundId, operatorId, playerId } = doc;
    const newDoc = l1.minigame.ticket_silos.findOne({ gameId, roundId, subRoundId, operatorId, playerId });

    if (!newDoc) {
        console.log(gameId, roundId, subRoundId, operatorId, playerId, null, ++cnt);
        return;
    }

    const ok = [
        doc.tickets === newDoc.tickets,
        doc.stake === newDoc.stake,
        doc.payout === newDoc.payout,
        doc.winloss === newDoc.winloss,
        doc.refund === newDoc.refund,
        doc.win === newDoc.win,
        doc.loss === newDoc.loss,
    ];

    if (!ok.every((_) => _)) {
        console.log(gameId, roundId, subRoundId, operatorId, playerId, ok);
    }
});
