/**
 * IMPORTANT: state matters, always check replica set status before running modification commands ----------> rs.status()
 */

/**
 * STEP 1: Remove KL hidden members then add back as active members
 */
{
    const _id = 401;
    const host = "10.146.34.30:34401";
    rs.remove(host);
    rs.add({ _id, host, priority: 10, votes: 1, tags: { idc: "KL" } });
}
{
    const _id = 402;
    const host = "10.146.34.26:34402";
    rs.remove(host);
    rs.add({ _id, host, priority: 10, votes: 1, tags: { idc: "KL" } });
}
{
    const _id = 403;
    const host = "10.146.34.27:34403";
    rs.remove(host);
    rs.add({ _id, host, priority: 10, votes: 1, tags: { idc: "KL" } });
}

/**
 * STEP 2: Remove AK secondary members and add back as hidden members
 * IMPORTANT: Make sure PRIMARY is 101 instance
 */
{
    const _id = 181;
    const host = "10.99.99.188:34181";
    // rs.remove(host);
    rs.add({ _id, host, priority: 0, votes: 0, hidden: true, tags: { idc: "AK" } });
}
{
    const _id = 182;
    const host = "10.99.99.188:34182";
    // rs.remove(host);
    rs.add({ _id, host, priority: 0, votes: 0, hidden: true, tags: { idc: "AK" } });
}
{
    const _id = 102;
    const host = "10.99.99.54:34102";
    // rs.remove(host);
    rs.add({ _id, host, priority: 0, votes: 0, hidden: true, tags: { idc: "AK" } });
}
{
    const _id = 103;
    const host = "10.99.99.53:34103";
    // rs.remove(host);
    rs.add({ _id, host, priority: 0, votes: 0, hidden: true, tags: { idc: "AK" } });
}

/**
 * STEP 3: Step down primary, this will make PRIMARY to be elected in KL side
 * IMPORTANT: Make sure PRIMARY is on KL side
 */
{
    rs.stepDown();
    rs.status();
}

/**
 * STEP 4: Remove previous AK PRIMARY (now SECONDARY) and add back as hidden members
 */
{
    const _id = 101;
    const host = "10.40.40.60:34101";
    // rs.remove(host);
    rs.add({ _id, host, priority: 0, votes: 0, hidden: true, tags: { idc: "AK" } });
}

/**
 * STEP 5: Validate current config and status
 */
{
    rs.status();
    rs.config();
}
