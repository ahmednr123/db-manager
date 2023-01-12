import { Knex } from "knex";
import { IDataType } from ".";
import { ColumnSchema, TableSchema } from "../Table";

function matchDesc (
    mysql_type: string
): boolean {
    //TODO: Have to handle unsigned properly
    //For now unsigned is the default type
    return mysql_type == 'bigint unsigned';
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
    matchDesc, parseDesc, create, alter
};

export default type;