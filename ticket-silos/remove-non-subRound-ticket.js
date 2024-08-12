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
