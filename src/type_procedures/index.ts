import { Knex } from "knex";
import { ColumnSchema } from "../Table";

import String from "./String";
import Number from "./Number";
import Enum from "./Enum";
import DateTime from "./DateTime";

export interface TypeProcedure {
    name: string,
    options: any,
    default: string | number,

    getString: () => string,
    getMySQLType: () => string,

    matchMySQLDesc: (mysql_type: string) => boolean,
    parseMySQLDesc: (mysql_schema: any) => {name: string, options?: any},

    knex_handle: {
        create: (table: Knex.CreateTableBuilder, field: string) => Knex.ColumnBuilder,
        alter:  (table: Knex.AlterTableBuilder,  field: string) => Knex.ColumnBuilder
    }
}

const TypeProcedures: Array<any> = [
    String,
    Number,
    DateTime,
    Enum
]

export default {
    matchTypeProcedure: (mysql_type: string) => { // For parsing procedure
        const procedure = TypeProcedures.find((procedure) => procedure.matchMySQLDesc(mysql_type));
        return procedure.getProcedure(null);
    },
    getTypeProcedure: (type_string: string, field: string, options: any, default_val?: any) => {
        const procedure = TypeProcedures.find((procedure) => procedure.type == type_string);
        return procedure.getProcedure(field, options, default_val);
    }
}

//What to do with options?