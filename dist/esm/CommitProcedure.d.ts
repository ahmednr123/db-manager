import { Knex } from "knex";
import { TableSchema } from "./Table";
declare const _default: {
    commitTable: (table_schema: TableSchema, knex_handle: Knex) => Promise<void>;
};
export default _default;
