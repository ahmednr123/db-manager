import { ColumnSchema } from "./Table";
import { DataTypes } from "./datatypes";

export function convertColumn (mysql_col_schema): ColumnSchema {
    let type = DataTypes.find(type => type.matchDesc(mysql_col_schema['Type']));
    let json_col_schema: ColumnSchema = {
        name: mysql_col_schema['Field'],
        type
    };

    type.parseDesc(json_col_schema, mysql_col_schema);

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