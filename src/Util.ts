import { ColumnSchema, Constraints, TableSchema } from "./Table";

const id_col_name = '_id';

function getIDColumnSchemaDefault (field_name, is_primary): ColumnSchema {
    const obj: ColumnSchema = {
        name: field_name,
        type: {
            name: "binary",
            options: {
                limit: 16,
            }
        }
    };

    if (is_primary) {
        obj.default = '_uuid_binary_';
        obj.constraints = [
            Constraints.PRIMARY_KEY
        ]
    }

    return obj;
}

export default {
    getIDColumnSchema: (): ColumnSchema => {
        return getIDColumnSchemaDefault(id_col_name, true);
    },

    getIDRefSchema: ({field_name, foreign_table}, constraints?: Constraints[]): ColumnSchema => {
        let obj: ColumnSchema = getIDColumnSchemaDefault(field_name, true);

        obj.foreign = {
            table: foreign_table,
            column: id_col_name
        }

        if (constraints) {
            obj.constraints = JSON.parse(JSON.stringify(constraints));
        }

        return obj;
    },

    getIDNRefSchema: (field_name, constraints?: Constraints[]): ColumnSchema => {
        let obj: ColumnSchema = getIDColumnSchemaDefault(field_name, true);

        if (constraints) {
            obj.constraints = JSON.parse(JSON.stringify(constraints));
        }

        return obj;
    }
}