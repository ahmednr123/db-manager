import { Knex } from "knex";
import { TypeProcedure } from ".";

function getProcedure (name, options, default_val): TypeProcedure {
const obj = {
    name,
    options,
    default: default_val,

    getString: () => `string`,
    getMySQLType: () => `varchar(${options.limit})`,
    matchMySQLDesc: (mysql_type: string) => mysql_type.includes('varchar'),
    parseMySQLDesc: (mysql_schema: any) => {
        return {name: 'string'};
    },
    knex_handle: {
        create: (table: Knex.CreateTableBuilder, field: string): Knex.ColumnBuilder => {
            return table.string(field, options.limit);
        },
        alter:  (table: Knex.AlterTableBuilder, field: string): Knex.ColumnBuilder => {
            return table.string(field, options.limit);
        }
    }
}

return obj;
}

export default {type: 'string', getProcedure};