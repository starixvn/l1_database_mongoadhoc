type OpResult = { ok: 0 | 1 };

declare module "@mongosh/shell-api" {
    interface Database {
        createRole(role: Omit<RoleDefinition, "db">, writeConcern?: WriteConcern): Promise<OpResult>;
        createRole(role: any, writeConcern?: WriteConcern): Promise<never>;

        getRole(rolename: string, options?: GetRoleOptions): Promise<GetRoleResult | null>;

        grantRolesToRole(rolename: string, roles: Role[], writeConcern?: WriteConcern): Promise<OpResult>;
        grantRolesToRole(rolename: string, roles: any[], writeConcern?: WriteConcern): Promise<never>;

        revokeRolesFromRole(rolename: string, roles: Role[], writeConcern?: WriteConcern): Promise<OpResult>;
        revokeRolesFromRole(rolename: string, roles: any[], writeConcern?: WriteConcern): Promise<never>;

        grantPrivilegesToRole(rolename: string, roles: Privilege[], writeConcern?: WriteConcern): Promise<OpResult>;
        grantPrivilegesToRole(rolename: string, roles: any[], writeConcern?: WriteConcern): Promise<never>;

        revokePrivilegesFromRole(rolename: string, roles: Privilege[], writeConcern?: WriteConcern): Promise<OpResult>;
        revokePrivilegesFromRole(rolename: string, roles: any[], writeConcern?: WriteConcern): Promise<never>;

        createUser(rolename: User, writeConcern?: WriteConcern): Promise<OpResult>;
        createUser(rolename: any, writeConcern?: WriteConcern): Promise<never>;

        getUser(rolename: string, options?: GetUserOptions): Promise<GetUserResult | null>;

        grantRolesToUser(username: string, roles: Role[], writeConcern?: WriteConcern): Promise<OpResult>;
        grantRolesToUser(username: string, roles: any[], writeConcern?: WriteConcern): Promise<never>;

        revokeRolesFromUser(username: string, roles: Role[], writeConcern?: WriteConcern): Promise<OpResult>;
        revokeRolesFromUser(username: string, roles: any[], writeConcern?: WriteConcern): Promise<never>;
    }
}

export {};
