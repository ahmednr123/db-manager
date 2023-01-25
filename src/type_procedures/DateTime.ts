import { Knex, knex } from "knex";
import { TypeProcedure } from ".";

function getProcedure (name, options, default_val): TypeProcedure {
const obj = {
    name,
    options,
    default: default_val,

    getString: () => `datetime`,
    getMySQLType: () => ``,
    matchMySQLDesc: (mysql_type: string) => false,
    parseMySQLDesc: (mysql_schema: any) => {
        return {name: 'datetime'}
    },
    knex_handle: {
        //TODO: handle default datetime
        create: (table: Knex.CreateTableBuilder, field: string): Knex.ColumnBuilder => {
            return table.datetime(field);
        },
        alter:  (table: Knex.AlterTableBuilder, field: string): Knex.ColumnBuilder => {
            return table.datetime(field);
        }
    }
}

return obj;
}

export default {type: 'datetime', getProcedure};