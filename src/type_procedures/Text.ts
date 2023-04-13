import { Knex } from "knex";
import { TypeProcedure } from ".";

function getProcedure (name, options): TypeProcedure {
const obj = {
    name,
    options,

    getString: () => `text`,
    getMySQLType: () => `text`,

    knex_handle: {
        create: (table: Knex.CreateTableBuilder, field: string): Knex.ColumnBuilder => {
            return table.text(field);
        },
        alter:  (table: Knex.AlterTableBuilder, field: string): Knex.ColumnBuilder => {
            return table.text(field);
        }
    }
}

return obj;
}

export default {type: 'text', getProcedure};