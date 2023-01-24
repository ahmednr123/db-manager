import { Knex } from "knex";
import { Diff } from "./SchemaDiffer";
import CommitProcedure, { CommitAction, CommitActionProcedure, CommitType } from './commit_procedures/index'
import { Constraints, TableSchema } from "./Table";
import TypeProcedureSupport, { TypeProcedure } from "./type_procedures";

function splitDiffByTable (diff_arr: Array<Diff>) {
    let table_commits = [];
    let table_with_diffs: Array<{table: string, diff: Array<Diff>}> = [];

    for (let diff of diff_arr) {
        if (diff.type == CommitType.TABLE) {
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
    let raw_cmds: Array<(knex: Knex) => void> = [];
    let diff_split = splitDiffByTable(diff_arr);

    for (let diff of diff_split.table_commits) {
        if (diff.action == CommitAction.ADD) {
            await knex.schema.createTable(diff.table_name, (table) => {
                let table_schema = diff.new as TableSchema;
                for (let col of table_schema.columns) {
                    let type_procedure: TypeProcedure = TypeProcedureSupport.getTypeProcedure(col.type.name, col.name, col.type.options, col.default);
                    type_procedure.knex_handle.create(table, col.name);

                    // constraints
                    for (let constraint of col.constraints) {
                        switch (constraint) {
                        case Constraints.NOT_NULL:
                            table.setNullable(col.name);
                            break;
                        case Constraints.PRIMARY_KEY:
                            table.primary([col.name]);
                            break;
                        case Constraints.UNIQUE_KEY:
                            table.unique([col.name]);
                            break;
                        case Constraints.AUTO_INCREMENT:
                            //auto_increment (add to an array to run knex.raw commands later)
                            raw_cmds.push(async function (knex: Knex) {
                                // Check if default is required while doing this
                                await knex.raw(`ALTER TABLE ${diff.table} MODIFY COLUMN ${type_procedure.getMySQLType()} auto_increment`);
                            });
                            break;
                        }
                    }

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
                    procedure.add(table, diff);
                    break;
                case CommitAction.REMOVE:
                    procedure.remove(table, diff);
                    break;
                case CommitAction.UPDATE:
                    procedure.update(table, diff);
                    break;
                }
            }
        });
    }
}