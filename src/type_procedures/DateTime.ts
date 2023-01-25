import { Knex, knex } from "knex";
import { TypeProcedure } from ".";

// datetime.options { date_enabled, time_enabled, format }
// false && false => ???
// date_enabled => date
// time_enabled => time
// date_enalbed && time_enabled => datetime
// TODO: Have to add the above functionality

function getProcedure (name, options, default_val): TypeProcedure {
const obj = {
    name,
    options,
    default: default_val,

    getString: () => `datetime`,
    getMySQLType: () => ``,
    matchMySQLDesc: (mysql_type: string) => mysql_type.includes('datetime'),
    parseMySQLDesc: (mysql_schema: any) => {
        return {name: 'datetime'}
    },
    knex_handle: {
        //TODO: handle default datetime, 
        //for property update the value is of type 'any' which can hold datetime also as value
        //so we can convert it before hand in table schema, probably while parsing or loading.
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