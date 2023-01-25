import { CommitActionProcedure, CommitType } from ".";
import { Diff } from "../SchemaDiffer";
import { ColumnSchema } from "../Table";
import TypeProcedureSupport, { TypeProcedure } from "../type_procedures";
import { addConstraints } from "./Constraints";

const add = (table, diff: Diff, raw_cmds) => {
    let column_schema = diff.new as ColumnSchema;
    let type_procedure: TypeProcedure = TypeProcedureSupport.getTypeProcedure(column_schema.type.name, column_schema.name, column_schema.type.options, column_schema.default);
    type_procedure.knex_handle.create(table, column_schema.name);
    addConstraints(table, diff, column_schema.constraints, type_procedure, raw_cmds);
    if (column_schema.foreign) {
        table.foreign(column_schema.name).references(`${column_schema.foreign.table}.${column_schema.foreign.column}`);
    }
}

const remove = (table, diff: Diff, raw_cmds) => {
    let column_name = diff.column_name;
    table.dropColumn(column_name);
}

const update = (table, diff: Diff, raw_cmds) => {
    throw new Error(`CommitAction.UPDATE is not supported for CommitType.COLUMN`);
}

const diffAction: CommitActionProcedure = {type: CommitType.COLUMN, add, remove, update};
export default diffAction;