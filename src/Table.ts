import { DBConfig } from "./DBConfig";
import { Column } from "./Column";
import {Knex} from "knex";

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

export class Table {
    db_name: string;
    table_schema: TableSchema;
    db_config: DBConfig;

    constructor (db_config: DBConfig, db_name: string, table_schema: TableSchema) {
        this.db_name = db_name;
        this.table_schema = table_schema;
        this.db_config = db_config;
    }

    name () {
        return this.table_schema.name;
    }

    schema () {
        return this.table_schema;
    }

    getColumnType (column_name: string): {name: string, options: any} {
        let column = this.table_schema.columns.find(col => col.name == column_name);
        return column.type;
    }

    insert (data) {

    }

    async getMany (conditions: Array<{fn: string, params: Array<any>}>, limit, skipTo): 
        Promise<{data: Array<Column>, skipped_to: number, total_records: number}> 
    {
        let result = {data: [], skipped_to: 0, total_records: 0};
        let db_handle: Knex = this.db_config.getDatabaseHandle(this.db_name);
        
        let handle = db_handle.select('*').from(this.db_name);
        for (let condition of conditions) {
            handle[condition.fn](...condition.params);
        }
        
        result.data = (await handle);


        return result;
    }

    getById (_id) {

    }
}