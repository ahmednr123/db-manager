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
exports.DBConfig = void 0;
const knex_1 = __importDefault(require("knex"));
class DBConfig {
    constructor({ host, port, user, pass, }) {
        this.host = host;
        this.port = port;
        this.user = user;
        this.pass = pass;
        this.handles = new Map();
    }
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            // Maybe remove initialization, connection test
            let knex = (0, knex_1.default)({
                client: "mysql",
                connection: {
                    host: this.host,
                    port: this.port,
                    user: this.user,
                    password: this.pass,
                },
            });
            try {
                yield knex.raw("SHOW DATABASES");
                this.handles.set("*", knex);
            }
            catch (error) {
                console.log("Error: " + JSON.stringify(error, null, 2));
                throw new Error("Error connecting to DB");
            }
        });
    }
    getDatabaseHandle(db_name, config) {
        let dbHandle = this.handles.get(db_name);
        if (!dbHandle) {
            let connection = {
                host: this.host,
                port: this.port,
                user: this.user,
                password: this.pass,
            };
            if (config) {
                if (config.ssl && config.ssl === true)
                    connection.ssl = { rejectUnauthorized: true };
                if (config.pool)
                    connection.pool = config.pool;
            }
            if (db_name != "*")
                connection.database = db_name;
            // Add pools nd all later
            dbHandle = (0, knex_1.default)({ client: "mysql", connection });
            this.handles.set(db_name, dbHandle);
        }
        return dbHandle;
    }
    destroy(db_name) {
        if (db_name == "*") {
            throw new Error("Cannot destroy * db connection");
        }
        if (db_name) {
            let handle = this.handles.get(db_name);
            if (handle)
                handle.destroy();
            return;
        }
        let k;
        let iter = this.handles.keys();
        while ((k = iter.next()) && !k.done) {
            this.handles.get(k.value).destroy();
        }
    }
}
exports.DBConfig = DBConfig;
//# sourceMappingURL=DBConfig.js.map