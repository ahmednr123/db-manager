"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Table_1 = require("./Table");
const type_procedures_1 = __importDefault(require("./type_procedures"));
exports.default = {
    commitTable: (table_schema, knex_handle) => __awaiter(void 0, void 0, void 0, function* () {
        let raw_cmds = [];
        yield knex_handle.schema.createTable(table_schema.name, (table) => {
            for (let col of table_schema.columns) {
                let type_procedure = type_procedures_1.default.getTypeProcedure(col.type.name, col.name, col.type.options);
                let col_builder = type_procedure.knex_handle.create(table, col.name);
                // constraints
                if (col.constraints)
                    for (let constraint of col.constraints) {
                        switch (constraint) {
                            case Table_1.Constraints.NOT_NULL:
                                col_builder = col_builder.notNullable();
                                break;
                            case Table_1.Constraints.PRIMARY_KEY:
                                col_builder = col_builder.primary();
                                break;
                            case Table_1.Constraints.UNIQUE_KEY:
                                col_builder = col_builder.unique();
                                break;
                            case Table_1.Constraints.AUTO_INCREMENT:
                                //auto_increment (add to an array to run knex.raw commands later)
                                raw_cmds.push(function (knex) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        // Check if default is required while doing this
                                        yield knex.raw(`ALTER TABLE ${table_schema.name} MODIFY COLUMN ${col.name} ${type_procedure.getMySQLType()} auto_increment`);
                                    });
                                });
                                break;
                        }
                    }
                // default
                if (col.default) {
                    if (col.default == "_now_")
                        col_builder.defaultTo(knex_handle.fn.now());
                    else if (col.default == "_uuid_binary_")
                        col_builder.defaultTo(knex_handle.raw("(UUID_TO_BIN(UUID()))"));
                    else
                        col_builder.defaultTo(col.default);
                }
                // foreign
                /*if (col.foreign) {
                  col_builder.references(col.foreign.column).inTable(col.foreign.table);
                }*/
            }
        });
        for (let raw_cmd of raw_cmds) {
            yield raw_cmd(knex_handle);
        }
    }),
};
//# sourceMappingURL=CommitProcedure.js.map