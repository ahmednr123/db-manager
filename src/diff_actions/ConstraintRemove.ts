import { Knex } from "knex";
import { IDiffAction } from ".";
import { Diff } from "../SchemaDiffer";

function commit (knex: Knex, diff: Diff) {
    if (diff.value == 'AUTO_INCREMENT') {
        // TODO: fix bad design
        // diff.column_schema.type.getMysqlType(diff.column_schema)
        // the same object is passed to the function of that object
        // looks like a bad design, find a solution before release
        knex.raw(`ALTER TABLE ${diff.table} MODIFY COLUMN ${diff.column_schema.type.getMysqlType(diff.column_schema)}`);
        return;
    }

    knex.schema.alterTable(diff.table, (table) => {
        switch (diff.value) {
        case 'UNIQUE_KEY':
            table.dropUnique([diff.column]);
            break;
        case 'PRIMARY_KEY':
            table.dropPrimary(diff.column + '_primary');
            break;
        case 'NOT_NULL':
            table.dropNullable(diff.column);
            break;
        }
    });
}

const action: IDiffAction = { commit };

export default action;