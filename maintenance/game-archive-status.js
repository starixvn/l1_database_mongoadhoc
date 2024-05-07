{
    const actDBs = l1_sit;
    const arcDBs = l1_sit_arc;

    const configs = actDBs.ops_configs.archive_configs.find({ id: 0 }, { _id: 0 });

    const data = [
        {
            name:"",
            ["arc=max"]: "",
            ["min=1st"]: "",
            arcId: "",
            maxId: "",
            minId: "",
            firstId: "",
            lastId: "",
            arcTime: "",
            maxTime: "",
            minTime: "",
            firstTime: "",
            lastTime: "",
        },
    ];
    for (const archiveConfig of configs) {
        const { gameConfigs, from, to, childs = [], alias, config = {} } = archiveConfig;
        const { name } = gameConfigs;
        const { time } = alias;
        const { localField = "_" } = config;

        const roundActColl = actDBs[from.db].getCollection(`${name}${from.postfix}`);
        const roundArcColl = arcDBs[to.db].getCollection(`${name}${to.postfix}`);

        const projection = { _id: 0, time: `$${time}`, id: `$${localField}` };

        const maxCopiedArcDoc = roundArcColl.findOne({}, projection, { sort: { _id: -1 } }) ?? {};
        const maxCopiedActDoc = roundActColl.findOne({ "__archive.eventtime": { $exists: true } }, projection, { sort: { _id: -1 } }) ?? {};
        const minCopiedActDoc = roundActColl.findOne({ "__archive.eventtime": { $exists: true } }, projection, { sort: { _id: 1 } }) ?? {};

        const maxActDoc = roundActColl.findOne({}, projection, { sort: { _id: -1 } }) ?? {};
        const minActDoc = roundActColl.findOne({}, projection, { sort: { _id: 1 } }) ?? {};

        const doc = { name: `${name}${from.postfix}` };

        maxCopiedArcDoc.id != null && (doc.arcId = maxCopiedArcDoc.id);
        maxCopiedActDoc.id != null && (doc.maxId = maxCopiedActDoc.id);
        minCopiedActDoc.id != null && (doc.minId = minCopiedActDoc.id);
        minActDoc.id != null && (doc.firstId = minActDoc.id);
        maxActDoc.id != null && (doc.lastId = maxActDoc.id);

        maxCopiedArcDoc.time != null && (doc.arcTime = new Date(maxCopiedArcDoc.time));
        maxCopiedActDoc.time != null && (doc.maxTime = new Date(maxCopiedActDoc.time));
        minCopiedActDoc.time != null && (doc.minTime = new Date(minCopiedActDoc.time));
        minActDoc.time != null && (doc.firstTime = new Date(minActDoc.time));
        maxActDoc.time != null && (doc.lastTime = new Date(maxActDoc.time));

        doc.arcId != null && doc.maxId != null && (doc["arc=max"] = doc.arcId === doc.maxId);
        doc.arcTime != null && doc.maxTime != null && (doc["arc=max"] = (doc["arc=max"] ?? true) && doc.arcTime.valueOf() === doc.maxTime.valueOf());

        doc.minId != null && doc.firstId != null && (doc["min=1st"] = doc.minId === doc.firstId);
        doc.minTime != null && doc.firstTime != null && (doc["min=1st"] = (doc["min=1st"] ?? true) && doc.minTime.valueOf() === doc.firstTime.valueOf());

        data.push(doc);

        for (const child of childs) {
            const { from, to, config } = child;
            const { foreignField } = config;

            const roundActColl = actDBs[from.db].getCollection(`${name}${from.postfix}`);
            const roundArcColl = arcDBs[to.db].getCollection(`${name}${to.postfix}`);

            const projection = { _id: 0, time: `$${time}`, id: `$${foreignField}` };

            const maxCopiedArcDoc = roundArcColl.findOne({}, projection, { sort: { _id: -1 } }) ?? {};
            const maxCopiedActDoc = roundActColl.findOne({ "__archive.eventtime": { $exists: true } }, projection, { sort: { _id: -1 } }) ?? {};
            const minCopiedActDoc = roundActColl.findOne({ "__archive.eventtime": { $exists: true } }, projection, { sort: { _id: 1 } }) ?? {};

            const maxActDoc = roundActColl.findOne({}, projection, { sort: { _id: -1 } }) ?? {};
            const minActDoc = roundActColl.findOne({}, projection, { sort: { _id: 1 } }) ?? {};

            const doc = { name: `${name}${from.postfix}` };

            maxCopiedArcDoc.id != null && (doc.arcId = maxCopiedArcDoc.id);
            maxCopiedActDoc.id != null && (doc.maxId = maxCopiedActDoc.id);
            minCopiedActDoc.id != null && (doc.minId = minCopiedActDoc.id);
            minActDoc.id != null && (doc.firstId = minActDoc.id);
            maxActDoc.id != null && (doc.lastId = maxActDoc.id);

            maxCopiedArcDoc.time != null && (doc.arcTime = new Date(maxCopiedArcDoc.time));
            maxCopiedActDoc.time != null && (doc.maxTime = new Date(maxCopiedActDoc.time));
            minCopiedActDoc.time != null && (doc.minTime = new Date(minCopiedActDoc.time));
            minActDoc.time != null && (doc.firstTime = new Date(minActDoc.time));
            maxActDoc.time != null && (doc.lastTime = new Date(maxActDoc.time));

            doc.arcId != null && doc.maxId != null && (doc["arc=max"] = doc.arcId === doc.maxId);
            doc.arcTime != null && doc.maxTime != null && (doc["arc=max"] = (doc["arc=max"] ?? true) && doc.arcTime.valueOf() === doc.maxTime.valueOf());

            doc.minId != null && doc.firstId != null && (doc["min=1st"] = doc.minId === doc.firstId);
            doc.minTime != null && doc.firstTime != null && (doc["min=1st"] = (doc["min=1st"] ?? true) && doc.minTime.valueOf() === doc.firstTime.valueOf());

            data.push(doc);
        }
    }

    console.table(data);
}
