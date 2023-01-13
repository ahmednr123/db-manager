import { Knex } from "knex";
import { IDiffAction } from ".";
import { Diff } from "../SchemaDiffer";

function commit (knex: Knex, diff: Diff) {
    knex.schema.dropTable(diff.table);
}

const action: IDiffAction = { commit };

export default action;