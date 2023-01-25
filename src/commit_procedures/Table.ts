import { CommitActionProcedure, CommitType } from ".";
import { Diff } from "../SchemaDiffer";

const add = (table, diff: Diff, raw_cmds) => {
    throw new Error('Table commit procedure is not ready for usage');
}

const remove = (table, diff: Diff, raw_cmds) => {
    throw new Error('Table commit procedure is not ready for usage');
}

const update = (table, diff: Diff, raw_cmds) => {
    throw new Error('Table commit procedure is not ready for usage');
}

const diffAction: CommitActionProcedure = {type: CommitType.TABLE, add, remove, update};
export default diffAction;