import { Knex } from "knex";
import { IDiffAction } from ".";
import { Diff } from "../SchemaDiffer";

function commit (knex: Knex, diff: Diff) {
    knex.schema.table(diff.table, (table) => {
        table.dropColumn(diff.column);
    });
}

const action: IDiffAction = { commit };

export default action;