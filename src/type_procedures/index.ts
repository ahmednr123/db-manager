import { Knex } from "knex";
import { ColumnSchema } from "../Table";

import String from "./String";
import Number from "./Number";
import Enum from "./Enum";
import DateTime from "./DateTime";

export interface TypeProcedure {
    options: any,

    getString: () => string,
    getMySQLType: () => string,

    matchMySQLDesc: (mysql_type: string) => boolean,
    parseMySQLDesc: (mysql_schema: any) => {name: string, options?: any},

    knex_handle: {
        create: (table: Knex.CreateTableBuilder, field: string) => void,
        alter:  (table: Knex.AlterTableBuilder,  field: string) => void
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
    getTypeProcedure: (type_string: string, options: any) => {
        const procedure = TypeProcedures.find((procedure) => procedure.type == type_string);
        return procedure.getProcedure(options);
    }
}

//What to do with options?