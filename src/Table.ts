export enum Constraints {
    UNIQUE_KEY = "unique_key",
    PRIMARY_KEY = "primary_key",
    NOT_NULL = "not_null",
    AUTO_INCREMENT = "auto_increment"
}

export interface ColumnSchema {
    name: string;
    type: {name: string, options: any};
    constraints?: Array<Constraints>; // Maybe make it a array of string for now, things r taking too long
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

    _schema () {
        return this.table_schema;
    }
}