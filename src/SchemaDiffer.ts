import { ColumnSchema, Table, TableSchema } from "./Table";
import { ArrayChecker } from "./Util";

export interface Diff {
    table?: string,
    column?: string,
    property?: string,
    action: string,
    value?: string | number | Array<string | number> | {table: string, column: string},
    old_value?: string | number | Array<string | number> | {table: string, column: string},
    new_value?: string | number | Array<string | number> | {table: string, column: string},
    column_schema?: ColumnSchema,
    table_schema?: TableSchema
}

export default class SchemaDiffer {
    first_table: TableSchema;
    second_table: TableSchema;

    diff_arr: Array<Diff>; 

    constructor (first_table: TableSchema, second_table: TableSchema) {
        this.first_table = first_table;
        this.second_table = second_table;
    }

    diff() : Array<Diff> {
        if (this.first_table.name != this.second_table.name) {
            console.log(`Table name mismatch: ${this.first_table.name} != ${this.second_table.name}`);
        }
    
        const arrayChecker = new ArrayChecker({
            getId: elem => elem.__id,
            isEqualTo: (left, right) => left.__id == right.__id,
            onFound: (left, right) => this.columnDiff(left, right),
        });
    
        arrayChecker.check(this.first_table.columns, this.second_table.columns, {
            onNotFound: elem => { 
                console.log(`Column to be removed: ${elem.name}`);
                this.diff_arr.push({
                    table: this.first_table.name,
                    action: "column-remove",
                    column: elem.name
                });
            },
        });
    
        arrayChecker.check(this.second_table.columns, this.first_table.columns, {
            onNotFound: elem => { 
                console.log(`Column to be added: ${elem.name}`);
                this.diff_arr.push({
                    table: this.first_table.name,
                    action: "column-add",
                    column_schema: {...elem}
                });
            },
        });

        return this.diff_arr;
    }

    columnDiffer(first_col, second_col, visited_props, switch_cols) {
        const first = !switch_cols ? first_col : second_col;
        const second = !switch_cols ? second_col : first_col;
        for (let key in first) {
            if (visited_props[key]) {
                continue;
            }
            visited_props[key] = 1;

            if (!second[key]) { // Checking if property exists or not in the second schema
                const action = switch_cols ? "added" : "removed";
                console.log(`Property to be ${action}: ${key} = ${first[key]}`);
                this.diff_arr.push({
                    table: this.first_table.name,
                    column: first.name,
                    action: switch_cols? "property-add": "property-remove",
                    property: key,
                    value: first[key]
                });
                continue;
            }

            if (key == "constraints") {
                const arrayChecker = new ArrayChecker({
                    getId: elem => elem,
                    isEqualTo: (left, right) => left == right
                });
                arrayChecker.check(first[key], second[key], {
                    onNotFound: (elem) => {
                        console.log(`Contraint to be removed: ${elem}`);
                        this.diff_arr.push({
                            table: this.first_table.name,
                            column: first.name,
                            action: "constraint-remove",
                            property: key,
                            value: elem
                        });
                    }
                });
                arrayChecker.check(second[key], first[key], {
                    onNotFound: (elem) => {
                        console.log(`Contraint to be added: ${elem}`);
                        this.diff_arr.push({
                            table: this.first_table.name,
                            column: first.name,
                            action: "constraint-add",
                            property: key,
                            value: elem
                        });
                    }
                });
                continue;
            }

            if (key == "foreign") {
                //For either change the constraint has to be removed and added again.
                if (first[key].table != second[key].table 
                    || first[key].column != second[key].column) 
                {
                    console.log(`Foreign constraint to be updated: ${JSON.stringify(first[key])} => ${JSON.stringify(second[key])}`);
                    this.diff_arr.push({
                        table: this.first_table.name,
                        column: first.name,
                        action: "foreign-udpate",
                        property: key,
                        old_value: {...first[key]},
                        new_value: {...second[key]}
                    });
                }
                continue;
            }

            if (first[key] != second[key]) {
                console.log(`Property to be updated: ${key} = ${first[key]} => ${second[key]}`);
                this.diff_arr.push({
                    table: this.first_table.name,
                    column: first.name,
                    action: "value-udpate",
                    property: key,
                    old_value: first[key],
                    new_value: second[key]
                });
                continue;
            }
        }
    }

    columnDiff(first_col: ColumnSchema, second_col: ColumnSchema) {
        let visited_props = {};
        this.columnDiffer(first_col, second_col, visited_props, false);
        this.columnDiffer(first_col, second_col, visited_props, true);
    }
}