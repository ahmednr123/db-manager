import { Knex } from "knex";
import { IDataType } from ".";
import { ColumnSchema, TableSchema } from "../Table";

/**
 * The extract methods are done in a hurry, sorry about that,
 * building a working prototype ASAP is more important
 */
const extractStrLength = (type) : string => type.split('(')[1].split(')')[0];

function matchType (
    type: string
): boolean {
    return type == 'string';
}

function matchDesc (
    mysql_type: string
): boolean {
    return mysql_type.includes('varchar');
}

function parseDesc (
    json_col_schema: ColumnSchema, 
    mysql_col_schema: any
) {
    json_col_schema.size = parseInt(extractStrLength(mysql_col_schema));
}

function create (
    table: Knex.CreateTableBuilder, 
    schema: ColumnSchema
) {
    table.string(schema.name, schema.size);
}

function alter (
    table: Knex.AlterTableBuilder, 
    schema: ColumnSchema
) {
    table.string(schema.name);
}

const type: IDataType = {
    getMysqlType: (json_schema: ColumnSchema) => `varchar(${json_schema.size || 255})`,
    matchType, matchDesc, parseDesc, create, alter
};

export default type;