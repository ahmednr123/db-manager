import { Knex } from "knex";

import String from "./String";
import Number from "./Number";
import Enum from "./Enum";
import DateTime from "./DateTime";

export interface TypeProcedure {
    name: string,
    options: any,
    default: any,

    getString: () => string,
    getMySQLType: () => string,

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
    getTypeProcedure: (type_string: string, field: string, options: any, default_val?: any) => {
        const procedure = TypeProcedures.find((procedure) => procedure.type == type_string);
        return procedure.getProcedure(field, options, default_val);
    }
}

//What to do with options?