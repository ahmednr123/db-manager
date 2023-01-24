import { ColumnSchema, Constraints } from "./Table";
import TypeProcedures from "./type_procedures";
import { Knex } from "knex";

interface ConstraintInfo {
    CONSTRAINT_TYPE: string,
    CONSTRAINT_NAME: string,
    COLUMN_NAME: string,
    REFERENCED_TABLE_NAME: null | string,
    REFERENCED_COLUMN_NAME: null | string
}

export function convertColumn (constraints: Array<ConstraintInfo>, mysql_col_schema): ColumnSchema {
    let procedure = TypeProcedures.matchTypeProcedure(mysql_col_schema['Type']);
    let json_col_schema: ColumnSchema = {
        name: mysql_col_schema['Field'],
        type: {
            name: procedure.getString(),
            options: procedure.parseMySQLDesc(mysql_col_schema)
        },
        constraints: []
    };

    // Common parsing
    if(mysql_col_schema['Default'])
        json_col_schema.default = mysql_col_schema['Default'];
    if(mysql_col_schema['Extra'].includes('auto_increment'))
        json_col_schema.constraints.push(Constraints.AUTO_INCREMENT);
    
    for (let constraint of constraints) {
        if (constraint.COLUMN_NAME == json_col_schema.name) {
            switch (constraint.CONSTRAINT_TYPE) {
            case 'PRIMARY KEY':
                json_col_schema.constraints.push(Constraints.PRIMARY_KEY);
                break;
            case 'FOREIGN KEY':
                json_col_schema.foreign = {
                    table: constraint.REFERENCED_TABLE_NAME,
                    column: constraint.REFERENCED_COLUMN_NAME
                }
                break;
            case 'UNIQUE':
                json_col_schema.constraints.push(Constraints.UNIQUE_KEY);
                break;
            }
        }
    }

    return json_col_schema;
}

// Returns all constraints related to the table
export async function getMySQLConstraints (knex: Knex, db_name: string, table_name: string): Promise<Array<ConstraintInfo>> {
    let out = [];
    try {
        out = await knex.raw(`SELECT A.CONSTRAINT_TYPE, A.CONSTRAINT_NAME, B.COLUMN_NAME, B.REFERENCED_TABLE_NAME, B.REFERENCED_COLUMN_NAME
            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS A
            LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE B ON A.CONSTRAINT_NAME = B.CONSTRAINT_NAME
            WHERE A.TABLE_SCHEMA = '${db_name}' AND A.TABLE_NAME = '${table_name}'
                AND B.TABLE_NAME = '${table_name}'`);
    } catch (error) {
        console.log('Error: ' + JSON.stringify(error, null, 3));
    } finally {
        return out;
    }
}

/*
Response from Knex(MySQL) Raw describe
[ 
    {
        "Field": "",
        "Type": "bigint unsigned",
        "Null": "NO",
        "Key": "",
        "Default": null,
        "Extra": ""
    },
    {
        "Field": "NAME",
        "Type": "varchar(100)",
        "Null": "NO",
        "Key": "",
        "Default": null,
        "Extra": ""
    },
    {
        "Field": "VALUE",
        "Type": "varchar(100)",
        "Null": "YES",
        "Key": "",
        "Default": null,
        "Extra": ""
    },
    {
        "Field": "TYPE",
        "Type": "enum('TOP','DOWN','LEFT','RIGHT')",
        "Null": "NO",
        "Key": "",
        "Default": "TOP",
        "Extra": ""
    }
]
*/