import { Knex } from "knex";
import { CommitActionProcedure, CommitType } from ".";
import { Diff } from "../SchemaDiffer";
import { Constraints } from "../Table";
import { Database } from "../Database";
import TypeProcedureSupport, { TypeProcedure } from "../type_procedures";

// Not sure if getting type_procedure this way is a good idea
// We had to change a few things to make it happen, so check once again before release.

export function addConstraints (table, diff: Diff, constraints, type_procedure, raw_cmds) {
    for (let constraint of constraints) {
        switch (constraint) {
        case Constraints.NOT_NULL:
            table.setNullable(diff.column_name);
            break;
        case Constraints.PRIMARY_KEY:
            table.primary([diff.column_name]);
            break;
        case Constraints.UNIQUE_KEY:
            table.unique([diff.column_name]);
            break;
        case Constraints.AUTO_INCREMENT:
            //auto_increment (add to an array to run knex.raw commands later)
            raw_cmds.push(async function (knex: Knex) {
                // Check if default is required while doing this
                await knex.raw(`ALTER TABLE ${diff.table_name} MODIFY COLUMN ${type_procedure.getMySQLType()} auto_increment`);
            });
            break;
        }
    }
}

export function removeConstraints (table, diff: Diff, constraints, type_procedure, raw_cmds) {
    for (let constraint of constraints) {
        switch (constraint) {
        case Constraints.NOT_NULL:
            table.dropNullable(diff.column_name);
            break;
        case Constraints.PRIMARY_KEY:
            table.dropPrimary([diff.column_name]);
            break;
        case Constraints.UNIQUE_KEY:
            table.dropUnique([diff.column_name]);
            break;
        case Constraints.AUTO_INCREMENT:
            //auto_increment (add to an array to run knex.raw commands later)
            raw_cmds.push(async function (knex: Knex) {
                // Check if default is required while doing this
                await knex.raw(`ALTER TABLE ${diff.table_name} MODIFY COLUMN ${type_procedure.getMySQLType()}`);
            });
            break;
        }
    }
}

const add = (table, diff: Diff, raw_cmds) => {
    let column_type = Database.getDatabase(diff.db_name).getConceptualTable(diff.table_name).getColumnType(diff.column_name);
    let type_procedure: TypeProcedure = TypeProcedureSupport.getTypeProcedure(column_type.name, diff.column_name, column_type.options);

    let constraints = diff.new as Array<string | number>;
    addConstraints(table, diff, constraints, type_procedure, raw_cmds);
}

const remove = (table, diff: Diff, raw_cmds) => {
    let column_type = Database.getDatabase(diff.db_name).getConceptualTable(diff.table_name).getColumnType(diff.column_name);
    let type_procedure: TypeProcedure = TypeProcedureSupport.getTypeProcedure(column_type.name, diff.column_name, column_type.options);

    let constraints = diff.old as Array<string | number>;
    removeConstraints(table, diff, constraints, type_procedure, raw_cmds);
}

const update = (table, diff: Diff, raw_cmds) => {    
    let column_type = Database.getDatabase(diff.db_name).getConceptualTable(diff.table_name).getColumnType(diff.column_name);
    let type_procedure: TypeProcedure = TypeProcedureSupport.getTypeProcedure(column_type.name, diff.column_name, column_type.options);

    let remove_constraints = diff.old as Array<string | number>;
    removeConstraints(table, diff, remove_constraints, type_procedure, raw_cmds);

    let add_constraints = diff.new as Array<string | number>;
    addConstraints(table, diff, add_constraints, type_procedure, raw_cmds);
}

const diffAction: CommitActionProcedure = {type: CommitType.CONSTRAINTS, add, remove, update};
export default diffAction;