import commitProcedure from "./CommitProcedure";
import dbConfig from "./DBConfig";
import table, { 
    SubTable as subTable, 
    Constraints as constraints, 
    TableSchema as tableSchema, 
    ColumnSchema as columnSchema
} from "./Table";
import util from "./Util";

import Binary from "./type_procedures/Binary";
import String from "./type_procedures/String";
import Number from "./type_procedures/Number";
import Enum from "./type_procedures/Enum";
import DateTime from "./type_procedures/DateTime";
import typeProcedure from "./type_procedures";

export const CommitProcedure = commitProcedure;
export const DBConfig = dbConfig;
export const Table = table;
    export const SubTable = subTable;
    export const Constraints = constraints;
    export interface TableSchema extends tableSchema{};
    export interface ColumnSchema extends columnSchema{};
export const Util = util;

export const Type = {
    Binary,
    String,
    Number,
    Enum,
    DateTime
}

export const TypeProcedure = typeProcedure;