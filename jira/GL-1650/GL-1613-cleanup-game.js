{
    const dbs = l2_sit;

    const gameIds = [100770, 100771, 100772, 100773, 100880, 100881, 100882, 100883];

    dbs.minigame.game_configs.find({ gameId: { $in: gameIds } }, { _id: 1, gameId: 1, name: 1 }).forEach(({ _id, gameId, name }) => {
        console.log(dbs, gameId, name);
        console.log(dbs, gameId, name, "currency_group_games", dbs.minigame.currency_group_games.countDocuments({ gameId }));
        console.log(dbs, gameId, name, "archive_configs", dbs.ops_configs.archive_configs.countDocuments({ "gameConfigs.gameId": gameId }));
        console.log(dbs, gameId, name, "summary_configs", dbs.ops_configs.summary_configs.countDocuments({ "gameConfigs.gameId": gameId }));
        
        console.log(dbs, gameId, name, "game_configs", dbs.minigame.game_configs.deleteOne({ _id }));
        console.log(dbs, gameId, name, "currency_group_games", dbs.minigame.currency_group_games.deleteMany({ gameId }));
        console.log(dbs, gameId, name, "archive_configs", dbs.ops_configs.archive_configs.deleteMany({ "gameConfigs.gameId": gameId }));
        console.log(dbs, gameId, name, "summary_configs", dbs.ops_configs.summary_configs.deleteMany({ "gameConfigs.gameId": gameId }));
    })
}