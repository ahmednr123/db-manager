import { CommitActionProcedure, CommitType } from ".";
import { Diff } from "../SchemaDiffer";

const add = (table, diff: Diff) => {

}

const remove = (table, diff: Diff) => {

}

const update = (table, diff: Diff) => {

}

const diffAction: CommitActionProcedure = {type: CommitType.CONSTRAINTS, add, remove, update};
export default diffAction;