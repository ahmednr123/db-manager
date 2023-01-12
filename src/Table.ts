import { IDataType } from "./datatypes";

export enum Constraints {
    UNIQUE_KEY,
    PRIMARY_KEY,
    NOT_NULL,
    AUTO_INCREMENT
}

export interface ColumnSchema {
    name: string;
    type: IDataType;
    size?: number; //For now the only reason this makes sense is for string.
    //adding a size to varchar doesn't really do much but provide limit check.
    constraints?: Array<Constraints>;
    enums?: Array<string | number>;
    foreign?: {table: string, column: string};
    default?: any;
}

export interface TableSchema {
    name: string;
    columns: Array<ColumnSchema>;
}

export class Table {
    table_schema: TableSchema;

    constructor (table_schema: TableSchema) {
        this.table_schema = table_schema;
    }

    name () {
        return this.table_schema.name;
    }

    schema () {
        return this.table_schema;
    }
}