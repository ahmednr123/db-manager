import { Knex } from "knex";
import { ColumnSchema, Constraints } from "./Table";
export declare const ID_COL_NAME = "_id";
declare const _default: {
    knexBinaryToUUID: (knex: Knex, column: string) => Knex.Raw<any>;
    knexUUIDToBinary: (knex: Knex, uuid: string) => Knex.Raw<any>;
    getIDColumnSchema: () => ColumnSchema;
    getIDRefSchema: ({ field_name, foreign_table, }: {
        field_name: string;
        foreign_table: string;
    }, constraints?: Constraints[]) => ColumnSchema;
    getIDNRefSchema: (field_name: any, constraints?: Constraints[]) => ColumnSchema;
};
export default _default;
