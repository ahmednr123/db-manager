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
exports.SubTable = exports.Constraints = void 0;
const CommitProcedure_1 = __importDefault(require("./CommitProcedure"));
const Util_1 = __importDefault(require("./Util"));
var Constraints;
(function (Constraints) {
    Constraints["UNIQUE_KEY"] = "unique_key";
    Constraints["PRIMARY_KEY"] = "primary_key";
    Constraints["NOT_NULL"] = "not_null";
    Constraints["AUTO_INCREMENT"] = "auto_increment";
})(Constraints = exports.Constraints || (exports.Constraints = {}));
class SubTable {
    constructor(schema_handle) {
        this.schema_handle = schema_handle;
    }
    getName() {
        return this.schema_handle({ name: "", columns: [] }).name;
    }
    createIfNotExists(parent_schema, knex_handle, columns) {
        return __awaiter(this, void 0, void 0, function* () {
            let schema = this.schema_handle(parent_schema);
            if (columns)
                schema.columns = [...schema.columns, ...columns];
            schema.name = `$${parent_schema.name}_${schema.name}`;
            // _id has to exist for every table, even for map tables
            addColumnIfNotExists(schema, Util_1.default.getIDColumnSchema());
            if (!(yield knex_handle.schema.hasTable(schema.name))) {
                yield CommitProcedure_1.default.commitTable(schema, knex_handle);
            }
            return schema;
        });
    }
}
exports.SubTable = SubTable;
class Table {
    constructor(table_schema, sub_tables) {
        this.table_schema = table_schema;
        this.sub_tables = sub_tables || new Array();
        this.column_map = new Map();
    }
    addSubTable(sub_table, columns) {
        this.column_map.set(sub_table.getName(), [...columns]);
        this.sub_tables.push(sub_table);
    }
    createIfNotExists(db_name, db_config) {
        return __awaiter(this, void 0, void 0, function* () {
            let knex = db_config.getDatabaseHandle(db_name);
            // _id has to exist for every table, even for map tables
            addColumnIfNotExists(this.table_schema, Util_1.default.getIDColumnSchema());
            Table.schemas.set(this.table_schema.name, this.table_schema);
            if (!(yield knex.schema.hasTable(this.table_schema.name))) {
                yield CommitProcedure_1.default.commitTable(this.table_schema, knex);
            }
            if (this.sub_tables)
                for (let sub_table of this.sub_tables) {
                    let colunms = undefined;
                    if (this.column_map.has(sub_table.getName()))
                        colunms = this.column_map.get(sub_table.getName());
                    let sub_table_schema = yield sub_table.createIfNotExists(this.table_schema, knex, colunms);
                    Table.schemas.set(sub_table_schema.name, sub_table_schema);
                }
        });
    }
    static getAllSchemas() {
        return Table.schemas;
    }
}
exports.default = Table;
Table.schemas = new Map();
function addColumnIfNotExists(table_schema, column) {
    let exists = false;
    for (let _column of table_schema.columns) {
        if (_column.name == column.name) {
            exists = true;
        }
    }
    if (!exists) {
        table_schema.columns.push(column);
    }
}
//# sourceMappingURL=Table.js.map