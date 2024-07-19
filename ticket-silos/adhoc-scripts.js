{
    l1_pro_arc.silo.createCollection("tickets", { storageEngine: { wiredTiger: { configString: "block_compressor=zstd" } } });
    l1_pro_arc.silo.tickets.createIndex({ gameId: 1, time: 1 });
    l1_pro_arc.silo.tickets.createIndex({ time: 1, gameId: 1 });
}
