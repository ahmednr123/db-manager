import knex, { Knex } from "knex";
import { Diff } from "./SchemaDiffer";
import { ColumnSchema, FieldType } from "./Table";

export const enum DiffAction {
    TABLE_ADD,
    TABLE_REMOVE,
    COLUMN_ADD,
    COLUMN_REMOVE,
    PROPERTY_ADD,
    PROPERTY_REMOVE,
    CONSTRAINT_ADD,
    CONSTRAINT_REMOVE,
    FOREIGN_UPDATE,
    VALUE_UPDATE
}

export function commitDiff (knex: Knex, diff: Diff) {
    switch (diff.action) {
        case DiffAction.TABLE_ADD:
        {
            const schema = diff.table_schema;
            knex.schema.createTable(diff.table, (table) => {
                for (let column_schema of schema.columns) {
                    handleKnexTable(table, column_schema);
                }
            });
            break;
        }
        case DiffAction.TABLE_REMOVE:
            knex.schema.dropTable(diff.table);
            break;
        case DiffAction.COLUMN_ADD:
        {
            const schema = diff.column_schema;
            knex.schema.table(diff.table, (table) => {
                handleKnexTable(table, schema);
            });
            break;
        }
        case DiffAction.COLUMN_REMOVE:
        {
            knex.schema.table(diff.table, (table) => {
                table.dropColumn(diff.column);
            });
            break;
        }
        case DiffAction.PROPERTY_ADD:
            break;
        case DiffAction.PROPERTY_REMOVE:
            break;
        case DiffAction.CONSTRAINT_ADD:
            break;
        case DiffAction.CONSTRAINT_REMOVE:
            break;
        case DiffAction.FOREIGN_UPDATE:
        {
            knex.schema.table(diff.table, async (table) => {
                const old_value = diff.old_value as {table:string, column:string};
                const new_value = diff.new_value as {table:string, column:string};
                try {
                    table.dropForeign(diff.column);
                } catch (error) {
                    console.log(new Error(`Error while dropping foreign constraint: table="${old_value.table}", column="${old_value.column}"`));
                } finally {
                    // Below could throw error.
                    // Please handle this later.
                    table.foreign(diff.column)
                        .references(`${new_value.table}.${new_value.column}`)
                }
            });
            break;
        }
        case DiffAction.VALUE_UPDATE:
            break;
    }
}

function handleKnexProperty (table, property, value) {

}

function handleKnexTable (table, column_schema: ColumnSchema) {
    // Handle sizes
    switch (column_schema.type) {
    case FieldType.INTEGER:
        table.integer(column_schema.name);
        break;
    case FieldType.BIG_INTEGER:
        table.bigInteger(column_schema.name);
        break;
    case FieldType.STRING:
        table.string(column_schema.name);
        break;
    case FieldType.ENUM:
        table.enum(column_schema.name, column_schema.enums);
        break;
    }
}

//VOTES

//NOTES

//TAGS

//PUBLISH

//VERSIONING