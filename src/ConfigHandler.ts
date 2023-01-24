import { SchemaConsts } from "./Constants";
import { Database } from "./Database";
import { DBConfig } from "./DBConfig";
import { Constraints, TableSchema } from "./Table";

/**
 * database -> {id, name}
 * tables -> {id, database, table_name, table_schema}
 */

/*export class ConfigHandler {
    database: Database;

    constructor (db_config: DBConfig) {
        this.database = new Database("db-config", db_config, true);
        this.database.defineTable({
            name: "databases",
            columns: [
                {
                    name: "id",
                    type: SchemaConsts.INTEGER_COLUMN_TYPE,
                    size: SchemaConsts.BIG_INTEGER_SIZE,
                    constraints: [Constraints.PRIMARY_KEY, Constraints.AUTO_INCREMENT],
                },
                {
                    name: "name",
                    type: SchemaConsts.STRING_COLUMN_TYPE,
                    size: 100
                }
            ]
        });
        this.database.defineTable({
            name: "tables",
            columns: [
                {
                    name: "id",
                    type: SchemaConsts.INTEGER_COLUMN_TYPE,
                    size: SchemaConsts.BIG_INTEGER_SIZE,
                    constraints: [Constraints.PRIMARY_KEY, Constraints.AUTO_INCREMENT],
                },
                {
                    name: "database",
                    type: SchemaConsts.INTEGER_COLUMN_TYPE,
                    size: SchemaConsts.BIG_INTEGER_SIZE,
                    foreign: {
                        table: "databases",
                        column: "id"
                    }
                },
                {
                    name: "table_name",
                    type: SchemaConsts.STRING_COLUMN_TYPE,
                    size: 100
                },
                {
                    name: "table_schema",
                    type: SchemaConsts.STRING_COLUMN_TYPE,
                    size: 10000
                }
            ]
        });
    }

    async init () {
        await this.database.init();
        if (!this.database.is_concrete) {
            throw new Error(
                `"db-config" database not found, \n
                either create a new "db-config" database or\n
                check database configuration provided`
            );
        }
    }
    
    async getConfig (db_name: string, table_name: string): Promise<TableSchema> {
        const table_schema: TableSchema = {
            name: "",
            columns: []
        };

        

        return table_schema;
    }
    
    // Only after commiting the schema
    async saveConfig (db_name: string, table_schema: TableSchema) {

    }

    async importConfig () {

    }

    async exportConfig () {
        
    }
}*/