import { Knex } from "knex";
import { Diff } from "./SchemaDiffer";
import CommitProcedure, { CommitAction, CommitActionProcedure, CommitType } from './commit_procedures/index'
import { TableSchema } from "./Table";
import TypeProcedureSupport, { TypeProcedure } from "./type_procedures";
import { addConstraints } from "./commit_procedures/Constraints";

function splitDiffByTable (diff_arr: Array<Diff>) {
    let table_commits = [];
    let table_with_diffs: Array<{table: string, diff: Array<Diff>}> = [];

    for (let diff of diff_arr) {
        if (diff.type == CommitType.TABLE) {
            // Segregating TABLE commit type as these are the only ones that use CREATE type
            // This is mainly done for REMOVE action, where knex.schema.dropTable is directly run
            table_commits.push(diff);
        } else {
            let table_diff_obj = table_with_diffs.find(elem => elem.table == diff.table_name);
            if (table_diff_obj == null) {
                table_diff_obj = {table: diff.table_name, diff: []};
                table_with_diffs.push(table_diff_obj);
            }
            table_diff_obj.diff.push(diff);
        }
    }
    
    return {
        table_commits,
        table_with_diffs
    }
}

export async function commitDiff (knex: Knex, diff_arr: Array<Diff>) {
    // TODO: Add everything in a transaction
    let raw_cmds: Array<() => void> = [];
    let diff_split = splitDiffByTable(diff_arr);

    for (let diff of diff_split.table_commits) {
        if (diff.action == CommitAction.ADD) {
            await knex.schema.createTable(diff.table_name, (table) => {
                let table_schema = diff.new as TableSchema;
                for (let col of table_schema.columns) {
                    let type_procedure: TypeProcedure = TypeProcedureSupport.getTypeProcedure(col.type.name, col.name, col.type.options, col.default);
                    type_procedure.knex_handle.create(table, col.name);

                    // constraints
                    addConstraints(table, diff, col.constraints, type_procedure, raw_cmds);

                    // foreign
                    if (col.foreign) {
                        table.foreign(col.name).references(`${col.foreign.table}.${col.foreign.column}`);
                    }
                }
            });
        } else if (diff.action == CommitAction.REMOVE) {
            await knex.schema.dropTable(diff.table_name);
        }
    }

    for (let table_diff of diff_split.table_with_diffs) {
        await knex.schema.alterTable(table_diff.table, (table) => {
            for (let diff of table_diff.diff) {
                let procedure: CommitActionProcedure = CommitProcedure.getCommitProcedure(diff.type);
                switch (diff.action) {
                case CommitAction.ADD:
                    procedure.add(table, diff, raw_cmds);
                    break;
                case CommitAction.REMOVE:
                    procedure.remove(table, diff, raw_cmds);
                    break;
                case CommitAction.UPDATE:
                    procedure.update(table, diff, raw_cmds);
                    break;
                }
            }
        });
    }

    for (let raw_cmd of raw_cmds) {
        raw_cmd();
    }
}