[[sn_pro, sn_pro_arc]].forEach(([dbs, dbsArc]) => {
    let okCnt = 0;
    let nullCnt = 0;

    dbs.minigame.ticket_silos.find().forEach((doc) => {
        const { _id, gameId, roundId, subRoundId, playerId } = doc;
        const { collName, roundField, subRoundField } = dbs.ops_configs.summary_configs.findOne(
            { "gameConfigs.gameId": gameId },
            {
                _id: 0,
                collName: { $concat: ["$gameConfigs.name", { $ifNull: ["$coll.bet", "$coll.round"] }] },
                roundField: { $ifNull: ["$aliases.foreign", "id"] },
                subRoundField: { $ifNull: ["$aliases.subRoundId", "$aliases.foreign", "id"] },
            }
        );

        const filter = Object.assign({ [roundField]: roundId, $expr: { $eq: [{ $toString: "$playerId" }, playerId] } }, subRoundId != null ? { [subRoundField]: subRoundId } : {});

        const docArc = dbsArc.minigame_arc.getCollection(`${collName}_bk`).findOne(filter, { _id: 1 }, { sort: { _id: 1 } });

        const docAct = dbs.minigame.getCollection(collName).findOne(filter, { _id: 1 }, { sort: { _id: 1 } });

        if (!docArc && !docAct) {
            console.log(dbs, collName, roundField, roundId, subRoundField, subRoundId, playerId, null, ++nullCnt);
            // dbs.minigame.ticket_silos.bulkWrite([{ deleteOne: { filter: { _id } } }], { ordered: true });
            return;
        }

        const origId = docArc?._id ?? docAct?._id;

        if (_id.toString() !== origId.toString()) {
            console.log("Dry run:", collName, roundId, subRoundId, playerId, _id, origId);
            try {
                console.log(
                    dbs,
                    JSON.stringify(
                        dbs.minigame.ticket_silos.bulkWrite([{ deleteOne: { filter: { _id } } }, { insertOne: { document: Object.assign(doc, { _id: origId }) } }], {
                            ordered: true,
                        })
                    )
                );
            } catch (e) {
                console.log(dbs, collName, roundId, subRoundId, playerId, e.name, e.msgerr);
            }
        } else {
            okCnt++;
        }
    });

    console.log(dbs, "OK", okCnt);
});
