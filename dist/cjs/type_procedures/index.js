"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Binary_1 = __importDefault(require("./Binary"));
const String_1 = __importDefault(require("./String"));
const Number_1 = __importDefault(require("./Number"));
const Enum_1 = __importDefault(require("./Enum"));
const DateTime_1 = __importDefault(require("./DateTime"));
const TypeProcedures = [Binary_1.default, String_1.default, Number_1.default, DateTime_1.default, Enum_1.default];
exports.default = {
    getTypeProcedure: (type_string, field, options) => {
        const procedure = TypeProcedures.find((procedure) => procedure.type == type_string);
        return procedure.getProcedure(field, options);
    },
};
//What to do with options?
//# sourceMappingURL=index.js.map