import { ColumnSchema } from "./Table";
import { SchemaConsts } from "./Constants";

/**
 * The extract methods are done in a hurry, sorry about that,
 * building a working prototype ASAP is more important
 */
const extractStrLength = (type) : string => type.split('(')[1].split(')')[0];
const extractEnums     = (type) : Array<any> => {
    // This method completely ignores comma and close bracket inside the string.
    let arr: any = [];
    let insides = type.split('(')[1].split(')')[0];
    let enums = insides.split(',');
    for (let e of enums) {
        if (e[0] == "'" || e[0] == '"') {
            arr.push(e.slice(1, e.length-1));
        }
    }
    return arr;
}

export function convertColumn (column_schema): ColumnSchema {
    function parseTypeAndLength (type): [string, number] {
        if (type == 'bigint unsigned')
            return [SchemaConsts.INTEGER_COLUMN_TYPE, SchemaConsts.BIG_INTEGER_SIZE];
        else if (type.includes('varchar'))
            return [SchemaConsts.STRING_COLUMN_TYPE, parseInt(extractStrLength(type))];
        else if (type.includes('enum'))
            return [SchemaConsts.ENUM_COLUMN_TYPE, extractEnums(type).length];
    }
    
    let typeAndLength = parseTypeAndLength(column_schema['Type']);
    let schema: any = {
        name: column_schema['Field'],
        type: typeAndLength[0],
    };

    if (typeAndLength[1])
        schema.size = typeAndLength[1];
    if (column_schema['Default'])
        schema[SchemaConsts.DEFAULT_FIELD] = column_schema['Default'];
    if (schema[SchemaConsts.TYPE_FIELD] == SchemaConsts.ENUM_COLUMN_TYPE)
        schema[SchemaConsts.ENUMS_FIELD] = extractEnums(column_schema['Type']);

    return schema;
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