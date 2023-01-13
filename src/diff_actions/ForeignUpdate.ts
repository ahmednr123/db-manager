import { Knex } from "knex";
import { IDiffAction } from ".";
import { Diff } from "../SchemaDiffer";

function commit (knex: Knex, diff: Diff) {
    knex.schema.table(diff.table, async (table) => {
        const old_value = diff.old_value as {table:string, column:string};
        const new_value = diff.new_value as {table:string, column:string};
        try {
            table.dropForeign(diff.column);
        } catch (error) {
            console.log(new Error(`Error while dropping foreign constraint: table="${old_value.table}", column="${old_value.column}"`));
        } finally {
            // Below could throw error.
            // Please handle this later.
            table.foreign(diff.column)
                .references(`${new_value.table}.${new_value.column}`)
        }
    });
}

const action: IDiffAction = { commit };

export default action;