"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeProcedure = exports.Type = exports.Util = exports.Constraints = exports.SubTable = exports.Table = exports.CommitProcedure = exports.DBConfig = void 0;
const CommitProcedure_1 = __importDefault(require("./CommitProcedure"));
var DBConfig_1 = require("./DBConfig");
Object.defineProperty(exports, "DBConfig", { enumerable: true, get: function () { return DBConfig_1.DBConfig; } });
const Table_1 = __importStar(require("./Table"));
const Util_1 = __importDefault(require("./Util"));
const Binary_1 = __importDefault(require("./type_procedures/Binary"));
const String_1 = __importDefault(require("./type_procedures/String"));
const Number_1 = __importDefault(require("./type_procedures/Number"));
const Enum_1 = __importDefault(require("./type_procedures/Enum"));
const DateTime_1 = __importDefault(require("./type_procedures/DateTime"));
const type_procedures_1 = __importDefault(require("./type_procedures"));
exports.CommitProcedure = CommitProcedure_1.default;
//export class DBConfig extends dbConfig {};
exports.Table = Table_1.default;
exports.SubTable = Table_1.SubTable;
exports.Constraints = Table_1.Constraints;
exports.Util = Util_1.default;
exports.Type = {
    Binary: Binary_1.default,
    String: String_1.default,
    Number: Number_1.default,
    Enum: Enum_1.default,
    DateTime: DateTime_1.default,
};
exports.TypeProcedure = type_procedures_1.default;
//# sourceMappingURL=index.js.map