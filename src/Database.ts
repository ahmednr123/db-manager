import { Knex } from "knex";
import { convertColumn, getMySQLConstraints } from "./Converter";
import { DBConfig } from "./DBConfig";
import { CommitAction, CommitType } from "./commit_procedures";
import SchemaDiffer, {Diff} from "./SchemaDiffer";
import { Table, TableSchema } from "./Table";
import { ArrayChecker } from "./Util";

export class Database {
    static loaded_dbs: Array<Database>;

    db_name: string;
    conceptual_tables: Array<Table>;

    is_concrete: boolean;
    concrete_tables: Array<Table>;

    db_config: DBConfig;

    private constructor (db_name: string, db_config: DBConfig) {
        this.db_name = db_name;
        this.db_config = db_config;
        this.conceptual_tables = new Array();
        this.concrete_tables = new Array();
        this.is_concrete = false;
    }

    static getDatabase (db_name: string, db_config?: DBConfig) {
        if (!Database.loaded_dbs) {
            Database.loaded_dbs = [];
        }

        let db = Database.loaded_dbs.find(d => d.name() == db_name);
        if (!db) {
            if (!db_config)
                throw new Error(`DBConfig not found for ${db_name}. Database might not have been intiated properly`);
            db = new Database(db_name, db_config);
        }

        return db;
    }

    name () {
        return this.db_name;
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

    getConcreteTable(table_name: string): Table {
        let table = this.concrete_tables.find(t => t.name() == table_name);
        if (!table)
            throw new Error(`Concrete table: ${table_name} not found`);
        return table;
    }

    getConceptualTable(table_name: string): Table {
        let table = this.conceptual_tables.find(t => t.name() == table_name);
        if (!table)
            throw new Error(`Conceptual table: ${table_name} not found`);
        return table;
    }

    async getTableSchema (table_name : string): Promise<TableSchema> {
        try {
            let schema = {name: table_name, columns: []};
            let db_handle = this.db_config.getDatabaseHandle(this.db_name);
            let data = parse(await db_handle.raw(`DESCRIBE ${table_name}`));
            let constraints = await getMySQLConstraints(db_handle as Knex, this.db_name, table_name);
            data.map(col => schema.columns.push(convertColumn(constraints, col)));
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
                const schemaDiffer = new SchemaDiffer(this.db_name, left.schema(), right.schema());
                diff_arr.concat(schemaDiffer.diff());
            }
        });

        arrayChecker.check(this.concrete_tables, this.conceptual_tables, {
            onNotFound: (elem) => {
                diff_arr.push({
                    type: CommitType.TABLE,
                    action: CommitAction.REMOVE,
                    db_name: this.db_name,
                    table_name: elem.name(),
                    old: {...elem.schema()}
                });
            }
        });

        arrayChecker.check(this.conceptual_tables, this.concrete_tables, {
            onNotFound: (elem) => {
                diff_arr.push({
                    type: CommitType.TABLE,
                    action: CommitAction.ADD,
                    db_name: this.db_name,
                    table_name: elem.name(),
                    new: {...elem.schema()}
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