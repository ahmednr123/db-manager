import { Knex } from "knex";
import { IDiffAction } from ".";
import { Diff } from "../SchemaDiffer";

function commit (knex: Knex, diff: Diff) {
    const schema = diff.column_schema;
    knex.schema.table(diff.table, (table) => {
        schema.type.alter(table, schema);
    });
}

const action: IDiffAction = { commit };

export default action;