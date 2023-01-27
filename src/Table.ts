import { DBConfig } from "./DBConfig";
import { Knex } from "knex";
import CommitProcedure from "./CommitProcedure";

export enum Constraints {
    UNIQUE_KEY = "unique_key",
    PRIMARY_KEY = "primary_key",
    NOT_NULL = "not_null",
    AUTO_INCREMENT = "auto_increment"
}

export interface ColumnSchema {
    name: string;
    type: {name: string, options: any};
    constraints: Array<Constraints>; // Maybe make it a array of string for now, things r taking too long
    foreign?: {table: string, column: string};
    default?: any;
}

export interface TableSchema {
    name: string;
    columns: Array<ColumnSchema>;
}

export class SubTable {
    schema_handle: (parent_schema: TableSchema) => TableSchema;

    constructor (schema_handle: (parent_schema: TableSchema) => TableSchema) {
        this.schema_handle = schema_handle
    }

    create (schema: TableSchema, knex_handle: Knex) {
        CommitProcedure.commitTable(this.schema_handle(schema), knex_handle);
    }
}

export class Table {
    table_schema: TableSchema;
    sub_tables: Array<SubTable>;

    constructor (table_schema: TableSchema, sub_tables: Array<SubTable>) {
        this.table_schema = table_schema;
        this.sub_tables = sub_tables;
    }

    create (db_name: string, db_config: DBConfig) {
        CommitProcedure.commitTable(this.table_schema, db_config.getDatabaseHandle(db_name));
        for (let sub_table of this.sub_tables) {
            sub_table.create(this.table_schema, db_config.getDatabaseHandle(db_name));
        }
    }
}