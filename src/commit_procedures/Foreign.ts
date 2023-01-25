import { CommitActionProcedure, CommitType } from ".";
import { Diff } from "../SchemaDiffer";

const add = (table, diff: Diff, raw_cmds) => {
    let foreign_ref = diff.new as {table: string, column: string};
    table.foreign(diff.column_name).references(`${foreign_ref.table}.${foreign_ref.column}`);
}

const remove = (table, diff: Diff, raw_cmds) => {
    table.dropForeign(diff.column_name);
}

const update = (table, diff: Diff, raw_cmds) => {
    let foreign_ref = diff.new as {table: string, column: string};
    try {
        table.dropForeign(diff.column_name);
    } catch (error) {
        console.log(new Error(`Error while dropping foreign constraint for: table="${diff.table_name}", column="${diff.column_name}"`));
    } finally {
        // Below could throw error.
        // Please handle this later.
        table.foreign(diff.column_name).references(`${foreign_ref.table}.${foreign_ref.column}`);
    }
}

const diffAction: CommitActionProcedure = {type: CommitType.FOREIGN, add, remove, update};
export default diffAction;