import { Knex } from "knex";
import { IDiffAction } from ".";
import { Diff } from "../SchemaDiffer";

function commit (knex: Knex, diff: Diff) {
    handleRawKnexConstraints(knex, [diff.value as string], diff);

    knex.schema.alterTable(diff.table, (table) => {
        handleAlterKnexConstraints(table, [diff.value as string], diff);
    });
}

export function handleRawKnexConstraints (knex: Knex, constraints: Array<String>, diff: Diff) {
    for (let constraint of constraints) {
        if (constraint == 'AUTO_INCREMENT') {
            // TODO: fix bad design
            // diff.column_schema.type.getMysqlType(diff.column_schema)
            // the same object is passed to the function of that object
            // looks like a bad design, find a solution before release
            knex.raw(`ALTER TABLE ${diff.table} MODIFY COLUMN ${diff.column_schema.type.getMysqlType(diff.column_schema)} auto_increment`);
            return;
        }
    }
}

export function handleAlterKnexConstraints (table: Knex.AlterTableBuilder, constraints: Array<String>, diff: Diff) {
    for (let constraint of constraints) {
        switch (constraint) {
        case 'UNIQUE_KEY':
            table.unique([diff.column]);
            break;
        case 'PRIMARY_KEY':
            table.primary([diff.column], {constraintName: diff.column + '_primary'});
            break;
        case 'NOT_NULL':
            table.setNullable(diff.column);
            break;
        }
    }
}

/**
 *  export enum Constraints {
        UNIQUE_KEY,
        PRIMARY_KEY,
        NOT_NULL,
        AUTO_INCREMENT
    }
 */

const action: IDiffAction = { commit };

export default action;