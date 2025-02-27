{
    const data = JSON.parse(fs.readFileSync("C:/Users/vn-billy.bui/Documents/SQL Server Management Studio/JSON_F52E2B61-18A1-11d1-B105-00805F49916B1.json").toString().trim());
    data.forEach((_) => {
        _.time = new Date(_.time + "Z");
        _._id = ObjectId((_.time / 1000).toString(16) + Buffer.from(_.code).toString("hex") + "0000000000");
    });
    
    global.data = data;
}
