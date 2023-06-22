function getProcedure(name, options) {
    const obj = {
        name,
        options,
        getString: () => `binary`,
        getMySQLType: () => `varbinary(${options.limit})`,
        knex_handle: {
            create: (table, field) => {
                return table.binary(field, options.limit);
            },
            alter: (table, field) => {
                return table.binary(field, options.limit);
            },
        },
    };
    return obj;
}
export default { type: "binary", getProcedure };
//# sourceMappingURL=Binary.js.map