import { Knex } from "knex";
import { TypeProcedure } from ".";

// datetime.options { date_enabled, time_enabled, format }
// false && false => ???
// date_enabled => date
// time_enabled => time
// date_enalbed && time_enabled => datetime
// TODO: Have to add the above functionality

function getProcedure(name: string, options: any): TypeProcedure {
  const obj = {
    name,
    options,

    getString: () => `datetime`,
    getMySQLType: () => `datetime`,

    knex_handle: {
      create: (
        table: Knex.CreateTableBuilder,
        field: string
      ): Knex.ColumnBuilder => {
        return table.datetime(field);
      },
      alter: (
        table: Knex.AlterTableBuilder,
        field: string
      ): Knex.ColumnBuilder => {
        return table.datetime(field);
      },
    },
  };

  return obj;
}

export default { type: "datetime", getProcedure };
