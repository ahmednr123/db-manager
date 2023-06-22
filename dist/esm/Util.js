import { Constraints } from "./Table";
export const ID_COL_NAME = "_id";
function getIDColumnSchemaDefault(field_name, is_primary) {
    const obj = {
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
    knexBinaryToUUID: (knex, column) => {
        return knex.raw(`BIN_TO_UUID(??) as ${column}`, [column]);
    },
    knexUUIDToBinary: (knex, uuid) => {
        return knex.raw(`UUID_TO_BIN('${uuid}')`);
    },
    getIDColumnSchema: () => {
        return getIDColumnSchemaDefault(ID_COL_NAME, true);
    },
    getIDRefSchema: ({ field_name, foreign_table, }, constraints) => {
        let obj = getIDColumnSchemaDefault(field_name, false);
        obj.foreign = {
            table: foreign_table,
            column: ID_COL_NAME,
        };
        if (constraints) {
            obj.constraints = JSON.parse(JSON.stringify(constraints));
        }
        return obj;
    },
    getIDNRefSchema: (field_name, constraints) => {
        let obj = getIDColumnSchemaDefault(field_name, false);
        if (constraints) {
            obj.constraints = JSON.parse(JSON.stringify(constraints));
        }
        return obj;
    },
};
//# sourceMappingURL=Util.js.map