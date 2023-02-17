import { Knex } from "knex";

import Binary from "./Binary";
import String from "./String";
import Number from "./Number";
import Enum from "./Enum";
import DateTime from "./DateTime";

export interface TypeProcedure {
    name: string,
    options: any,

    getString: () => string,
    getMySQLType: () => string,

    knex_handle: {
        create: (table: Knex.CreateTableBuilder, field: string) => Knex.ColumnBuilder,
        alter:  (table: Knex.AlterTableBuilder,  field: string) => Knex.ColumnBuilder
    }
}

const TypeProcedures: Array<any> = [
    Binary,
    String,
    Number,
    DateTime,
    Enum
]

export default {
    getTypeProcedure: (type_string: string, field: string, options: any) => {
        const procedure = TypeProcedures.find((procedure) => procedure.type == type_string);
        return procedure.getProcedure(field, options);
    }
}

//What to do with options?