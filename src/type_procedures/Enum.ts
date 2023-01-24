import { Knex } from "knex";
import { TypeProcedure } from ".";
import { ColumnSchema } from "../Table";

function getProcedure (options): TypeProcedure {
const obj = {
    options,
    getString: () => `enum`,
    getMySQLType: () => `Enum(${options.enums.map(e => `'${e}'`).join(',')})`,
    matchMySQLDesc: (mysql_type: string) => false,
    parseMySQLDesc: (mysql_schema: any) => {
        return {name: 'enum'}
    },
    knex_handle: {
        create: (table: Knex.CreateTableBuilder, field: string) => {},
        alter:  (table: Knex.AlterTableBuilder, field: string) => {}
    }
}

return obj;
}

export default {type: 'enum', getProcedure};