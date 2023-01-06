import { convertColumn } from "./Converter";
import { DBConfig } from "./DBConfig";
import SchemaDiffer, {Diff} from "./SchemaDiffer";
import { Table, TableSchema } from "./Table";
import { ArrayChecker } from "./Util";

export class Database {
    db_name: string;
    conceptual_tables: Array<Table>;

    is_concrete: boolean;
    concrete_tables: Array<Table>;

    db_config: DBConfig;
    is_root: boolean; // Root databases don't save any configuration.

    constructor (db_name: string, db_config: DBConfig, is_root?: boolean) {
        this.db_name = db_name;
        this.db_config = db_config;
        this.conceptual_tables = new Array();
        this.concrete_tables = new Array();
        this.is_concrete = false;
        this.is_root = is_root || false;
    }

    async init () {
        this.is_concrete = await this.checkDB();
        if (this.is_concrete) {
            let tables = await this.getAllTables();
            for (let table_name of tables) {
                let table_schema = await this.getTableSchema(table_name);
                let table: Table = new Table(table_schema);
                this.concrete_tables.push(table);
            }
        }
    }

    async checkDB () : Promise<boolean> {
        try {
            let db_handle = this.db_config.getDatabaseHandle('*');
            let databases = parse(await db_handle.raw('SHOW DATABASES'), 'show');
            return databases.includes(this.db_name);
        } catch (error) {
            console.log('Error: ' + JSON.stringify(error, null, 2));
            throw new Error('Error connecting to DB');
        }
    }

    async getAllTables (): Promise<Array<string>> {
        try {
            let db_handle = this.db_config.getDatabaseHandle(this.db_name);
            return parse(await db_handle.raw('SHOW TABLES'), 'show');
        } catch (error) {
            console.log('Error: ' + JSON.stringify(error, null, 2));
            throw new Error('Error connecting to DB');
        }
    }

    async getTableSchema (table_name : string): Promise<TableSchema> {
        try {
            let schema = {name: table_name, columns: []};
            let db_handle = this.db_config.getDatabaseHandle(this.db_name);
            let data = parse(await db_handle.raw(`DESCRIBE ${table_name}`));
            data.map(col => schema.columns.push(convertColumn(col)));
            return schema;
        } catch (error) {
            console.log('Error: ' + JSON.stringify(error, null, 2));
            throw new Error('Error connecting to DB');
        }
    }

    defineTable (table_schema: TableSchema): Table {
        //TODO: have to handle how to defining the table a second time, for now throwing error
        let table_name = table_schema.name;
        let table: Table = this.conceptual_tables.find(table_schema => table_schema.name() == table_name);
        if (table) {
            throw new Error(`Table: "${table_schema.name}" is already defined`);
        }

        table = new Table(table_schema);
        this.conceptual_tables.push(table);
        return table;
    }

    getDiff (): Array<Diff> {
        // returning all differences between the concrete and conceptual tables
        // individually so that we can handle the order of commit.

        let diff_arr: Array<Diff> = [];
        const arrayChecker = new ArrayChecker({
            getId: (table) => table.name(),
            isEqualTo: (left, right) => left.name() == right.name(),
            onFound: (left, right) => {
                const schemaDiffer = new SchemaDiffer(left.schema(), right.schema());
                diff_arr.concat(schemaDiffer.diff());
            }
        });

        arrayChecker.check(this.concrete_tables, this.conceptual_tables, {
            onNotFound: (elem) => {
                diff_arr.push({
                    action: "table-remove",
                    table: elem.name()
                });
            }
        });

        arrayChecker.check(this.conceptual_tables, this.concrete_tables, {
            onNotFound: (elem) => {
                diff_arr.push({
                    action: "table-add",
                    table_schema: {...elem.schema()}
                });
            }
        });

        return diff_arr;
    }

    destroy() {
        this.db_config.destroy();
    }
}

function parse (data, type?, client?) { // client = MySQL for now
    switch (type) {
    case 'show': // SHOW DATABASES | TABLES
        const values = [];
        let key = Object.keys(data[0][0])[0];
        data[0].map(record => values.push(record[key]));
        return values;
    default:
        return data[0];
    }
}