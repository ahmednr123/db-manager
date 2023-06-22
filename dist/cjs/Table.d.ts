import { DBConfig } from "./DBConfig";
import { Knex } from "knex";
export declare enum Constraints {
    UNIQUE_KEY = "unique_key",
    PRIMARY_KEY = "primary_key",
    NOT_NULL = "not_null",
    AUTO_INCREMENT = "auto_increment"
}
export interface ColumnSchema {
    name: string;
    type: {
        name: string;
        options?: any;
    };
    constraints?: Array<Constraints>;
    foreign?: {
        table: string;
        column: string;
    };
    default?: any;
}
export interface TableSchema {
    name: string;
    columns: Array<ColumnSchema>;
}
export declare class SubTable {
    private schema_handle;
    constructor(schema_handle: (parent_schema: TableSchema) => TableSchema);
    getName(): String;
    createIfNotExists(parent_schema: TableSchema, knex_handle: Knex, columns?: ColumnSchema[]): Promise<TableSchema>;
}
export default class Table {
    private static schemas;
    private table_schema;
    private sub_tables;
    private column_map;
    constructor(table_schema: TableSchema, sub_tables?: Array<SubTable>);
    addSubTable(sub_table: SubTable, columns: ColumnSchema[]): void;
    createIfNotExists(db_name: string, db_config: DBConfig): Promise<void>;
    static getAllSchemas(): Map<String, TableSchema>;
}
