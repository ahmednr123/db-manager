"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getProcedure(name, options) {
    const obj = {
        name,
        options,
        getString: () => `number`,
        getMySQLType: () => {
            let sizes = ["tiny", "small", "medium", "big", "normal"];
            if (options.type == "float")
                return "float";
            if (sizes.includes(options.size)) {
                let size = options.size;
                size = size.replace("normal", "");
                return size + "int" + (options.unsigned ? " unsigned" : "");
            }
            throw new Error(`Number doesnt support size: ${options.size}`);
        },
        knex_handle: {
            create: (table, field) => {
                let col_builder = null;
                if (options.type == "float")
                    col_builder = table.float(field);
                else {
                    switch (options.size) {
                        case "tiny":
                            col_builder = table.tinyint(field);
                            break;
                        case "small":
                            col_builder = table.smallint(field);
                            break;
                        case "medium":
                            col_builder = table.mediumint(field);
                            break;
                        case "big": //Javascript doesnt support big integer
                            //So knex results the values in string format, avoid using this.
                            col_builder = table.bigint(field);
                            break;
                        default:
                            col_builder = table.integer(field);
                    }
                }
                if (options.unsigned)
                    col_builder.unsigned();
                return col_builder;
            },
            alter: (table, field) => {
                let col_builder = null;
                if (options.type == "float")
                    col_builder = table.float(field);
                else {
                    switch (options.size) {
                        case "tiny":
                            col_builder = table.tinyint(field);
                            break;
                        case "small":
                            col_builder = table.smallint(field);
                            break;
                        case "medium":
                            col_builder = table.mediumint(field);
                            break;
                        case "big":
                            col_builder = table.bigint(field);
                            break;
                        default:
                            col_builder = table.integer(field);
                    }
                }
                if (options.unsigned)
                    col_builder.unsigned();
                return col_builder;
            },
        },
    };
    return obj;
}
exports.default = { type: "number", getProcedure };
//# sourceMappingURL=Number.js.map