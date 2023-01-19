import { Knex } from "knex";
import { json } from "stream/consumers";
import { IDataType } from ".";
import { ColumnSchema, TableSchema } from "../Table";

/**
 * The extract methods are done in a hurry, sorry about that,
 * building a working prototype ASAP is more important
 */
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

function matchType (
    type: string
): boolean {
    return type == 'enum';
}

function matchDesc (
    mysql_type: string
): boolean {
    return mysql_type.includes('enum');
}

function parseDesc (
    json_col_schema: ColumnSchema, 
    mysq_col_schema: any
) {
    json_col_schema.enums = extractEnums(mysq_col_schema['Type']);
}

function create (
    table: Knex.CreateTableBuilder, 
    schema: ColumnSchema
) {

}

function alter (
    table: Knex.AlterTableBuilder, 
    schema: ColumnSchema
) {

}

const type: IDataType = {
    getMysqlType: (json_schema: ColumnSchema) => `enum(${json_schema.enums.map(e => `'${e}'`).join(',')})`,
    matchType, matchDesc, parseDesc, create, alter
};

export default type;