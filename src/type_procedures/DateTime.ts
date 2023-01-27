import { Knex } from "knex";
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
    getMySQLType: () => `datetime`,

    knex_handle: {
        create: (table: Knex.CreateTableBuilder, field: string): Knex.ColumnBuilder => {
            let builder = table.datetime(field);
            if (obj.default)
                builder.defaultTo(obj.default); 
            return builder;
        },
        alter:  (table: Knex.AlterTableBuilder, field: string): Knex.ColumnBuilder => {
            let builder = table.datetime(field);
            if (obj.default)
                builder.defaultTo(obj.default); 
            return builder;
        }
    }
}

return obj;
}

export default {type: 'datetime', getProcedure};