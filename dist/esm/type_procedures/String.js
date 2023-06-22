function getProcedure(name, options) {
    const obj = {
        name,
        options,
        getString: () => `string`,
        getMySQLType: () => `varchar(${options.limit})`,
        knex_handle: {
            create: (table, field) => {
                return table.string(field, options.limit);
            },
            alter: (table, field) => {
                return table.string(field, options.limit);
            },
        },
    };
    return obj;
}
export default { type: "string", getProcedure };
//# sourceMappingURL=String.js.map