import { Knex } from "knex";
import { TypeProcedure } from ".";

function getProcedure(name: string, options: any): TypeProcedure {
  const obj = {
    name,
    options,

    getString: () => `enum`,
    getMySQLType: () =>
      `Enum(${options.enums.map((e: any) => `'${e}'`).join(",")})`,

    knex_handle: {
      create: (
        table: Knex.CreateTableBuilder,
        field: string
      ): Knex.ColumnBuilder => {
        return table.enu(field, options.enums);
      },
      alter: (
        table: Knex.AlterTableBuilder,
        field: string
      ): Knex.ColumnBuilder => {
        return table.enu(field, options.enums);
      },
    },
  };

  return obj;
}

export default { type: "enum", getProcedure };
