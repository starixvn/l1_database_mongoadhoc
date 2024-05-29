{
    const dbs = l1_pro;

    let data = [];
    dbs.cleanupUsers
        .getCollection("removeUserInfos.noActivity.y2023")
        .find()
        .forEach(({ _id }) => {
            data.push(_id);

            if (data.length === 10_000) {
                try {
                    dbs.minigame.userinfos.aggregate([
                        { $match: { _id: { $in: data } } },
                        {
                            $merge: {
                                into: { db: "minigame_rm", coll: "userinfos_rm" },
                            },
                        },
                    ]);

                    const cnt = dbs.minigame.userinfos.countDocuments({ _id: { $in: data } });
                    const cntRm = dbs.minigame_rm.userinfos_rm.countDocuments({ _id: { $in: data } });

                    console.log(cnt, cntRm, cnt === cntRm);
                    console.log(dbs.minigame.userinfos.deleteMany({ _id: { $in: data } }));
                } catch (err) {
                    console.log(err);
                } finally {
                    data = [];
                }
            }
        });

    try {
        dbs.minigame.userinfos.aggregate([
            { $match: { _id: { $in: data } } },
            {
                $merge: {
                    into: { db: "minigame_rm", coll: "userinfos_rm" },
                },
            },
        ]);

        const cnt = dbs.minigame.userinfos.countDocuments({ _id: { $in: data } });
        const cntRm = dbs.minigame_rm.userinfos_rm.countDocuments({ _id: { $in: data } });

        console.log(cnt, cntRm, cnt === cntRm);
        console.log(dbs.minigame.userinfos.deleteMany({ _id: { $in: data } }));
    } catch (err) {
        console.log(err);
    } finally {
        data = [];
    }
}
