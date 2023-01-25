import { Knex } from "knex";
import { TypeProcedure } from ".";

const extractStrLength = (type) : string => type.split('(')[1].split(')')[0];

function getProcedure (name, options, default_val): TypeProcedure {
const obj = {
    name,
    options,
    default: default_val,

    getString: () => `string`,
    getMySQLType: () => `varchar(${options.limit})`,
    matchMySQLDesc: (mysql_type: string) => mysql_type.includes('varchar'),
    parseMySQLDesc: (mysql_schema: any) => {
        return {name: 'string', options: {limit: parseInt(extractStrLength(mysql_schema))}};
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