import knex, { Knex } from "knex";
import { Diff } from "./SchemaDiffer";
import { ColumnSchema } from "./Table";

export function commitDiff (knex: Knex, diff: Diff) {
    diff.action.commit(knex, diff);
}

//VOTES

//NOTES

//TAGS

//PUBLISH

//VERSIONING