import { Diff } from "../SchemaDiffer";

import TABLE from './Table';
import COLUMN from './Column';
import PROPERTY from './Property';
import CONSTRAINTS from './Constraints';
import FOREIGN from './Foreign';

export enum CommitType {
    TABLE, COLUMN, PROPERTY, CONSTRAINTS, FOREIGN
}

export enum CommitAction {
    ADD, REMOVE, UPDATE
}

export interface CommitActionProcedure {
    type: CommitType,

    add:    (knex_table_handle, diff: Diff, raw_cmds) => void,
    remove: (knex_table_handle, diff: Diff, raw_cmds) => void,
    update: (knex_table_handle, diff: Diff, raw_cmds) => void
}

const CommitProcedures: Array<CommitActionProcedure> = [
    TABLE,
    COLUMN,
    PROPERTY,
    CONSTRAINTS,
    FOREIGN
];

export default {
    getCommitProcedure: (commitType: CommitType) => {
        return CommitProcedures.find(proc => proc.type == commitType)
    }
}