import { Knex } from "knex";
import { Diff } from "../SchemaDiffer";

import ColumnAdd from "./ColumnAdd";
import ColumnRemove from "./ColumnRemove";
import ConstraintAdd from "./ConstraintAdd";
import ConstraintRemove from "./ConstraintRemove";
import ForeignUpdate from "./ForeignUpdate";
import PropertyAdd from "./PropertyAdd";
import PropertyRemove from "./PropertyRemove";
import TableAdd from "./TableAdd";
import TableRemove from "./TableRemove";
import ValueUpdate from "./ValueUpdate";

export interface IDiffAction {
    commit: (knex: Knex, diff: Diff) => void
}

export const DiffActions = {
    ColumnAdd,
    ColumnRemove,
    ConstraintAdd,
    ConstraintRemove,
    ForeignUpdate,
    PropertyAdd,
    PropertyRemove,
    TableAdd,
    TableRemove,
    ValueUpdate
};