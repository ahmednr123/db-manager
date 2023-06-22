import { Knex } from "knex";
import { TypeProcedure } from ".";

function getProcedure(name: string, options: any): TypeProcedure {
  const obj = {
    name,
    options,

    getString: () => `string`,
    getMySQLType: () => `varchar(${options.limit})`,

    knex_handle: {
      create: (
        table: Knex.CreateTableBuilder,
        field: string
      ): Knex.ColumnBuilder => {
        return table.string(field, options.limit);
      },
      alter: (
        table: Knex.AlterTableBuilder,
        field: string
      ): Knex.ColumnBuilder => {
        return table.string(field, options.limit);
      },
    },
  };

  return obj;
}

export default { type: "string", getProcedure };
