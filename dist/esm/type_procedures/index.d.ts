import { Knex } from "knex";
export interface TypeProcedure {
    name: string;
    options: any;
    getString: () => string;
    getMySQLType: () => string;
    knex_handle: {
        create: (table: Knex.CreateTableBuilder, field: string) => Knex.ColumnBuilder;
        alter: (table: Knex.AlterTableBuilder, field: string) => Knex.ColumnBuilder;
    };
}
declare const _default: {
    getTypeProcedure: (type_string: string, field: string, options: any) => any;
};
export default _default;
