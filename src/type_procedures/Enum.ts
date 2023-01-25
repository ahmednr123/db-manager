import { Knex } from "knex";
import { TypeProcedure } from ".";

/**
 * The extract methods are done in a hurry, sorry about that,
 * building a working prototype ASAP is more important right now.
 */
const extractEnums     = (type) : Array<any> => {
    // This method completely ignores comma and close bracket inside the string.
    let arr: any = [];
    let insides = type.split('(')[1].split(')')[0];
    let enums = insides.split(',');
    for (let e of enums) {
        if (e[0] == "'" || e[0] == '"') {
            arr.push(e.slice(1, e.length-1));
        }
    }
    return arr;
}

function getProcedure (name, options, default_val): TypeProcedure {
const obj = {
    name,
    options,
    default: default_val,

    getString: () => `enum`,
    getMySQLType: () => `Enum(${options.enums.map(e => `'${e}'`).join(',')})`,
    matchMySQLDesc: (mysql_type: string) => mysql_type.includes('enum'),
    parseMySQLDesc: (mysql_schema: any) => {
        return {name: 'enum', enums: extractEnums(mysql_schema['Type'])}
    },
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