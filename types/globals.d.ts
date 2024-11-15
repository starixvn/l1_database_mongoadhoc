/* eslint-disable no-var */
import * as ldbMongo from "@ldb/mongo";
import * as serviceProviderCore from "@mongosh/service-provider-core";
import * as shellApi from "@mongosh/shell-api";
import * as biColumnType from "../modules/bi/data-types.cjs";

type DBs = Record<string, Database>;

/** Re-export */
declare global {
    var path: typeof import("node:path");
    var util: typeof import("util");

    var [local, sit, sit_arc, uat, uat_arc, pro, pro_arc]: DBs[][];
    var [l1, l1p, l1pp, l1ppp, l2, l2p, l2pp, l4]: DBs[];
    var [l1_sit, l1_uat, l1_pro, l2_sit, l2_uat, l2_pro, sn_sit, sn_uat, sn_pro]: DBs[];
    var [l1_sit_arc, l1_uat_arc, l1_pro_arc, l2_sit_arc, l2_uat_arc, l2_pro_arc, sn_sit_arc, sn_uat_arc, sn_pro_arc]: DBs[];

    var _auth: number;
    var auth: (db: DBs | Database) => void;

    var db: shellApi.Database;
    var rs: shellApi.ReplicaSet;
    var load: shellApi.ShellApi["load"];
    var loadScript: shellApi.ShellApi["load"];
    var loadFolder: shellApi.ShellApi["load"];
    var passwordPrompt: shellApi.ShellApi["passwordPrompt"];

    // https://github.com/mongodb-js/mongosh/blob/6e71cb1ca0cca895c8dd075847fa555802d4139b/packages/shell-api/src/shell-bson.ts#L168
    var DBRef: (namespace: string, oid: unknown, db?: string, fields?: ldbMongo.Document) => typeof ldbMongo.DBRef.prototype;
    var bsonsize: (object: unknown) => number;
    var MaxKey: () => ldbMongo.MaxKey.prototype;
    var MinKey: () => ldbMongo.MinKey.prototype;
    var ObjectId: (id?: string | number | ldbMongo.ObjectId | Buffer) => ldbMongo.ObjectId;
    var Timestamp: (t?: number | typeof ldbMongo.Long | { t: number; i: number }, i?: number) => ldbMongo.Timestamp.prototype;
    var Code: (c?: string | ((...args: unknown[]) => unknown), s?: unknown) => ldbMongo.Code.prototype;
    var NumberDecimal: (s?: string) => ldbMongo.Decimal128.prototype;
    var NumberInt: (v?: string) => ldbMongo.Int32.prototype;
    var NumberLong: (s?: string | number) => ldbMongo.Long.prototype;
    var ISODate: (input?: string) => Date;
    var BinData: (subtype: number, b64string: string) => ldbMongo.Binary;
    var HexData: (subtype: number, hexstr: string) => ldbMongo.Binary;
    var UUID: (hexstr?: string) => ldbMongo.Binary;
    var MD5: (hexstr: string) => ldbMongo.Binary;
    var Decimal128: typeof ldbMongo.Decimal128;
    var BSONSymbol: typeof ldbMongo.BSONSymbol;
    var Int32: typeof ldbMongo.Int32;
    var Long: typeof ldbMongo.Long;
    var Binary: typeof ldbMongo.Binary;
    var Double: typeof ldbMongo.Double;
    var EJSON: typeof ldbMongo.EJSON;
    var BSONRegExp: typeof ldbMongo.BSONRegExp;

    type AnyBulkWriteOperation = ldbMongo.AnyBulkWriteOperation;
    type BsonDocument = ldbMongo.Document;
    type BulkWriteResult = shellApi.BulkWriteResult;
    type CreateCollectionOptions = ldbMongo.CreateCollectionOptions;
    type Database = shellApi.Database & { [coll: string]: shellApi.Collection };
    type IndexDescription = ldbMongo.IndexDescription;
    type IndexDefinition = {
        key: IndexDescription["key"];
        options: Omit<IndexDescription, "key">;
    };
    type IndexConfig = Record<string, IndexDefinition>;
    type MongoServerError = shellApi.MongoServerError;
    type ReplicaSet = shellApi.ReplicaSet;
    type WriteConcern = serviceProviderCore.WriteConcern;
}

/** Security */
declare global {
    type CollectionResource = { db: string; collection: string };
    type DatabaseResource = { db: string; collection: "" };
    type AllCollectionsResource = { db: ""; collection: "" };
    type ClusterResource = { cluster: true };
    type Resource = CollectionResource | DatabaseResource | AllCollectionsResource | ClusterResource;

    type QueryWriteAction = "find" | "insert" | "remove" | "update" | "bypassDocumentValidation" | "useUUID";
    type DatabaseManagementAction =
        | "changeCustomData"
        | "changeOwnCustomData"
        | "changeOwnPassword"
        | "changePassword"
        | "createCollection"
        | "createIndex"
        | "createRole"
        | "createUser"
        | "dropCollection"
        | "dropRole"
        | "dropUser"
        | "enableProfiler"
        | "grantRole"
        | "killCursors"
        | "killAnyCursor"
        | "planCacheIndexFilter"
        | "revokeRole"
        | "setAuthenticationRestriction"
        | "setFeatureCompatibilityVersion"
        | "unlock"
        | "viewRole"
        | "viewUser";
    type DeploymentManagementAction = "authSchemaUpgrade" | "cleanupOrphaned" | "cpuProfiler" | "inprog" | "invalidateUserCache" | "killop" | "planCacheRead" | "planCacheWrite";
    type ChangeStreamAction = "changeStream";
    type ReplicationAction = "appendOplogNote" | "replSetConfigure" | "replSetGetConfig" | "replSetGetStatus" | "replSetHeartbeat" | "replSetStateChange" | "resync";
    type ShardingAction =
        | "addShard"
        | "checkMetadataConsistency"
        | "clearJumboFlag"
        | "enableSharding"
        | "refineCollectionShardKey"
        | "reshardCollection"
        | "flushRouterConfig"
        | "getShardMap"
        | "listShards"
        | "moveChunk"
        | "removeShard"
        | "shardedDataDistribution"
        | "shardingState"
        | "splitVector";
    type ServerAdministrationAction =
        | "applicationMessage"
        | "bypassWriteBlockingMode"
        | "collMod"
        | "compact"
        | "compactStructuredEncryptionData"
        | "connPoolSync"
        | "convertToCapped"
        | "dropConnections"
        | "dropDatabase"
        | "dropIndex"
        | "forceUUID"
        | "fsync"
        | "getDefaultRWConcern"
        | "getParameter"
        | "hostInfo"
        | "oidReset"
        | "logRotate"
        | "reIndex"
        | "renameCollectionSameDB"
        | "rotateCertificates"
        | "setDefaultRWConcern"
        | "setParameter"
        | "setUserWriteBlockMode"
        | "shutdown";
    type SessionAction = "impersonate" | "listSessions" | "killAnySession";
    type DiagnosticAction =
        | "collStats"
        | "connPoolStats"
        | "dbHash"
        | "dbStats"
        | "getCmdLineOpts"
        | "getLog"
        | "indexStats"
        | "listDatabases"
        | "listCollections"
        | "listIndexes"
        | "queryStatsRead"
        | "queryStatsReadTransformed"
        | "serverStatus"
        | "validate"
        | "top";
    type PrivilegeAction =
        | QueryWriteAction
        | DatabaseManagementAction
        | DeploymentManagementAction
        | ChangeStreamAction
        | ReplicationAction
        | ShardingAction
        | ServerAdministrationAction
        | SessionAction
        | DiagnosticAction;

    type Privilege = { resource: Resource; actions: PrivilegeAction[] };

    type Role = { role: string; db: string };
    type GetRoleOptions = {
        /**
         * Optional. Set this field to `true` to include authentication restrictions in the output. Authentication restrictions indicate the IP addresses that users with this role can connect to and from.
         *
         * By default, this field is `false`, meaning that the `db.getRole()` output does not include authentication restrictions.
         */
        showAuthenticationRestrictions?: boolean;
        /**
         * Optional. Set this field to `true` to include built-in roles in the output.
         *
         * By default, this field is set to `false`, and the output for `rolesInfo: 1` displays only user-defined roles.
         */
        showBuiltinRoles?: boolean;
        /**
         * Optional. Set this field to `true` to show role privileges, including both privileges inherited from other roles and privileges defined directly.
         *
         * By default, the command returns only the roles from which this role inherits privileges and does not return specific privileges.
         */
        showPrivileges?: boolean;
    };
    type GetRoleResult = Role & {
        isBuiltin: boolean;
        roles: (Role | string)[];
        inheritedRoles: (Role | string)[];
        privileges: Privilege[];
        inheritedPrivileges: Privilege[];
    };
    type RoleDefinition = Omit<GetRoleResult, "isBuiltin" | "inheritedRoles" | "inheritedPrivileges">;

    type User = {
        user: string;
        pwd: string;
        customData?: BsonDocument;
        roles: (Role | string)[];
    };
    type UserDefinition = Omit<User, "pwd"> & {
        db: string;
    };
    type GetUserOptions = {
        /**
         * Optional. Set to `true` to display the user's password hash.
         *
         * By default, this field is `false`.
         */
        showCredentials?: boolean;
        /**
         * Optional. Set to `false` to omit the user's customData from the output.
         *
         * By default, this field is `true`.
         */
        showCustomData?: boolean;
        /**
         * Optional. Set to `true` to show the user's full set of privileges, including expanded information for the inherited roles.
         *
         * By default, this field is `false`.
         *
         * If viewing all users, you cannot specify this field.
         */
        showPrivileges?: boolean;
        /**
         * Optional. Set to `true` to show the user's authentication restrictions.
         *
         * By default, this field is `false`.
         *
         * If viewing all users, you cannot specify this field.
         */
        showAuthenticationRestrictions?: boolean;
        /**
         * Optional. A document that specifies `$match` stage conditions to return information for users that match the filter conditions.
         */
        filter?: BsonDocument;
    };
    type GetUserResult = Omit<User, "pwd"> & {
        _id: string;
        userId: ldbMongo.UUID;
        db: string;
    };
}

/** Custom type */
declare global {
    type Identity = { _id: string; L: number; stage: "active" | "archive" | "mixed" };
}

/** Collation */
declare global {
    type Locale =
        | "simple"
        | "af"
        | "sq"
        | "am"
        | "ar"
        | "ar@collation=compat"
        | "hy"
        | "as"
        | "az"
        | "az@collation=search"
        | "bn"
        | "be"
        | "bn@collation=traditional"
        | "bs"
        | "bs@collation=search"
        | "bs_Cyrl"
        | "bg"
        | "my"
        | "ca"
        | "ca@collation=search"
        | "chr"
        | "zh"
        | "zh@collation=big5han"
        | "zh@collation=gb2312han"
        | "zh@collation=unihan"
        | "zh@collation=zhuyin"
        | "zh_Hant"
        | "hr"
        | "hr@collation=search"
        | "cs"
        | "cs@collation=search"
        | "da"
        | "da@collation=search"
        | "nl"
        | "dz"
        | "en"
        | "en_US"
        | "en_US_POSIX"
        | "eo"
        | "et"
        | "ee"
        | "fo"
        | "fil"
        | "fi"
        | "fi@collation=search"
        | "fi@collation=traditional"
        | "fr"
        | "fr_CA"
        | "gl"
        | "gl@collation=search"
        | "ka"
        | "de"
        | "de@collation=search"
        | "de@collation=eor"
        | "de@collation=phonebook"
        | "de_AT"
        | "el"
        | "gu"
        | "ha"
        | "haw"
        | "he"
        | "he@collation=search"
        | "hi"
        | "hu"
        | "is"
        | "is@collation=search"
        | "ig"
        | "smn"
        | "smn@collation=search"
        | "id"
        | "ga"
        | "it"
        | "ja"
        | "ja@collation=unihan"
        | "kl"
        | "kl@collation=search"
        | "kn"
        | "kn@collation=traditional"
        | "kk"
        | "km"
        | "kok"
        | "ko"
        | "ko@collation=search"
        | "ko@collation=searchjl"
        | "ko@collation=unihan"
        | "ky"
        | "lkt"
        | "lo"
        | "lv"
        | "ln"
        | "ln@collation=phonetic"
        | "lt"
        | "dsb"
        | "lb"
        | "mk"
        | "ms"
        | "ml"
        | "mt"
        | "mr"
        | "mn"
        | "ne"
        | "se"
        | "se@collation=search"
        | "nb"
        | "nb@collation=search"
        | "nn"
        | "nn@collation=search"
        | "or"
        | "om"
        | "ps"
        | "fa"
        | "fa_AF"
        | "pl"
        | "pt"
        | "pa"
        | "ro"
        | "ru"
        | "sr"
        | "sr_Latn"
        | "sr_Latn@collation=search"
        | "si"
        | "si@collation=dictionary"
        | "sk"
        | "sk@collation=search"
        | "sl"
        | "es"
        | "es@collation=search"
        | "es@collation=traditional"
        | "sw"
        | "sv"
        | "sv@collation=search"
        | "ta"
        | "te"
        | "th"
        | "bo"
        | "to"
        | "tr"
        | "tr@collation=search"
        | "uk"
        | "hsb"
        | "ur"
        | "ug"
        | "vi"
        | "vi@collation=traditional"
        | "wae"
        | "cy"
        | "yi"
        | "yi@collation=search"
        | "yo"
        | "zu";
    type Strength = 1 | 2 | 3 | 4 | 5;
    type CollationOptions = serviceProviderCore.CollationOptions;
    type Collation = CollationOptions & { locale: Locale; strength?: Strength; version?: string };
}

/** BI */
declare global {
    type BIColumnType = (typeof biColumnType)[keyof typeof biColumnType];
    type BIColumn = { mongo_name: string; sql_name: string } & BIColumnType;
    type BITable = {
        _id: { db: string; table: string };
        source?: string;
        pipeline?: string;
        columns: BIColumn[];
    };
}

declare module "@mongosh/shell-api" {
    interface Collection {
        aggregate(pipeline: ldbMongo.Document[], options: ldbMongo.Document & { explain?: never }): ldbMongo.AggregationCursor;
        aggregate(pipeline: ldbMongo.Document[], options: ldbMongo.Document & { explain: ldbMongo.ExplainVerbosityLike }): ldbMongo.Document;
        aggregate(...stages: ldbMongo.Document[]): ldbMongo.AggregationCursor;
        bulkWrite(operations: AnyBulkWriteOperation[], options?: ldbMongo.BulkWriteOptions): shellApi.BulkWriteResult;
        countDocuments(query?: ldbMongo.Document, options?: ldbMongo.CountDocumentsOptions): number;
        deleteMany(filter: ldbMongo.Document, options?: ldbMongo.DeleteOptions): ldbMongo.DeleteResult | ldbMongo.Document;
        deleteOne(filter: ldbMongo.Document, options?: ldbMongo.DeleteOptions): ldbMongo.DeleteResult | ldbMongo.Document;
        distinct(field: string): ldbMongo.Document;
        distinct(field: string, query: ldbMongo.Document): ldbMongo.Document;
        distinct(field: string, query: ldbMongo.Document, options: ldbMongo.DistinctOptions): ldbMongo.Document;
        estimatedDocumentCount(options?: ldbMongo.EstimatedDocumentCountOptions): number;
        find(query?: ldbMongo.Document, projection?: ldbMongo.Document, options?: ldbMongo.FindOptions): shellApi.Cursor;
        findOne(query?: ldbMongo.Document, projection?: ldbMongo.Document, options?: FindOptions): ldbMongo.Document | null;
        renameCollection(newName: string, dropTarget?: boolean): ldbMongo.Document;
        findOneAndDelete(filter: ldbMongo.Document, options?: ldbMongo.FindOneAndDeleteOptions): ldbMongo.Document | null;
        insert(docs: ldbMongo.Document | ldbMongo.Document[], options?: ldbMongo.BulkWriteOptions): ldbMongo.InsertManyResult;
        insertMany(docs: ldbMongo.Document[], options?: ldbMongo.BulkWriteOptions): ldbMongo.InsertManyResult;
        insertOne(doc: ldbMongo.Document, options?: ldbMongo.InsertOneOptions): ldbMongo.InsertOneResult;
        isCapped(): boolean;
        replaceOne(filter: ldbMongo.Document, replacement: ldbMongo.Document, options?: ldbMongo.ReplaceOptions): ldbMongo.UpdateResult;
        update(filter: ldbMongo.Document, update: ldbMongo.Document, options?: ldbMongo.UpdateOptions & { multi?: boolean }): ldbMongo.UpdateResult | ldbMongo.Document;
        updateMany(filter: ldbMongo.Document, update: ldbMongo.Document, options?: ldbMongo.UpdateOptions): ldbMongo.UpdateResult | ldbMongo.Document;
        updateOne(filter: ldbMongo.Document, update: ldbMongo.Document, options?: ldbMongo.UpdateOptions): ldbMongo.UpdateResult | ldbMongo.Document;
        compactStructuredEncryptionData(): ldbMongo.Document;
        convertToCapped(size: number): ldbMongo.Document;
        createIndexes(keyPatterns: ldbMongo.Document[], options?: ldbMongo.CreateIndexesOptions, commitQuorum?: number | string): string[];
        createIndex(keys: ldbMongo.Document, options?: ldbMongo.CreateIndexesOptions, commitQuorum?: number | string): string;
        ensureIndex(keys: ldbMongo.Document, options?: ldbMongo.CreateIndexesOptions, commitQuorum?: number | string): ldbMongo.Document;
        getIndexes(): ldbMongo.Document[];
        getIndexSpecs(): ldbMongo.Document[];
        getIndexKeys(): ldbMongo.Document[];
        dropIndexes(indexes?: string | string[] | ldbMongo.Document | ldbMongo.Document[]): ldbMongo.Document;
        dropIndex(index: string | ldbMongo.Document): ldbMongo.Document;
        totalIndexSize(...args: unknown[]): number;
        reIndex(): ldbMongo.Document;
        getDB(): Database;
        getMongo(): shellApi.Mongo;
        dataSize(): number;
        storageSize(): number;
        totalSize(): number;
        drop(options?: ldbMongo.DropCollectionOptions): boolean;
        exists(): ldbMongo.Document;
        getFullName(): string;
        getName(): string;
        runCommand(commandName: string | ldbMongo.Document, options?: ldbMongo.RunCommandOptions): ldbMongo.Document;
        explain(verbosity?: ldbMongo.ExplainVerbosityLike): Explainable;
        stats(originalOptions?: ldbMongo.Document | number): ldbMongo.Document;
        latencyStats(options?: ldbMongo.Document): ldbMongo.Document[];
        validate(options?: boolean | ldbMongo.Document): ldbMongo.Document;
        getShardVersion(): ldbMongo.Document;
        getShardDistribution(): shellApi.CommandResult;
        watch(pipeline?: ldbMongo.Document[] | ldbMongo.ChangeStreamOptions, options?: ldbMongo.ChangeStreamOptions): ChangeStreamCursor;
        hideIndex(index: string | ldbMongo.Document): ldbMongo.Document;
        unhideIndex(index: string | ldbMongo.Document): ldbMongo.Document;
        analyzeShardKey(key: ldbMongo.Document, options?: ldbMongo.Document): ldbMongo.Document;
        configureQueryAnalyzer(options: ldbMongo.Document): ldbMongo.Document;
    }
}
