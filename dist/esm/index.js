import commitProcedure from "./CommitProcedure";
export { DBConfig } from "./DBConfig";
import table, { SubTable as subTable, Constraints as constraints, } from "./Table";
import util from "./Util";
import Binary from "./type_procedures/Binary";
import String from "./type_procedures/String";
import Number from "./type_procedures/Number";
import Enum from "./type_procedures/Enum";
import DateTime from "./type_procedures/DateTime";
import typeProcedure from "./type_procedures";
export const CommitProcedure = commitProcedure;
//export class DBConfig extends dbConfig {};
export const Table = table;
export const SubTable = subTable;
export const Constraints = constraints;
export const Util = util;
export const Type = {
    Binary,
    String,
    Number,
    Enum,
    DateTime,
};
export const TypeProcedure = typeProcedure;
//# sourceMappingURL=index.js.map