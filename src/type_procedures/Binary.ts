import { Knex } from "knex";
import { TypeProcedure } from ".";

function getProcedure (name, options): TypeProcedure {
const obj = {
    name,
    options,

    getString: () => `binary`,
    getMySQLType: () => `varbinary(${options.limit})`,

    knex_handle: {
        create: (table: Knex.CreateTableBuilder, field: string): Knex.ColumnBuilder => {
            return table.binary(field, options.limit);
        },
        alter:  (table: Knex.AlterTableBuilder, field: string): Knex.ColumnBuilder => {
            return table.binary(field, options.limit);
        }
    }
}

return obj;
}

export default {type: 'binary', getProcedure};