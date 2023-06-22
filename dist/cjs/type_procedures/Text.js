"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getProcedure(name, options) {
    const obj = {
        name,
        options,
        getString: () => `text`,
        getMySQLType: () => `text`,
        knex_handle: {
            create: (table, field) => {
                return table.text(field);
            },
            alter: (table, field) => {
                return table.text(field);
            },
        },
    };
    return obj;
}
exports.default = { type: "text", getProcedure };
//# sourceMappingURL=Text.js.map