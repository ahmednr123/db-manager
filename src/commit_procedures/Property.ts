import { CommitAction, CommitActionProcedure, CommitType } from ".";
import { Database } from "../Database";
import { Diff } from "../SchemaDiffer";
import TypeProcedureSupport, { TypeProcedure } from "../type_procedures";

function propertyAlter (table, diff: Diff, commitAction: CommitAction) {
    let prop_value_obj = (commitAction == CommitAction.REMOVE ? diff.old: diff.new) as {property: string, value: any};
    switch (prop_value_obj.property) {
    case 'type': {
        if (commitAction != CommitAction.UPDATE) 
            throw new Error(`TYPE property doesnt support ${commitAction}`);
        let type_obj = prop_value_obj.value as {name: string, options: any};
        let type_procedure: TypeProcedure = TypeProcedureSupport.getTypeProcedure(type_obj.name, diff.column_name, type_obj.options);
        type_procedure.knex_handle.alter(table, diff.column_name);
        break;
    }
    case 'default': {
        let column_type = Database.getDatabase(diff.db_name).getConceptualTable(diff.table_name).getColumnType(diff.column_name);
        let type_procedure: TypeProcedure = TypeProcedureSupport.getTypeProcedure(column_type.name, diff.column_name, column_type.options);
        type_procedure.knex_handle.alter(table, diff.column_name).defaultTo(commitAction == CommitAction.REMOVE ? null : prop_value_obj.value);
        break;
    }
    }
}

const add = (table, diff: Diff, raw_cmds) => {
    propertyAlter(table, diff, CommitAction.ADD);
}

const remove = (table, diff: Diff, raw_cmds) => {
    propertyAlter(table, diff, CommitAction.REMOVE);
}

const update = (table, diff: Diff, raw_cmds) => {
    propertyAlter(table, diff, CommitAction.UPDATE);
}

const diffAction: CommitActionProcedure = {type: CommitType.PROPERTY, add, remove, update};
export default diffAction;