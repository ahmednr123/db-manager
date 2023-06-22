export { DBConfig } from "./DBConfig";
import table, { SubTable as subTable, Constraints as constraints, TableSchema as tableSchema, ColumnSchema as columnSchema } from "./Table";
export declare const CommitProcedure: {
    commitTable: (table_schema: tableSchema, knex_handle: import("knex").Knex<any, any[]>) => Promise<void>;
};
export declare const Table: typeof table;
export declare const SubTable: typeof subTable;
export declare const Constraints: typeof constraints;
export interface TableSchema extends tableSchema {
}
export interface ColumnSchema extends columnSchema {
}
export declare const Util: {
    knexBinaryToUUID: (knex: import("knex").Knex<any, any[]>, column: string) => import("knex").Knex.Raw<any>;
    knexUUIDToBinary: (knex: import("knex").Knex<any, any[]>, uuid: string) => import("knex").Knex.Raw<any>;
    getIDColumnSchema: () => columnSchema;
    getIDRefSchema: ({ field_name, foreign_table, }: {
        field_name: string;
        foreign_table: string;
    }, constraints?: constraints[] | undefined) => columnSchema;
    getIDNRefSchema: (field_name: any, constraints?: constraints[] | undefined) => columnSchema;
};
export declare const Type: {
    Binary: {
        type: string;
        getProcedure: (name: string, options: any) => import("./type_procedures").TypeProcedure;
    };
    String: {
        type: string;
        getProcedure: (name: string, options: any) => import("./type_procedures").TypeProcedure;
    };
    Number: {
        type: string;
        getProcedure: (name: string, options: any) => import("./type_procedures").TypeProcedure;
    };
    Enum: {
        type: string;
        getProcedure: (name: string, options: any) => import("./type_procedures").TypeProcedure;
    };
    DateTime: {
        type: string;
        getProcedure: (name: string, options: any) => import("./type_procedures").TypeProcedure;
    };
};
export declare const TypeProcedure: {
    getTypeProcedure: (type_string: string, field: string, options: any) => any;
};
