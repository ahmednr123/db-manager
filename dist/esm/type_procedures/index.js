import Binary from "./Binary";
import String from "./String";
import Number from "./Number";
import Enum from "./Enum";
import DateTime from "./DateTime";
const TypeProcedures = [Binary, String, Number, DateTime, Enum];
export default {
    getTypeProcedure: (type_string, field, options) => {
        const procedure = TypeProcedures.find((procedure) => procedure.type == type_string);
        return procedure.getProcedure(field, options);
    },
};
//What to do with options?
//# sourceMappingURL=index.js.map