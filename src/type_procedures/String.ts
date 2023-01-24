import { Knex } from "knex";
import { TypeProcedure } from ".";
import { ColumnSchema } from "../Table";

function getProcedure (options): TypeProcedure {
const obj = {
    options,
    getString: () => `string`,
    getMySQLType: () => `varchar(${options.limit})`,
    matchMySQLDesc: (mysql_type: string) => mysql_type.includes('varchar'),
    parseMySQLDesc: (mysql_schema: any) => {
        return {name: 'string'};
    },
    knex_handle: {
        create: (table: Knex.CreateTableBuilder, field: string) => {},
        alter:  (table: Knex.AlterTableBuilder, field: string) => {}
    }
}

return obj;
}

export default {type: 'string', getProcedure};