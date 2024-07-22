{
    const dbs = l1_pro;

    let data = [];
    dbs.cleanupUsers
        .getCollection("removeUsers.noActivity.y2023")
        .find()
        .forEach(({ _id }) => {
            data.push(_id);

            if (data.length === 10_000) {
                try {
                    dbs.minigame.users.aggregate([
                        { $match: { _id: { $in: data } } },
                        {
                            $merge: {
                                into: { db: "minigame_rm", coll: "users_rm" },
                            },
                        },
                    ]);

                    const cnt = dbs.minigame.users.countDocuments({ _id: { $in: data } });
                    const cntRm = dbs.minigame_rm.users_rm.countDocuments({ _id: { $in: data } });

                    console.log(cnt, cntRm, cnt === cntRm);
                    console.log(dbs.minigame.users.deleteMany({ _id: { $in: data } }));
                } catch (err) {
                    console.log(err);
                } finally {
                    data = [];
                }
            }
        });

    try {
        dbs.minigame.users.aggregate([
            { $match: { _id: { $in: data } } },
            {
                $merge: {
                    into: { db: "minigame_rm", coll: "users_rm" },
                },
            },
        ]);

        const cnt = dbs.minigame.users.countDocuments({ _id: { $in: data } });
        const cntRm = dbs.minigame_rm.users_rm.countDocuments({ _id: { $in: data } });

        console.log(cnt, cntRm, cnt === cntRm);
        console.log(dbs.minigame.users.deleteMany({ _id: { $in: data } }));
    } catch (err) {
        console.log(err);
    } finally {
        data = [];
    }
}
