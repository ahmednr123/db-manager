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
    constraints?: Array<Constraints>;
    foreign?: {table: string, column: string};
    default?: any;
}

export interface TableSchema {
    name: string;
    columns: Array<ColumnSchema>;
}

export class SubTable {
    private schema_handle: (parent_schema: TableSchema) => TableSchema;

    public constructor (schema_handle: (parent_schema: TableSchema) => TableSchema) {
        this.schema_handle = schema_handle;
    }

    public getName (): String {
        return this.schema_handle(null).name;
    }

    private columnDefaultConverts (column: ColumnSchema, knex_handle: Knex) {
        if (column.default == '_now_') {
            column.default = knex_handle.fn.now();
        }
    }

    public async createIfNotExists (parent_schema: TableSchema, knex_handle: Knex, columns?: ColumnSchema[]): Promise<TableSchema> {
        let schema = this.schema_handle(parent_schema);
        
        if (columns)
            schema.columns = [...schema.columns, ...columns];
        
        for (let column of schema.columns)
            this.columnDefaultConverts(column, knex_handle);
        
            schema.name = `$${parent_schema.name}_${schema.name}`;
        if (!(await knex_handle.schema.hasTable(schema.name))) {
            // _id has to exist for every table, even for map tables
            addColumnIfNotExists(schema, {
                name: "_id",
                type: {
                    name: "number",
                    options: {
                        size: "normal",
                        unsigned: true
                    }
                },
                constraints: [
                    Constraints.PRIMARY_KEY,
                    Constraints.AUTO_INCREMENT
                ]
            });
            await CommitProcedure.commitTable(schema, knex_handle);
            return schema;
        }
    }
}

export class Table {
    private static schemas: Map<String, TableSchema> = new Map();

    private table_schema: TableSchema;
    private sub_tables: Array<SubTable>;

    private column_map: Map<String, ColumnSchema[]>;

    public constructor (table_schema: TableSchema, sub_tables?: Array<SubTable>) {
        this.table_schema = table_schema;
        this.sub_tables = sub_tables;
        this.column_map = new Map();
    }

    public addSubTable (sub_table: SubTable, columns: ColumnSchema[]) {
        this.column_map.set(sub_table.getName(), [...columns]);
        this.sub_tables.push(sub_table);
    }

    public async createIfNotExists (db_name: string, db_config: DBConfig) {
        let knex: Knex = db_config.getDatabaseHandle(db_name);
        if (!(await knex.schema.hasTable(this.table_schema.name))) {
            // _id has to exist for every table, even for map tables
            addColumnIfNotExists(this.table_schema, {
                name: "_id",
                type: {
                    name: "number",
                    options: {
                        size: "normal",
                        unsigned: true
                    }
                },
                constraints: [
                    Constraints.PRIMARY_KEY,
                    Constraints.AUTO_INCREMENT
                ]
            });
            await CommitProcedure.commitTable(this.table_schema, knex);
            Table.schemas.set(this.table_schema.name, this.table_schema);
        }
        
        if (this.sub_tables)
        for (let sub_table of this.sub_tables) {
            let colunms = null;
            if (this.column_map.has(sub_table.getName()))
                colunms = this.column_map.get(sub_table.getName());
            let sub_table_schema = await sub_table.createIfNotExists(this.table_schema, knex, colunms);
            Table.schemas.set(sub_table_schema.name, sub_table_schema);
        }
    }

    public static getAllSchemas (): Map<String, TableSchema> {
        return Table.schemas;
    }
}

function addColumnIfNotExists (table_schema: TableSchema, column: ColumnSchema) {
    let exists = false;
    for (let _column of table_schema.columns) {
        if (_column.name == column.name) {
            exists = true;
        }
    }

    if (exists) {
        table_schema.columns.push(column);
    }
}