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
    type: {name: string, options?: any};
    constraints?: Array<Constraints>; // Maybe make it a array of string for now, things r taking too long
    foreign?: {table: string, column: string};
    default?: any;
}

export interface TableSchema {
    name: string;
    columns: Array<ColumnSchema>;
}

export class SubTable {
    private schema_handle: (parent_schema: TableSchema) => TableSchema;

    constructor (schema_handle: (parent_schema: TableSchema) => TableSchema) {
        this.schema_handle = schema_handle;
    }

    async createIfNotExists (parent_schema: TableSchema, knex_handle: Knex) {
        let schema = this.schema_handle(parent_schema);
        schema.name = `$${parent_schema.name}_${schema.name}`;
        if (!(await knex_handle.schema.hasTable(schema.name))) {
            await CommitProcedure.commitTable(schema, knex_handle);
        }
    }
}

export class Table {
    private table_schema: TableSchema;
    private sub_tables: Array<SubTable>;

    constructor (table_schema: TableSchema, sub_tables?: Array<SubTable>) {
        this.table_schema = table_schema;
        this.sub_tables = sub_tables;
    }

    async createIfNotExists (db_name: string, db_config: DBConfig) {
        let knex: Knex = db_config.getDatabaseHandle(db_name);
        if (!(await knex.schema.hasTable(this.table_schema.name))) {
            await CommitProcedure.commitTable(this.table_schema, knex);
        }
        
        if (this.sub_tables)
        for (let sub_table of this.sub_tables) {
            await sub_table.createIfNotExists(this.table_schema, knex);
        }
    }
}