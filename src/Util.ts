import { Knex } from "knex";
import { ColumnSchema, Constraints } from "./Table";

export const ID_COL_NAME = "_id";

function getIDColumnSchemaDefault(
  field_name: string,
  is_primary: boolean
): ColumnSchema {
  const obj: ColumnSchema = {
    name: field_name,
    type: {
      name: "binary",
      options: {
        limit: 16,
      },
    },
  };

  if (is_primary) {
    obj.default = "_uuid_binary_";
    obj.constraints = [Constraints.PRIMARY_KEY];
  }

  return obj;
}

export default {
  knexBinaryToUUID: (knex: Knex, column: string) => {
    return knex.raw(`BIN_TO_UUID(??) as ${column}`, [column]);
  },

  knexUUIDToBinary: (knex: Knex, uuid: string) => {
    return knex.raw(`UUID_TO_BIN('${uuid}')`);
  },

  getIDColumnSchema: (): ColumnSchema => {
    return getIDColumnSchemaDefault(ID_COL_NAME, true);
  },

  getIDRefSchema: (
    {
      field_name,
      foreign_table,
    }: { field_name: string; foreign_table: string },
    constraints?: Constraints[]
  ): ColumnSchema => {
    let obj: ColumnSchema = getIDColumnSchemaDefault(field_name, false);

    obj.foreign = {
      table: foreign_table,
      column: ID_COL_NAME,
    };

    if (constraints) {
      obj.constraints = JSON.parse(JSON.stringify(constraints));
    }

    return obj;
  },

  getIDNRefSchema: (
    field_name: any,
    constraints?: Constraints[]
  ): ColumnSchema => {
    let obj: ColumnSchema = getIDColumnSchemaDefault(field_name, false);

    if (constraints) {
      obj.constraints = JSON.parse(JSON.stringify(constraints));
    }

    return obj;
  },
};
