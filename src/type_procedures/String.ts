import { Knex } from "knex";
import { TypeProcedure } from ".";

function getProcedure (name, options, default_val): TypeProcedure {
const obj = {
    name,
    options,
    default: default_val,

    getString: () => `string`,
    getMySQLType: () => `varchar(${options.limit})`,

    knex_handle: {
        create: (table: Knex.CreateTableBuilder, field: string): Knex.ColumnBuilder => {
            let builder = table.string(field, options.limit)
            if (obj.default)
                builder.defaultTo(this.default);
            return builder;
        },
        alter:  (table: Knex.AlterTableBuilder, field: string): Knex.ColumnBuilder => {
            let builder = table.string(field, options.limit)
            if (obj.default)
                builder.defaultTo(this.default);
            return builder;
        }
    }
}

return obj;
}

export default {type: 'string', getProcedure};