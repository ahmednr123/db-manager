import { ColumnSchema } from "./Table";
import TypeProcedures from "./type_procedures";

export function convertColumn (mysql_col_schema): ColumnSchema {
    let procedure = TypeProcedures.matchTypeProcedure(mysql_col_schema['Type']);
    let json_col_schema: ColumnSchema = {
        name: mysql_col_schema['Field'],
        type: {
            name: procedure.getString(),
            options: procedure.parseMySQLDesc(mysql_col_schema)
        }
    };

    // Common parsing
    if(mysql_col_schema['Default'])
        json_col_schema.default = mysql_col_schema['Default'];

    return json_col_schema;
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