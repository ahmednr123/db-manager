import { TableSchema } from "./Table";
import { DataTypes } from "./datatypes";

interface Callbacks {
    getId?: (elem: any) => any, 
    isEqualTo?: (left: any, right: any) => boolean, 
    onNotFound?: (elem: any) => void, 
    onFound?: (left: any, right: any) => void
}


// Used to compare two arrays and trigger methods 
// on finding or not finding the similar elements
export class ArrayChecker {
    visited_elems = {}
    callbacks = {
        getId: (elem) => null,
        isEqualTo: (left, right) => null,
        onNotFound: (elem) => null,
        onFound: (left, right) => null
    }

    constructor (callbacks: Callbacks) {
        this.callbacks.getId = callbacks.getId || this.callbacks.getId;
        this.callbacks.isEqualTo = callbacks.isEqualTo || this.callbacks.isEqualTo;
        this.callbacks.onNotFound = callbacks.onNotFound || this.callbacks.onNotFound;
        this.callbacks.onFound = callbacks.onFound || this.callbacks.onFound;
    }

    check (f_arr, s_arr, callbacks: Callbacks) {
        const _getId = callbacks.getId || this.callbacks.getId;
        const _isEqualTo = callbacks.isEqualTo || this.callbacks.isEqualTo;
        const _onNotFound = callbacks.onNotFound || this.callbacks.onNotFound;
        const _onFound = callbacks.onFound || this.callbacks.onFound;

        for (let f_elem of f_arr) {
            if (this.visited_elems[_getId(f_elem)]) continue;
            this.visited_elems[_getId(f_elem)] = 1;
            let s_elem = s_arr.find(elem => _isEqualTo(f_elem, elem));
            if (!s_elem) {
                _onNotFound(f_elem)
                continue;
            }
            _onFound(f_elem, s_elem);
        }
    }
}

export function parseStringToTableSchema (schema_str: string): TableSchema {
    let schema = JSON.parse(schema_str);
    for (let column of schema.columns) {
        column.type = DataTypes.find(type => type.matchType(column.type));
    }
    return schema as TableSchema;
}