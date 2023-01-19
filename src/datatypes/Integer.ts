import { Knex } from "knex";
import { IDataType } from ".";
import { ColumnSchema, TableSchema } from "../Table";

function matchType (
    type: string
): boolean {
    return type == 'integer';
}

function matchDesc (
    mysql_type: string
): boolean {
    return mysql_type == 'int unsigned';
}

function parseDesc (
    json_col_schema: ColumnSchema, 
    mysql_col_schema: any
) {
    
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
    getMysqlType: () => `int unsigned`,
    matchType, matchDesc, parseDesc, create, alter
};

export default type;