import { DBConfig } from "./DBConfig";
import { ColumnSchema } from "./Table";

export class Column {
    db_name: string;
    table_name: string;
    column_schema: ColumnSchema;
    db_config: DBConfig;

    constructor (db_config: DBConfig, db_name: string, table_name: string, column_schema: ColumnSchema) {
        this.db_name = db_name;
        this.table_name = table_name;
        this.column_schema = column_schema;
        this.db_config = db_config;
    }

    update (field_name: string) {

    }

    get (field_name: string) {

    }
}