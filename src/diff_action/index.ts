import { Diff } from "../SchemaDiffer";

export enum CommitType {
    TABLE, COLUMN, PROPERTY, CONSTRAINTS, FOREIGN
}

export enum CommitAction {
    ADD, REMOVE, UPDATE
}

export interface CommitActionProcedure {
    add:    (diff: Diff) => void,
    remove: (diff: Diff) => void,
    update: (diff: Diff) => void
}