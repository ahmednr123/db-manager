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
            return table.enu(field, options.enums);
        },
        alter:  (table: Knex.AlterTableBuilder, field: string): Knex.ColumnBuilder => {
            return table.enu(field, options.enums);
        }
    }
}

return obj;
}

export default {type: 'enum', getProcedure};