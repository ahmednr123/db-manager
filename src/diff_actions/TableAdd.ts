import { Knex } from "knex";
import { IDiffAction } from ".";
import { Diff } from "../SchemaDiffer";

function commit (knex: Knex, diff: Diff) {
    const schema = diff.table_schema;
    knex.schema.createTable(diff.table, (table) => {
        for (let column_schema of schema.columns) {
            column_schema.type.create(table, column_schema);
        }
    });
}

const action: IDiffAction = { commit };

export default action;