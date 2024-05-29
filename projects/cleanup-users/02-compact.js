{
    const pass = passwordPrompt();
    ["10.99.99.53:27102", "10.40.40.60:27103", "10.99.99.188:27112", "10.40.40.60:37102", "10.99.99.54:37103", "10.99.99.188:37112"].forEach((server) => {
        const db = connect(`mongodb://billy.bui:${encodeURIComponent(pass)}@${server}/admin`).getSiblingDB("minigame");

        console.log(db.runCommand({ compact: "users" }));
        console.log(db.runCommand({ compact: "userinfos" }));
    });
}
