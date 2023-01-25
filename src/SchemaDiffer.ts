import { CommitAction, CommitType } from "./commit_procedures";
import { ColumnSchema, TableSchema } from "./Table";
import { ArrayChecker } from "./Util";

export interface Diff {
    type: CommitType,
    action: CommitAction,
    db_name: string,
    table_name: string,
    column_name?: string,
    old?: TableSchema | ColumnSchema | Array<string> | {table: string, column: string} | {property: string, value: any},
    new?: TableSchema | ColumnSchema | Array<string> | {table: string, column: string} | {property: string, value: any}
}

export default class SchemaDiffer {
    // FIRST: Coceptual data
    // SECOND: Concrete data
    private db_name: string;

    private first_table: TableSchema;
    private second_table: TableSchema;

    private diff_arr: Array<Diff>;

    constructor (db_name: string, first_table: TableSchema, second_table: TableSchema) {
        this.db_name = db_name;
        this.first_table = first_table;
        this.second_table = second_table;
    }

    public diff() : Array<Diff> {
        this.diff_arr = [];

        if (this.first_table.name != this.second_table.name) {
            console.log(`Table name mismatch: ${this.first_table.name} != ${this.second_table.name}`);
        }
    
        const arrayChecker = new ArrayChecker({
            getId: elem => elem.name,
            isEqualTo: (left, right) => left.name == right.name,
            onFound: (left, right) => this.columnDiffer(left, right),
        });
    
        arrayChecker.check(this.first_table.columns, this.second_table.columns, {
            onNotFound: elem => { 
                console.log(`Column to be removed: ${elem.name}`);
                this.diff_arr.push({
                    type: CommitType.COLUMN,
                    action: CommitAction.REMOVE,
                    db_name: this.db_name,
                    table_name: this.first_table.name,
                    column_name: elem.name,
                    old: {...elem} as ColumnSchema
                });
            },
        });
    
        arrayChecker.check(this.second_table.columns, this.first_table.columns, {
            onNotFound: elem => { 
                console.log(`Column to be added: ${elem.name}`);
                this.diff_arr.push({
                    type: CommitType.COLUMN,
                    action: CommitAction.ADD,
                    db_name: this.db_name,
                    table_name: this.first_table.name,
                    column_name: elem.name,
                    new: {...elem} as ColumnSchema
                });
            },
        });

        return this.diff_arr;
    }

    private getArrayDiff (first, second) {
        let add = [];
        let remove = [];

        for (let constraint of first)
            if (!second.includes(constraint))
                add.push(constraint);

        for (let constraint of second)
            if (!first.includes(constraint))
                remove.push(constraint);

        return {add, remove};
    }

    private isTypeOptsUpdated (first_opts, second_opts, opts) {
        let ret = false;
        for (let opt of opts) {
            if (first_opts[opt] 
                && second_opts[opt] 
                && first_opts[opts] == second_opts[opts]) 
            {
                ret = ret || false;
            }
        }
        return ret;
    }

    private isTypeUpdated (first, second) {
        // Field's required a database change
        // String: limit
        // Number: size, type, signed
        // Enum: enums
        // DateTime: format
        // Boolean
        let first_opts = first['options'];
        let second_opts = second['options'];
        switch (first['name']) {
            case 'string':
                return this.isTypeOptsUpdated(first_opts, second_opts, ['limit']);
            case 'number':
                return this.isTypeOptsUpdated(first_opts, second_opts, ['size', 'type', 'signed']);
            case 'datetime':
                return this.isTypeOptsUpdated(first_opts, second_opts, ['format']);
            case 'enum':
                let obj = this.getArrayDiff(first_opts['enums'], second_opts['enums']);
                return obj.add.length > 0 || obj.remove.length > 0;
        }
    }

    private columnDiffer (first_col, second_col) {
        this.propertyDiff (first_col, second_col, 'type', () => {
            let isTypeUpdated = this.isTypeUpdated(first_col['type'], second_col['type']);
            if (isTypeUpdated) {
                this.diff_arr.push({
                    type: CommitType.PROPERTY,
                    action: CommitAction.UPDATE,
                    db_name: this.db_name,
                    table_name: this.first_table.name,
                    column_name: first_col.name,
                    old: {
                        property: 'type',
                        value: second_col['type']
                    },
                    new: {
                        property: 'type',
                        value: first_col['type']
                    }
                });
            }
        });

        this.propertyDiff (first_col, second_col, 'constraints', () => {
            let obj = this.getArrayDiff(first_col['constraints'], second_col['constraints']);
            if (obj.add.length > 0 || obj.remove.length > 0) {
                this.diff_arr.push({
                    type: CommitType.CONSTRAINTS,
                    action: CommitAction.UPDATE,
                    db_name: this.db_name,
                    table_name: this.first_table.name,
                    column_name: first_col.name,
                    old: obj.remove,
                    new: obj.add
                });
            }
        });

        this.propertyDiff (first_col, second_col, 'foreign', () => {
            let is_foreign_updated = first_col['foreign'].table != second_col['foreign'].table
                || first_col['foreign'].column != second_col['foreign'].column;
            if (is_foreign_updated) {
                this.diff_arr.push({
                    type: CommitType.FOREIGN,
                    action: CommitAction.UPDATE,
                    db_name: this.db_name,
                    table_name: this.first_table.name,
                    column_name: first_col.name,
                    old: second_col['foreign'],
                    new: first_col['foreign']
                });
            }
        });

        this.propertyDiff (first_col, second_col, 'default', () => {
            if (first_col['default'] != second_col['default']) {
                this.diff_arr.push({
                    type: CommitType.PROPERTY,
                    action: CommitAction.UPDATE,
                    db_name: this.db_name,
                    table_name: this.first_table.name,
                    column_name: first_col.name,
                    old: {
                        property: 'default',
                        value: second_col['default']
                    },
                    new: {
                        property: 'default',
                        value: first_col['default']
                    }
                });
            }
        });
    }

    private propertyDiff (first_col, second_col, property, onFound) {
        if (first_col[property] && second_col[property]) {
            onFound();
        }

        if (!first_col[property] && second_col[property]) {
            console.log(`Property: "${property}" to be removed`);
            let type = CommitType.PROPERTY;
            let value = {
                property,
                value: second_col[property]
            };

            if (property == 'foreign') {
                type = CommitType.FOREIGN;
                value = {...second_col[property]};
            } else if (property == 'constraints') {
                type = CommitType.CONSTRAINTS;
                value = second_col[property].concat([]);
            }

            this.diff_arr.push({
                type,
                action: CommitAction.REMOVE,
                db_name: this.db_name,
                table_name: this.first_table.name,
                column_name: first_col.name,
                old: value
            });
        }
        
        if (!second_col[property] && first_col[property]) {
            console.log(`Property: "${property}" to be added`);
            let type = CommitType.PROPERTY;
            let value = {
                property,
                value: second_col[property]
            };

            if (property == 'foreign') {
                type = CommitType.FOREIGN;
                value = {...first_col[property]};
            } else if (property == 'constraints') {
                type = CommitType.CONSTRAINTS;
                value = first_col[property].concat([]);
            }

            this.diff_arr.push({
                type,
                action: CommitAction.ADD,
                db_name: this.db_name,
                table_name: this.first_table.name,
                column_name: first_col.name,
                new: value
            });
        }
    }
}