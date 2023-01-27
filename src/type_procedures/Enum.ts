import { Knex } from "knex";
import { TypeProcedure } from ".";

function getProcedure (name, options, default_val): TypeProcedure {
const obj = {
    name,
    options,
    default: default_val,

    getString: () => `enum`,
    getMySQLType: () => `Enum(${options.enums.map(e => `'${e}'`).join(',')})`,

    knex_handle: {
        create: (table: Knex.CreateTableBuilder, field: string): Knex.ColumnBuilder => {
            let builder = table.enu(field, options.enums);
            if (obj.default)
                builder.defaultTo(obj.default);
            return builder;
        },
        alter:  (table: Knex.AlterTableBuilder, field: string): Knex.ColumnBuilder => {
            let builder = table.enu(field, options.enums);
            if (obj.default)
                builder.defaultTo(obj.default);
            return builder;
        }
    }
}

return obj;
}

export default {type: 'enum', getProcedure};