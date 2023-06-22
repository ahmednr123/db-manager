// datetime.options { date_enabled, time_enabled, format }
// false && false => ???
// date_enabled => date
// time_enabled => time
// date_enalbed && time_enabled => datetime
// TODO: Have to add the above functionality
function getProcedure(name, options) {
    const obj = {
        name,
        options,
        getString: () => `datetime`,
        getMySQLType: () => `datetime`,
        knex_handle: {
            create: (table, field) => {
                return table.datetime(field);
            },
            alter: (table, field) => {
                return table.datetime(field);
            },
        },
    };
    return obj;
}
export default { type: "datetime", getProcedure };
//# sourceMappingURL=DateTime.js.map