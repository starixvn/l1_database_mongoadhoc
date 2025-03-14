{
    const fileName = "20250314-exchange_silos.json";
    // const data = JSON.parse(fs.readFileSync(`D:/Temp/${fileName}`).toString().trim());
    const data = JSON.parse(fs.readFileSync(`C:/Users/vn-billy.bui/Documents/SQL Server Management Studio/${fileName}`).toString().trim());
    data.forEach((_) => {
        _.time = new Date(_.time + "Z");
        _._id = ObjectId((_.time / 1000).toString(16) + Buffer.from(_.code).toString("hex") + "0000000000");
    });

    global.data = data;

    global.data.length;
}

pro.forEach((dbs) => {
    const db = dbs.minigame;

    let maxDate = new Date(0);
    data.forEach(({ time }) => {
        maxDate = time > maxDate ? time : maxDate;
    });

    console.log(dbs, `maxDate = ${maxDate.toISOString()}`);
    console.log(dbs, db.exchange_silos.deleteMany({ time: { $lte: maxDate } }));

    const { acknowledged, insertedIds } = db.exchange_silos.insertMany(data);
    console.log(dbs, { acknowledged, insertedCount: Object.keys(insertedIds).length });
});
