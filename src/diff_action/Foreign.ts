import { CommitActionProcedure } from ".";
import { Diff } from "../SchemaDiffer";

const add = (diff: Diff) => {

}

const remove = (diff: Diff) => {

}

const update = (diff: Diff) => {

}

const diffAction: CommitActionProcedure = {add, remove, update};
export default diffAction;