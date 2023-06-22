"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getProcedure(name, options) {
    const obj = {
        name,
        options,
        getString: () => `enum`,
        getMySQLType: () => `Enum(${options.enums.map((e) => `'${e}'`).join(",")})`,
        knex_handle: {
            create: (table, field) => {
                return table.enu(field, options.enums);
            },
            alter: (table, field) => {
                return table.enu(field, options.enums);
            },
        },
    };
    return obj;
}
exports.default = { type: "enum", getProcedure };
//# sourceMappingURL=Enum.js.map